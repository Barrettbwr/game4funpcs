"""Command line interface."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict
from pathlib import Path

from . import candidates as candidates_mod
from .model import ClipSpec, Transcript, Weights


def _slug(text: str, limit: int = 48) -> str:
    words = re.findall(r"[A-Za-z0-9]+", text.lower())
    slug = "-".join(words)[:limit].strip("-")
    return slug or "clip"


def _load_spec(args: argparse.Namespace) -> ClipSpec:
    return ClipSpec(
        reframe=args.reframe,
        captions=not args.no_captions,
        words_per_caption=args.words_per_caption,
        font_size=args.font_size,
    )


def _rank(transcript: Transcript, args: argparse.Namespace):
    weights = Weights.load(Path(args.weights) if args.weights else None)
    scored = candidates_mod.generate(
        transcript,
        weights,
        min_duration=args.min_duration,
        max_duration=args.max_duration,
        target_duration=args.target_duration,
    )
    return candidates_mod.select(scored, limit=args.limit, max_overlap=args.max_overlap)


def _print_table(chosen) -> None:
    if not chosen:
        print("No candidates matched. Try widening --min-duration/--max-duration.")
        return
    print(f"\n{'#':>2}  {'score':>5}  {'start':>8}  {'dur':>5}  preview")
    print("-" * 78)
    for i, c in enumerate(chosen, 1):
        preview = " ".join(c.text.split()[:9])
        mins, secs = divmod(int(c.start), 60)
        print(f"{i:>2}  {c.score:>5.3f}  {mins:>4}:{secs:02d}  {c.duration:>4.1f}s  {preview}…")
        print(f"{'':>2}  {'':>5}  {'':>8}  {'':>5}  ↳ {c.reason()}")


# --- commands ---------------------------------------------------------------

def cmd_transcribe(args: argparse.Namespace) -> int:
    from .transcribe import transcribe

    source = Path(args.source)
    print(f"Transcribing {source.name} with whisper '{args.model}'…", file=sys.stderr)
    transcript = transcribe(source, model_size=args.model, language=args.language)
    destination = Path(args.output)
    transcript.to_json(destination)
    print(f"{len(transcript.words)} words → {destination}", file=sys.stderr)
    return 0


def cmd_rank(args: argparse.Namespace) -> int:
    transcript = Transcript.from_json(Path(args.transcript))
    chosen = _rank(transcript, args)
    if args.json:
        print(json.dumps([asdict(c) for c in chosen], indent=2))
    else:
        _print_table(chosen)
    return 0


def cmd_cut(args: argparse.Namespace) -> int:
    from .render import render_clip, render_cover

    source = Path(args.source)
    transcript = Transcript.from_json(Path(args.transcript))
    chosen = _rank(transcript, args)
    spec = _load_spec(args)
    outdir = Path(args.output)
    outdir.mkdir(parents=True, exist_ok=True)

    manifest = []
    for i, candidate in enumerate(chosen, 1):
        name = f"{i:02d}-{_slug(candidate.text)}"
        clip_path = outdir / f"{name}.mp4"
        print(f"[{i}/{len(chosen)}] {clip_path.name} "
              f"({candidate.duration:.1f}s, score {candidate.score:.3f})", file=sys.stderr)
        render_clip(source, candidate, transcript, clip_path, spec)
        entry = {
            "file": clip_path.name,
            "start": round(candidate.start, 3),
            "end": round(candidate.end, 3),
            "duration": round(candidate.duration, 3),
            "score": round(candidate.score, 4),
            "signals": {k: round(v, 4) for k, v in candidate.signals.items()},
            "text": candidate.text,
        }
        if args.covers:
            cover = outdir / f"{name}.jpg"
            render_cover(source, candidate, cover, spec)
            entry["cover"] = cover.name
        manifest.append(entry)

    manifest_path = outdir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2))
    print(f"\n{len(manifest)} clips → {outdir}/  (manifest.json)", file=sys.stderr)
    return 0


def cmd_run(args: argparse.Namespace) -> int:
    from .transcribe import transcribe

    source = Path(args.source)
    outdir = Path(args.output)
    outdir.mkdir(parents=True, exist_ok=True)

    transcript_path = outdir / "transcript.json"
    if transcript_path.exists() and not args.retranscribe:
        print(f"Reusing {transcript_path}", file=sys.stderr)
        transcript = Transcript.from_json(transcript_path)
    else:
        print(f"Transcribing {source.name} with whisper '{args.model}'…", file=sys.stderr)
        transcript = transcribe(source, model_size=args.model, language=args.language)
        transcript.to_json(transcript_path)

    args.transcript = str(transcript_path)
    return cmd_cut(args)


# --- argument wiring --------------------------------------------------------

def _add_ranking_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--limit", type=int, default=10, help="max clips (default 10)")
    parser.add_argument("--min-duration", type=float, default=18.0)
    parser.add_argument("--max-duration", type=float, default=60.0)
    parser.add_argument("--target-duration", type=float, default=34.0)
    parser.add_argument("--max-overlap", type=float, default=0.25,
                        help="drop a clip overlapping a better one by more than this")
    parser.add_argument("--weights", help="JSON file of per-signal weights")


def _add_render_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--reframe", choices=["blur", "crop"], default="blur")
    parser.add_argument("--no-captions", action="store_true")
    parser.add_argument("--words-per-caption", type=int, default=3)
    parser.add_argument("--font-size", type=int, default=92)
    parser.add_argument("--covers", action="store_true", help="also write a cover frame")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="clipper",
        description="Find and cut short-form clips from long-form video.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    p = subparsers.add_parser("transcribe", help="video → transcript.json")
    p.add_argument("source")
    p.add_argument("-o", "--output", default="transcript.json")
    p.add_argument("--model", default="base", help="whisper size (tiny/base/small/medium/large-v3)")
    p.add_argument("--language", default=None)
    p.set_defaults(func=cmd_transcribe)

    p = subparsers.add_parser("rank", help="transcript.json → ranked candidates")
    p.add_argument("transcript")
    p.add_argument("--json", action="store_true")
    _add_ranking_args(p)
    p.set_defaults(func=cmd_rank)

    p = subparsers.add_parser("cut", help="render clips from an existing transcript")
    p.add_argument("source")
    p.add_argument("-t", "--transcript", required=True)
    p.add_argument("-o", "--output", default="clips")
    _add_ranking_args(p)
    _add_render_args(p)
    p.set_defaults(func=cmd_cut)

    p = subparsers.add_parser("run", help="transcribe, rank and cut in one pass")
    p.add_argument("source")
    p.add_argument("-o", "--output", default="clips")
    p.add_argument("--model", default="base")
    p.add_argument("--language", default=None)
    p.add_argument("--retranscribe", action="store_true")
    _add_ranking_args(p)
    _add_render_args(p)
    p.set_defaults(func=cmd_run)

    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
