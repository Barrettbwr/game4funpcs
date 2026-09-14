"""ffmpeg rendering: cut, reframe to vertical, burn captions, normalise audio."""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from .captions import build_ass
from .model import Candidate, ClipSpec, Transcript


def _video_chain(spec: ClipSpec, burn_captions: bool) -> str:
    """Build the filter graph that turns a landscape frame into a 9:16 one."""
    w, h = spec.target_width, spec.target_height

    if spec.reframe == "crop":
        # Fills the frame; loses the sides. Fine for centred talking heads.
        chain = (
            f"[0:v]scale={w}:{h}:force_original_aspect_ratio=increase,"
            f"crop={w}:{h},setsar=1[v]"
        )
    else:
        # Blurred pillarbox: whole frame stays visible over a blurred fill.
        chain = (
            f"[0:v]split=2[bg][fg];"
            f"[bg]scale={w}:{h}:force_original_aspect_ratio=increase,"
            f"crop={w}:{h},gblur=sigma=30[bgb];"
            f"[fg]scale={w}:{h}:force_original_aspect_ratio=decrease[fgs];"
            f"[bgb][fgs]overlay=(W-w)/2:(H-h)/2,setsar=1[v]"
        )

    if burn_captions:
        # Referenced by bare filename; ffmpeg runs with cwd set to its directory
        # so the filter graph never has to escape a path.
        chain += ";[v]subtitles=captions.ass[v]"

    return chain


def render_clip(
    source: Path,
    candidate: Candidate,
    transcript: Transcript,
    destination: Path,
    spec: ClipSpec | None = None,
) -> Path:
    """Render one candidate to `destination`."""
    spec = spec or ClipSpec()
    destination.parent.mkdir(parents=True, exist_ok=True)

    words = transcript.words_between(candidate.start, candidate.end)
    burn = spec.captions and bool(words)

    with tempfile.TemporaryDirectory() as tmp:
        workdir = Path(tmp)
        if burn:
            (workdir / "captions.ass").write_text(
                build_ass(words, candidate.start, spec), encoding="utf-8"
            )

        command = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-ss", f"{candidate.start:.3f}",
            "-i", str(source.resolve()),
            "-t", f"{candidate.duration:.3f}",
            "-filter_complex", _video_chain(spec, burn),
            "-map", "[v]",
            "-map", "0:a?",
            "-af", f"loudnorm=I={spec.loudness_lufs}:TP=-1.5:LRA=11",
            "-c:v", "libx264", "-preset", "medium", "-crf", "20",
            "-pix_fmt", "yuv420p", "-r", "30",
            "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
            "-movflags", "+faststart",
            str(destination.resolve()),
        ]
        subprocess.run(command, check=True, cwd=workdir)

    return destination


def render_cover(source: Path, candidate: Candidate, destination: Path,
                 spec: ClipSpec | None = None, offset: float = 0.4) -> Path:
    """Grab a cover frame from just after the clip starts."""
    spec = spec or ClipSpec()
    destination.parent.mkdir(parents=True, exist_ok=True)
    chain = _video_chain(spec, burn_captions=False)
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error",
         "-ss", f"{candidate.start + offset:.3f}", "-i", str(source.resolve()),
         "-filter_complex", chain, "-map", "[v]",
         "-frames:v", "1", str(destination.resolve())],
        check=True,
    )
    return destination
