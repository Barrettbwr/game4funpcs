# clipper

Finds and cuts short-form clips from long-form video. Transcribe → score every
candidate window → render the best ones vertical with burned captions.

The point of it is the **scorer**: given an hour of footage it tells you which
90 seconds are worth posting, and why. That's where the manual hours go.

## Install

Needs `ffmpeg` (with `libass`) on PATH and Python 3.11+.

```sh
pip install -e .
```

## Use

```sh
# everything in one pass
clipper run talk.mp4 -o clips --limit 10

# or step by step, so you only pay for transcription once
clipper transcribe talk.mp4 -o transcript.json --model base
clipper rank transcript.json --limit 10
clipper cut talk.mp4 -t transcript.json -o clips --covers
```

`rank` is cheap and prints its reasoning — use it to tune before spending time
rendering:

```
 #  score     start    dur  preview
------------------------------------------------------------------------------
 1  0.779     0:45  27.8s  Here's the mistake that killed my first three accounts.…
                            ↳ hook 1.00, standalone 1.00, length_fit 0.99
 2  0.726     1:28  15.2s  Stop editing your clips for other editors. Nobody watching…
                            ↳ hook 1.00, standalone 1.00, quotable 0.85
```

Each run writes `manifest.json` with every clip's timing, score, per-signal
breakdown and transcript text — join it to your posting analytics later to find
which signals actually predict performance for your niche.

## The scoring model

Eight signals, each normalised to 0..1, combined as a weighted mean. All of them
are readable in `clipper/score.py` — no black box, so you can tell why a clip
ranked where it did.

| Signal | What it rewards |
| --- | --- |
| `hook` | The first ~22 words. Contrarian framing, a promise, a question opener, an imperative, a concrete number. Only the opening counts — a great line buried 40 words in doesn't hook anyone. |
| `standalone` | Makes sense without the surrounding hour. Penalises mid-thought openers ("And so…") and unresolved back-references ("as I said earlier"). |
| `payoff` | Resolves in the final third rather than trailing off. |
| `quotable` | Tight declarative sentences (6–14 words), high content-word ratio, low filler. |
| `pace` | 2.2–3.4 words/sec, penalised for dead air over 0.8s. |
| `emotion` | Intensity lexicon, laughter, emphasis. |
| `coherence` | Content-word overlap between halves — stays on one topic without just repeating itself. |
| `length_fit` | Gaussian around `--target-duration`. |

### Tuning per niche

Different niches reward different things. Finance explainers live on `hook` and
`standalone`; comedy lives on `emotion` and `pace`. Put overrides in a JSON file
rather than editing source:

```json
{ "hook": 3.2, "emotion": 0.4, "standalone": 2.5 }
```

```sh
clipper rank transcript.json --weights finance.json
```

Unknown keys are rejected loudly rather than silently ignored.

## Rendering

- **Reframe** — `--reframe blur` (default) keeps the whole 16:9 frame over a
  blurred fill; `--reframe crop` centre-crops to fill, which suits a centred
  talking head and loses the sides.
- **Captions** — word-level karaoke, the spoken word highlighted. Burned in via
  ASS with a heavy outline so they survive a bright background. Sound-off
  viewing is the default, and the moving highlight gives the eye something to
  track. `--words-per-caption` (default 3), `--font-size`, or `--no-captions`.
- **Audio** — `loudnorm` to −14 LUFS, the streaming-platform target, so clips
  from different sources don't jump in volume.
- **Output** — 1080×1920, H.264 yuv420p, 30fps, faststart, AAC 48kHz.

`--covers` also writes a cover frame per clip.

## Why candidates don't overlap

`select()` does greedy non-maximum suppression: best clip first, then drop
anything overlapping an already-chosen clip by more than `--max-overlap`
(default 0.25). Without it you get ten near-identical cuts of the single best
moment.

## Tests

```sh
python -m unittest discover -s tests -v
```

35 tests. The render tests generate a real source with ffmpeg and assert the
output is genuinely 1080×1920; they skip automatically if ffmpeg is absent.

## Layout

| Path | Responsibility |
| --- | --- |
| `clipper/model.py` | `Word`, `Transcript`, `Candidate`, `Weights`, `ClipSpec` |
| `clipper/transcribe.py` | Audio extraction + faster-whisper with word timings |
| `clipper/candidates.py` | Sentence bounds, window generation, overlap suppression |
| `clipper/score.py` | The eight signals |
| `clipper/captions.py` | Word-level ASS karaoke |
| `clipper/render.py` | ffmpeg: cut, reframe, burn, normalise |
| `clipper/cli.py` | `transcribe` / `rank` / `cut` / `run` |

## Notes

Whisper is imported lazily, so `rank` and `cut` work on a machine with no ML
stack as long as you already have a transcript. Model sizes: `base` is a good
default; `small` is noticeably better on accented or noisy audio; `large-v3`
if word timings need to be tight.
