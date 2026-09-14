"""Core data types for the clip pipeline."""

from __future__ import annotations

import json
from dataclasses import dataclass, field, asdict
from pathlib import Path


@dataclass
class Word:
    """A single spoken word with its timing, as emitted by the ASR pass."""

    text: str
    start: float
    end: float

    @property
    def duration(self) -> float:
        return max(0.0, self.end - self.start)


@dataclass
class Transcript:
    """A full transcript. `words` is the source of truth; segments are advisory."""

    words: list[Word]
    language: str = "en"
    source: str = ""
    duration: float = 0.0

    def text(self) -> str:
        return " ".join(w.text for w in self.words)

    def words_between(self, start: float, end: float) -> list[Word]:
        return [w for w in self.words if w.start >= start and w.end <= end]

    def to_json(self, path: Path) -> None:
        payload = {
            "language": self.language,
            "source": self.source,
            "duration": self.duration,
            "words": [asdict(w) for w in self.words],
        }
        path.write_text(json.dumps(payload, indent=2))

    @classmethod
    def from_json(cls, path: Path) -> "Transcript":
        payload = json.loads(path.read_text())
        return cls(
            words=[Word(**w) for w in payload["words"]],
            language=payload.get("language", "en"),
            source=payload.get("source", ""),
            duration=payload.get("duration", 0.0),
        )


@dataclass
class Candidate:
    """A proposed clip: a time range, its text, and why the scorer liked it."""

    start: float
    end: float
    text: str
    signals: dict[str, float] = field(default_factory=dict)
    score: float = 0.0

    @property
    def duration(self) -> float:
        return self.end - self.start

    def overlaps(self, other: "Candidate") -> float:
        """Fraction of the shorter clip that overlaps the other. 0.0 = disjoint."""
        latest_start = max(self.start, other.start)
        earliest_end = min(self.end, other.end)
        overlap = max(0.0, earliest_end - latest_start)
        shortest = min(self.duration, other.duration)
        return overlap / shortest if shortest > 0 else 0.0

    def reason(self) -> str:
        """The three strongest signals, for explaining a ranking to a human."""
        top = sorted(self.signals.items(), key=lambda kv: kv[1], reverse=True)[:3]
        return ", ".join(f"{name} {value:.2f}" for name, value in top)


@dataclass
class Weights:
    """Per-signal weights for the scorer.

    These are the tuning surface. Different niches reward different things: a
    talking-head finance clip lives on `hook` and `standalone`, a comedy clip on
    `emotion` and `pace`. Override in a JSON file rather than editing source.
    """

    hook: float = 2.4
    standalone: float = 1.8
    payoff: float = 1.2
    quotable: float = 1.0
    pace: float = 1.0
    emotion: float = 1.1
    coherence: float = 0.9
    length_fit: float = 1.3

    @classmethod
    def load(cls, path: Path | None) -> "Weights":
        if path is None:
            return cls()
        data = json.loads(Path(path).read_text())
        known = {f for f in cls.__dataclass_fields__}
        unknown = set(data) - known
        if unknown:
            raise ValueError(
                f"unknown weight(s): {', '.join(sorted(unknown))}. "
                f"valid: {', '.join(sorted(known))}"
            )
        return cls(**data)

    def total(self) -> float:
        return sum(getattr(self, f) for f in self.__dataclass_fields__)


@dataclass
class ClipSpec:
    """Render settings for one output clip."""

    target_width: int = 1080
    target_height: int = 1920
    reframe: str = "blur"  # "blur" | "crop"
    encoder: str = "auto"  # "auto" | "nvenc" | "cpu"
    captions: bool = True
    words_per_caption: int = 3
    loudness_lufs: float = -14.0
    font: str = "DejaVu Sans"
    font_size: int = 92
    highlight_colour: str = "&H0000E5FF"  # ASS BGR — amber
    base_colour: str = "&H00FFFFFF"
