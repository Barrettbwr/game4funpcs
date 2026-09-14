"""Audio extraction and word-level transcription.

Transcription is the slowest stage by a wide margin, and the one that benefits
most from a GPU. On CUDA it runs in float16, which makes the `large-v3` model
practical — worth taking, because better word timings mean tighter clip
boundaries and captions that stay in sync.
"""

from __future__ import annotations

import functools
import json
import platform
import subprocess
import tempfile
from pathlib import Path

from .model import Transcript, Word


@functools.lru_cache(maxsize=1)
def cuda_devices() -> int:
    """Number of CUDA devices CTranslate2 can actually see (0 if none)."""
    try:
        import ctranslate2

        return ctranslate2.get_cuda_device_count()
    except Exception:
        return 0


def is_apple_silicon() -> bool:
    return platform.system() == "Darwin" and platform.machine() == "arm64"


def device_note(device: str) -> str:
    """A one-line caveat for the chosen device, or empty.

    Worth surfacing because the Apple Silicon case is genuinely surprising: the
    machine has a capable GPU and this still runs on the CPU cores, because
    CTranslate2 has no Metal backend. int8 on ARM is respectable, but it is not
    the GPU, and a user staring at a hot MacBook deserves to know why.
    """
    if device == "cpu" and is_apple_silicon():
        return ("note: CTranslate2 has no Metal backend, so this runs on CPU cores, "
                "not the M-series GPU. For GPU transcription on this machine use "
                "mlx-whisper or whisper.cpp.")
    return ""


def pick_device(preference: str = "auto") -> tuple[str, str]:
    """Resolve a device preference to a (device, compute_type) pair.

    int8 on CPU and float16 on CUDA are the sane defaults: int8 is what makes
    CPU transcription bearable at all, float16 is what makes the large models
    fast enough to be the obvious choice on a GPU.
    """
    if preference == "cpu":
        return "cpu", "int8"
    if preference == "cuda":
        if cuda_devices() == 0:
            raise RuntimeError(
                "CUDA was requested but CTranslate2 sees no CUDA device. "
                "Check the NVIDIA driver and CUDA runtime, or pass --device cpu."
            )
        return "cuda", "float16"
    if preference == "auto":
        return ("cuda", "float16") if cuda_devices() else ("cpu", "int8")
    raise ValueError(f"unknown device preference: {preference!r}")


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
) -> Transcript:
    """Transcribe with word timings.

    Imported lazily so the scoring and rendering paths stay usable on a machine
    with no ML stack installed.
    """
    from faster_whisper import WhisperModel

    resolved_device, compute_type = pick_device(device)

    with tempfile.TemporaryDirectory() as tmp:
        audio = extract_audio(source, Path(tmp) / "audio.wav")
        model = WhisperModel(
            model_size, device=resolved_device, compute_type=compute_type
        )
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
