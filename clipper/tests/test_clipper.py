"""Tests for the clip pipeline.

Run: python -m unittest discover -s tests -v
"""

from __future__ import annotations

import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

from clipper import candidates as candidates_mod
from clipper.captions import build_ass
from clipper.model import Candidate, ClipSpec, Transcript, Weights, Word
from clipper.score import (
    coherence_score,
    emotion_score,
    hook_score,
    length_fit_score,
    pace_score,
    payoff_score,
    quotable_score,
    standalone_score,
)

HAS_FFMPEG = shutil.which("ffmpeg") is not None


def words_from(text: str, start: float = 0.0, wps: float = 2.8) -> list[Word]:
    """Lay `text` out on a regular cadence so timing-based signals are testable."""
    step = 1.0 / wps
    out = []
    clock = start
    for token in text.split():
        out.append(Word(text=token, start=clock, end=clock + step * 0.85))
        clock += step
    return out


class TestHookScore(unittest.TestCase):
    def test_contrarian_beats_bland(self):
        contrarian = hook_score("Most people think saving is enough, but it actually isn't.")
        bland = hook_score("So we went to the store and then we came back home again.")
        self.assertGreater(contrarian, bland)
        self.assertGreater(contrarian, 0.7)

    def test_question_opener_scores(self):
        self.assertGreater(hook_score("Why does nobody talk about this?"), 0.6)

    def test_numbers_register(self):
        self.assertGreater(hook_score("I lost 40000 dollars in a single afternoon."), 0.5)

    def test_only_the_opening_counts(self):
        buried = "and then we walked around for a while " * 4 + "here's why that matters"
        self.assertLess(hook_score(buried), 0.5)

    def test_empty_is_zero(self):
        self.assertEqual(hook_score(""), 0.0)


class TestStandaloneScore(unittest.TestCase):
    def test_dangling_opener_penalised(self):
        clean = standalone_score("Compound interest is the whole game.")
        dangling = standalone_score("And so that's the whole game really.")
        self.assertGreater(clean, dangling)

    def test_backreference_penalised(self):
        self.assertLess(standalone_score("As I said earlier, the market moves first."), 0.7)

    def test_clean_text_scores_full(self):
        self.assertEqual(standalone_score("Compound interest is the whole game."), 1.0)


class TestOtherSignals(unittest.TestCase):
    def test_payoff_rewards_resolution(self):
        resolved = payoff_score(
            "I tried it for a year and tracked every result carefully. "
            "That's why I stopped doing it entirely."
        )
        trailing = payoff_score(
            "I tried it for a year and tracked every result carefully and "
            "there was more stuff going on and other things too and"
        )
        self.assertGreater(resolved, trailing)

    def test_quotable_penalises_filler(self):
        tight = quotable_score("Discipline beats motivation. Every single time.")
        rambling = quotable_score(
            "So like, um, basically it's kind of, you know, actually literally "
            "sort of like the thing, um, right, obviously."
        )
        self.assertGreater(tight, rambling)

    def test_pace_penalises_dead_air(self):
        steady = pace_score(words_from("this is a normal sentence spoken at a normal speed"))
        gappy = words_from("this is a normal sentence")
        gappy.append(Word(text="finally", start=gappy[-1].end + 5.0, end=gappy[-1].end + 5.4))
        self.assertGreater(steady, pace_score(gappy))

    def test_pace_needs_two_words(self):
        self.assertEqual(pace_score([Word("hi", 0.0, 0.3)]), 0.0)

    def test_emotion_detects_intensity(self):
        hot = emotion_score("That was absolutely insane and completely ridiculous!")
        cold = emotion_score("The report was submitted on the usual date.")
        self.assertGreater(hot, cold)

    def test_coherence_prefers_on_topic(self):
        focused = coherence_score(
            "Bitcoin mining consumes enormous power. Mining rigs run constantly. "
            "That power cost decides whether mining stays profitable at all here."
        )
        scattered = coherence_score(
            "Bitcoin mining consumes enormous power. My dog needs a haircut soon. "
            "The weather in Lisbon was pleasant during the spring festival there."
        )
        self.assertGreater(focused, scattered)

    def test_length_fit_peaks_at_target(self):
        self.assertGreater(length_fit_score(34.0, 34.0), length_fit_score(58.0, 34.0))
        self.assertAlmostEqual(length_fit_score(34.0, 34.0), 1.0, places=6)


class TestSentenceBounds(unittest.TestCase):
    def test_splits_on_punctuation(self):
        words = words_from("first sentence here. second sentence here. third one.")
        self.assertEqual(len(candidates_mod.sentence_bounds(words)), 3)

    def test_long_pause_also_splits(self):
        words = words_from("unpunctuated speech happens often in transcripts")
        tail = words_from("but a pause still ends it", start=words[-1].end + 1.5)
        bounds = candidates_mod.sentence_bounds(words + tail)
        self.assertGreaterEqual(len(bounds), 2)

    def test_trailing_words_are_kept(self):
        words = words_from("no terminal punctuation at all here")
        bounds = candidates_mod.sentence_bounds(words)
        self.assertEqual(bounds[-1][1], len(words))


