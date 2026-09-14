"""The clip scorer.

Eight signals, each normalised to 0..1, combined as a weighted mean. Every
signal is deliberately transparent: you can read why a clip ranked where it did
and tune the weights per niche, which you cannot do with an opaque model.

The signals encode what makes a short-form clip survive the first three seconds
and hold to the end:

  hook        does the opening earn attention
  standalone  does it make sense without the surrounding hour
  payoff      does it resolve rather than trail off
  quotable    tight declarative sentences over rambling ones
  pace        words per second in the engaging band, no dead air
  emotion     intensity, emphasis, laughter
  coherence   stays on one topic start to finish
  length_fit  lands near the target duration
"""

from __future__ import annotations

import math
import re

from .model import Candidate, Weights, Word

# --- lexicons ---------------------------------------------------------------

FILLER = frozenset(
    """um uh er ah like basically literally actually honestly obviously
    anyway whatever sorta kinda right okay ok yeah yknow""".split()
)

STOPWORDS = frozenset(
    """a an the and or but if then than that this these those of to in on at by
    for with from as is are was were be been being am do does did doing have has
    had having i you he she it we they me him her them my your his its our their
    not no so very just really too also about into over under out up down what
    which who whom when where why how all any both each few more most other some
    such only own same can will would should could may might must shall there
    here because while during before after above below between through""".split()
)

INTENSITY = frozenset(
    """insane crazy wild unbelievable ridiculous shocking brutal massive huge
    enormous terrible awful amazing incredible extraordinary devastating stunning
    outrageous absurd hilarious furious terrifying obsessed destroyed exploded
    skyrocketed collapsed nightmare disaster miracle genius stupid idiotic
    love hate fear panic desperate thrilled horrified never always everything
    nothing everyone nobody""".split()
)

LAUGHTER = re.compile(r"\b(haha+|lol|lmao)\b|\[laugh\w*\]|\(laugh\w*\)", re.I)

# Opening patterns worth attention, with how much each is worth.
HOOK_PATTERNS: list[tuple[re.Pattern[str], float, str]] = [
    (re.compile(r"\b(most people|everyone|nobody|no one|they tell you)\b[^.?!]{0,60}\b"
                r"(but|however|actually|wrong|isn'?t|aren'?t|don'?t)\b", re.I), 1.00, "contrarian"),
    (re.compile(r"\bhere'?s (why|how|what|the)\b|\bthe (secret|truth|reason|trick|problem|mistake) (is|was)\b", re.I), 0.95, "promise"),
    (re.compile(r"^\s*(what|why|how|who|when|where|which)\b", re.I), 0.90, "question-open"),
    (re.compile(r"^\s*(stop|never|always|don'?t|listen|look|imagine)\b", re.I), 0.80, "imperative"),
    (re.compile(r"\b\d+(\.\d+)?\s*(%|percent|x|times|million|billion|thousand|dollars|bucks|k)\b", re.I), 0.75, "number"),
    (re.compile(r"\b(biggest|worst|best|fastest|hardest|only|single most)\b", re.I), 0.55, "superlative"),
    (re.compile(r"^\s*(i|we)\s+(was|were|used to|had|lost|made|spent|quit|tried)\b", re.I), 0.50, "story-open"),
    (re.compile(r"\byou\b", re.I), 0.30, "direct-address"),
]

# Openings that signal the clip starts mid-thought.
DANGLING_OPEN = re.compile(
    r"^\s*(and|but|so|then|because|which|also|plus|anyway|however|therefore|"
    r"that'?s why|which means|he|she|they|it|this|that|those|these)\b",
    re.I,
)

BACKREFERENCE = re.compile(
    r"\b(as i (said|mentioned)|like i said|going back to|as we discussed|"
    r"that (guy|thing|one|point)|the (former|latter)|earlier i)\b",
    re.I,
)

PAYOFF = re.compile(
    r"\b(so that'?s|that'?s why|that'?s how|the point is|which means|in other words|"
    r"bottom line|the lesson|and that'?s|turns out|the result was)\b",
    re.I,
)

SENTENCE_END = re.compile(r"[.!?]+")


# --- helpers ----------------------------------------------------------------

def _tokens(text: str) -> list[str]:
    return re.findall(r"[a-z0-9']+", text.lower())


def _clamp(value: float) -> float:
    return max(0.0, min(1.0, value))


def _content_words(text: str) -> set[str]:
    return {t for t in _tokens(text) if t not in STOPWORDS and len(t) > 2}


# --- individual signals -----------------------------------------------------

