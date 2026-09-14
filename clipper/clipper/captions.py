"""Word-level karaoke captions as ASS subtitles.

Burned-in captions with the spoken word highlighted are the single cheapest
retention win on short-form: most viewing is sound-off, and the moving
highlight gives the eye something to track.
"""

from __future__ import annotations

from .model import ClipSpec, Word


def _timestamp(seconds: float) -> str:
    seconds = max(0.0, seconds)
    hours, remainder = divmod(seconds, 3600)
    minutes, secs = divmod(remainder, 60)
    return f"{int(hours)}:{int(minutes):02d}:{secs:05.2f}"


def _escape(text: str) -> str:
    return text.replace("{", "(").replace("}", ")").replace("\n", " ")


def _header(spec: ClipSpec) -> str:
    # Outline is heavy on purpose — captions must survive a bright background.
    return f"""[Script Info]
ScriptType: v4.00+
PlayResX: {spec.target_width}
PlayResY: {spec.target_height}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Pop,{spec.font},{spec.font_size},{spec.base_colour},&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,7,3,2,80,80,{int(spec.target_height * 0.22)},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def build_ass(words: list[Word], clip_start: float, spec: ClipSpec) -> str:
    """Render `words` as an ASS file, timed relative to `clip_start`.

    Words are grouped into short lines; each line is emitted once per word so
    the active word can be recoloured while its neighbours stay visible.
    """
    lines = [_header(spec)]
    group_size = max(1, spec.words_per_caption)

    for offset in range(0, len(words), group_size):
        group = words[offset:offset + group_size]
        if not group:
            continue
        for index, active in enumerate(group):
            start = active.start - clip_start
            # Hold the last word of a group until the next group begins.
            if index + 1 < len(group):
                end = group[index + 1].start - clip_start
            else:
                end = active.end - clip_start
            if end <= start:
                end = start + 0.12

            rendered = []
            for position, word in enumerate(group):
                colour = spec.highlight_colour if position == index else spec.base_colour
                rendered.append(rf"{{\c{colour}}}{_escape(word.text)}")
            text = " ".join(rendered)

            lines.append(
                f"Dialogue: 0,{_timestamp(start)},{_timestamp(end)},Pop,,0,0,0,,{text}"
            )

    return "\n".join(lines) + "\n"