class TestCandidateGeneration(unittest.TestCase):
    def _transcript(self) -> Transcript:
        script = (
            "Most people think you need a huge audience, but that is completely wrong. "
            "I built my first profitable channel with under two thousand followers. "
            "The whole thing came down to one repeatable format that I ran every day. "
            "So that's why follower count stopped mattering to me entirely. "
            "And then we sort of, um, went and did other unrelated things for a while. "
            "It was fine I guess and nothing much really happened after that at all. "
        ) * 2
        return Transcript(words=words_from(script), duration=200.0)

    def test_generates_within_duration_bounds(self):
        found = candidates_mod.generate(
            self._transcript(), Weights(), min_duration=15.0, max_duration=45.0
        )
        self.assertTrue(found)
        for candidate in found:
            self.assertGreaterEqual(candidate.duration, 15.0)
            self.assertLessEqual(candidate.duration, 45.0)

    def test_sorted_by_score_descending(self):
        found = candidates_mod.generate(self._transcript(), Weights())
        scores = [c.score for c in found]
        self.assertEqual(scores, sorted(scores, reverse=True))

    def test_select_suppresses_overlap(self):
        found = candidates_mod.generate(self._transcript(), Weights())
        chosen = candidates_mod.select(found, limit=5, max_overlap=0.25)
        for i, a in enumerate(chosen):
            for b in chosen[i + 1:]:
                self.assertLessEqual(a.overlaps(b), 0.25)

    def test_select_respects_limit(self):
        found = candidates_mod.generate(self._transcript(), Weights())
        self.assertLessEqual(len(candidates_mod.select(found, limit=3)), 3)


class TestOverlap(unittest.TestCase):
    def test_disjoint_is_zero(self):
        a = Candidate(0.0, 10.0, "a")
        b = Candidate(20.0, 30.0, "b")
        self.assertEqual(a.overlaps(b), 0.0)

    def test_contained_is_total(self):
        outer = Candidate(0.0, 40.0, "outer")
        inner = Candidate(10.0, 20.0, "inner")
        self.assertAlmostEqual(outer.overlaps(inner), 1.0)


class TestWeights(unittest.TestCase):
    def test_rejects_unknown_weight(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "w.json"
            path.write_text('{"hook": 3.0, "vibes": 9.0}')
            with self.assertRaises(ValueError) as caught:
                Weights.load(path)
            self.assertIn("vibes", str(caught.exception))

    def test_loads_known_weights(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "w.json"
            path.write_text('{"hook": 5.0}')
            self.assertEqual(Weights.load(path).hook, 5.0)


class TestCaptions(unittest.TestCase):
    def setUp(self):
        self.words = words_from("one two three four five six seven", start=10.0)
        self.spec = ClipSpec(words_per_caption=3)
        self.ass = build_ass(self.words, clip_start=10.0, spec=self.spec)

    def test_has_ass_structure(self):
        self.assertIn("[Script Info]", self.ass)
        self.assertIn("[V4+ Styles]", self.ass)
        self.assertIn("[Events]", self.ass)

    def test_one_event_per_word(self):
        events = [l for l in self.ass.splitlines() if l.startswith("Dialogue:")]
        self.assertEqual(len(events), len(self.words))

    def test_times_are_clip_relative(self):
        first = [l for l in self.ass.splitlines() if l.startswith("Dialogue:")][0]
        # clip_start == first word start, so the first event begins at zero.
        self.assertIn("0:00:00.00", first)

    def test_highlight_colour_present(self):
        self.assertIn(self.spec.highlight_colour, self.ass)

    def test_braces_escaped(self):
        ass = build_ass([Word("{oops}", 0.0, 0.4)], 0.0, ClipSpec())
        body = ass.split("[Events]")[1]
        # The only braces left are our own override tags.
        self.assertNotIn("{oops}", body)
        self.assertIn("(oops)", body)


@unittest.skipUnless(HAS_FFMPEG, "ffmpeg not available")
class TestRender(unittest.TestCase):
    """End-to-end render against a generated landscape source."""

    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.source = Path(cls.tmp.name) / "source.mp4"
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error",
             "-f", "lavfi", "-i", "testsrc=size=1280x720:rate=30:duration=12",
             "-f", "lavfi", "-i", "sine=frequency=440:duration=12",
             "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac",
             str(cls.source)],
            check=True,
        )

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def _dimensions(self, path: Path) -> tuple[int, int]:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height", "-of", "csv=p=0", str(path)],
            capture_output=True, text=True, check=True,
        )
        width, height = result.stdout.strip().split(",")[:2]
        return int(width), int(height)

    def _render(self, spec: ClipSpec, name: str) -> Path:
        from clipper.render import render_clip

        words = words_from("this is a rendered test clip with burned captions", start=2.0)
        transcript = Transcript(words=words, duration=12.0)
        candidate = Candidate(start=2.0, end=8.0, text=" ".join(w.text for w in words))
        out = Path(self.tmp.name) / name
        return render_clip(self.source, candidate, transcript, out, spec)

    def test_blur_reframe_is_vertical(self):
        out = self._render(ClipSpec(reframe="blur"), "blur.mp4")
        self.assertTrue(out.exists())
        self.assertGreater(out.stat().st_size, 1000)
        self.assertEqual(self._dimensions(out), (1080, 1920))

    def test_crop_reframe_is_vertical(self):
        out = self._render(ClipSpec(reframe="crop"), "crop.mp4")
        self.assertEqual(self._dimensions(out), (1080, 1920))

    def test_renders_without_captions(self):
        out = self._render(ClipSpec(captions=False), "plain.mp4")
        self.assertTrue(out.exists())

    def test_cover_frame(self):
        from clipper.render import render_cover

        candidate = Candidate(start=2.0, end=8.0, text="cover")
        out = render_cover(self.source, candidate, Path(self.tmp.name) / "cover.jpg")
        self.assertTrue(out.exists())
        self.assertEqual(self._dimensions(out), (1080, 1920))


if __name__ == "__main__":
    unittest.main()