def hook_score(text: str, opening_words: int = 22) -> float:
    """Strength of the opening. Only the first ~22 words can hook anyone."""
    opening = " ".join(text.split()[:opening_words])
    if not opening:
        return 0.0
    best = 0.0
    accumulated = 0.0
    for pattern, value, _name in HOOK_PATTERNS:
        if pattern.search(opening):
            best = max(best, value)
            accumulated += value * 0.25
    # A strong single hook matters more than many weak ones, but stacking helps.
    return _clamp(best + min(accumulated, 0.3))


def standalone_score(text: str) -> float:
    """Penalise clips that open mid-thought or lean on unstated context."""
    score = 1.0
    head = " ".join(text.split()[:12])
    if DANGLING_OPEN.match(text.strip()):
        score -= 0.45
    if BACKREFERENCE.search(head):
        score -= 0.35
    elif BACKREFERENCE.search(text):
        score -= 0.15
    return _clamp(score)


def payoff_score(text: str) -> float:
    """Reward a resolution in the final third rather than a trailing-off."""
    words = text.split()
    if len(words) < 12:
        return 0.3
    tail = " ".join(words[int(len(words) * 0.6):])
    hits = len(PAYOFF.findall(tail))
    ends_clean = bool(SENTENCE_END.search(text.strip()[-3:]))
    return _clamp(min(hits, 2) * 0.4 + (0.3 if ends_clean else 0.0))


def quotable_score(text: str) -> float:
    """Tight declarative sentences, low filler."""
    toks = _tokens(text)
    if not toks:
        return 0.0
    filler_ratio = sum(1 for t in toks if t in FILLER) / len(toks)
    sentences = [s for s in SENTENCE_END.split(text) if s.strip()]
    if sentences:
        mean_len = sum(len(s.split()) for s in sentences) / len(sentences)
        # 6-14 words per sentence is the quotable band.
        length_term = math.exp(-((mean_len - 10.0) ** 2) / (2 * 6.0**2))
    else:
        length_term = 0.3
    content_ratio = len(_content_words(text)) / len(set(toks))
    return _clamp(0.5 * length_term + 0.3 * content_ratio + 0.2 * (1 - min(filler_ratio * 6, 1.0)))


def pace_score(words: list[Word]) -> float:
    """Words per second in the engaging band, penalised for dead air."""
    if len(words) < 2:
        return 0.0
    span = words[-1].end - words[0].start
    if span <= 0:
        return 0.0
    wps = len(words) / span
    # 2.2-3.4 words/sec is conversational-engaging; slower drags, faster garbles.
    band = math.exp(-((wps - 2.8) ** 2) / (2 * 0.65**2))
    gaps = [b.start - a.end for a, b in zip(words, words[1:])]
    longest_gap = max(gaps) if gaps else 0.0
    silence_penalty = _clamp((longest_gap - 0.8) / 2.0)
    return _clamp(band * (1 - silence_penalty))


def emotion_score(text: str) -> float:
    toks = _tokens(text)
    if not toks:
        return 0.0
    intensity_hits = sum(1 for t in toks if t in INTENSITY)
    density = intensity_hits / len(toks)
    laughter = 0.25 if LAUGHTER.search(text) else 0.0
    exclamations = min(text.count("!") * 0.1, 0.2)
    return _clamp(min(density * 18, 0.7) + laughter + exclamations)


def coherence_score(text: str) -> float:
    """Content-word overlap between the halves — does it stay on topic."""
    words = text.split()
    if len(words) < 16:
        return 0.5
    midpoint = len(words) // 2
    first = _content_words(" ".join(words[:midpoint]))
    second = _content_words(" ".join(words[midpoint:]))
    if not first or not second:
        return 0.3
    overlap = len(first & second) / len(first | second)
    # Total overlap means repetition; none means it wandered. ~0.25 is healthy.
    return _clamp(math.exp(-((overlap - 0.25) ** 2) / (2 * 0.18**2)))


def length_fit_score(duration: float, target: float, spread: float = 12.0) -> float:
    return _clamp(math.exp(-((duration - target) ** 2) / (2 * spread**2)))


# --- combination ------------------------------------------------------------

def score_candidate(
    candidate: Candidate,
    words: list[Word],
    weights: Weights,
    target_duration: float,
) -> Candidate:
    """Attach per-signal scores and a weighted total to `candidate`."""
    text = candidate.text
    candidate.signals = {
        "hook": hook_score(text),
        "standalone": standalone_score(text),
        "payoff": payoff_score(text),
        "quotable": quotable_score(text),
        "pace": pace_score(words),
        "emotion": emotion_score(text),
        "coherence": coherence_score(text),
        "length_fit": length_fit_score(candidate.duration, target_duration),
    }
    weighted = sum(
        candidate.signals[name] * getattr(weights, name)
        for name in candidate.signals
    )
    candidate.score = weighted / weights.total()
    return candidate
