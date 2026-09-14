"""Audio extraction and word-level transcription."""

from __future__ import annotations

import json
import subprocess
import tempfile
from pathlib import Path

from .model import Transcript, Word


def probe_duration(source: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "json", str(source)],
        capture_output=True, text=True, check=True,
    )
    return float(json.loads(result.stdout)["format"]["duration"])


def extract_audio(source: Path, destination: Path) -> Path:
    """16 kHz mono WAV — what Whisper wants, and small enough to be quick."""
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(source),
         "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(destination)],
        check=True,
    )
    return destination


def transcribe(
    source: Path,
    model_size: str = "base",
    language: str | None = None,
    device: str = "auto",
    compute_type: str = "int8",
) -> Transcript:
    """Transcribe with word timings.

    Imported lazily so the scoring and rendering paths stay usable on a machine
    with no ML stack installed.
    """
    from faster_whisper import WhisperModel

    with tempfile.TemporaryDirectory() as tmp:
        audio = extract_audio(source, Path(tmp) / "audio.wav")
        model = WhisperModel(model_size, device=device, compute_type=compute_type)
        segments, info = model.transcribe(
            str(audio),
            language=language,
            word_timestamps=True,
            vad_filter=True,
        )

        words: list[Word] = []
        for segment in segments:
            for word in segment.words or []:
                text = word.word.strip()
                if text:
                    words.append(Word(text=text, start=word.start, end=word.end))

    return Transcript(
        words=words,
        language=info.language,
        source=str(source),
        duration=probe_duration(source),
    )
