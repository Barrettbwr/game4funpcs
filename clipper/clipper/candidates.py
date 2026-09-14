"""Turn a transcript into ranked, non-overlapping clip candidates."""

from __future__ import annotations

import re

from .model import Candidate, Transcript, Weights, Word
from .score import score_candidate

SENTENCE_FINAL = re.compile(r"[.!?]\"?$")


def sentence_bounds(words: list[Word]) -> list[tuple[int, int]]:
    """Index ranges [start, end) for each sentence.

    ASR output is unreliably punctuated, so a long pause also closes a sentence
    — otherwise an unpunctuated stretch becomes one giant unusable unit.
    """
    bounds: list[tuple[int, int]] = []
    start = 0
    for i, word in enumerate(words):
        gap_after = words[i + 1].start - word.end if i + 1 < len(words) else 0.0
        if SENTENCE_FINAL.search(word.text) or gap_after > 0.9:
            bounds.append((start, i + 1))
            start = i + 1
    if start < len(words):
        bounds.append((start, len(words)))
    return bounds


def generate(
    transcript: Transcript,
    weights: Weights,
    min_duration: float = 18.0,
    max_duration: float = 60.0,
    target_duration: float = 34.0,
) -> list[Candidate]:
    """Score every sentence-aligned window inside the duration bounds."""
    words = transcript.words
    bounds = sentence_bounds(words)
    candidates: list[Candidate] = []

    for i, (start_idx, _) in enumerate(bounds):
        for _, end_idx in bounds[i:]:
            span_words = words[start_idx:end_idx]
            if len(span_words) < 8:
                continue
            duration = span_words[-1].end - span_words[0].start
            if duration < min_duration:
                continue
            if duration > max_duration:
                break  # sentences only get later; no shorter window from here
            text = " ".join(w.text for w in span_words).strip()
            candidate = Candidate(
                start=span_words[0].start,
                end=span_words[-1].end,
                text=text,
            )
            candidates.append(
                score_candidate(candidate, span_words, weights, target_duration)
            )

    return sorted(candidates, key=lambda c: c.score, reverse=True)


def select(
    candidates: list[Candidate],
    limit: int = 10,
    max_overlap: float = 0.25,
) -> list[Candidate]:
    """Greedy non-maximum suppression: best first, drop heavy overlaps.

    Without this you get ten near-identical clips of the single best moment.
    """
    chosen: list[Candidate] = []
    for candidate in candidates:
        if len(chosen) >= limit:
            break
        if any(candidate.overlaps(kept) > max_overlap for kept in chosen):
            continue
        chosen.append(candidate)
    return chosen
