"""Builds the three homepage project cover illustrations as SVG.

These are decorative portfolio artwork, hand-authored as vectors. They contain no text,
numbers or real results; the case-study pages keep the genuine project evidence.

Run:  python3 design/covers/build_covers.py   -> writes *.svg next to this file.
Render to WebP with any browser screenshot at 1600x1000 (see design/covers/README.md).
"""

import math
import random
from pathlib import Path

W, H = 1600, 1000
OUT = Path(__file__).resolve().parent

# Shared palette — matches the site tokens (paper, ink, accent) plus two muted supports.
PAPER = "#F4EFE6"
IVORY = "#FBF8F2"
INK = "#23262D"
NAVY = "#233E8B"
NAVY_DEEP = "#1A2F6B"
SLATE = "#8C9CB0"   # blue-grey
MIST = "#DCE2E8"    # pale blue-grey disc
TEAL = "#5E8F8B"    # restrained teal


def canvas(body: str, disc_cx: float, disc_cy: float, disc_r: float) -> str:
    """Shared art direction: paper ground, fine grid, pale disc, hairline frame, corner marks, grain."""
    marks = ""
    for x, y in [(48, 48), (W - 48, 48), (48, H - 48), (W - 48, H - 48)]:
        marks += (
            f'<path d="M{x-14},{y} H{x+14} M{x},{y-14} V{y+14}" stroke="{INK}" stroke-width="1.5" opacity="0.55"/>'
        )
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="{INK}" stroke-width="1" opacity="0.045"/>
    </pattern>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.14  0 0 0 0 0.12  0 0 0 0 0.10  0 0 0 0.10 0"/>
    </filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="{INK}" flood-opacity="0.10"/>
    </filter>
  </defs>
  <rect width="{W}" height="{H}" fill="{PAPER}"/>
  <rect width="{W}" height="{H}" fill="url(#grid)"/>
  <circle cx="{disc_cx}" cy="{disc_cy}" r="{disc_r}" fill="{MIST}" opacity="0.75"/>
  {body}
  <rect x="48" y="48" width="{W-96}" height="{H-96}" fill="none" stroke="{INK}" stroke-width="1.2" opacity="0.22"/>
  {marks}
  <rect width="{W}" height="{H}" filter="url(#grain)" opacity="0.9"/>
</svg>
"""


# ───────────────────────────── PropVision ─────────────────────────────
def propvision() -> str:
    cx, cy = 930, 500
    parts = []

    # Airflow streamlines: straight far from the rotor, bowing outward around the disc.
    # The line nearest the disc deflects most; all stay inside the frame.
    lines = [(132, 24), (196, 40), (262, 60), (738, -60), (804, -40), (868, -24)]
    for i, (y, k) in enumerate(lines):
        d = (
            f"M80,{y} L380,{y} C620,{y} 690,{y - k} {cx},{y - k} "
            f"C{cx + 250},{y - k} {cx + 330},{y} {cx + 560},{y} L1520,{y}"
        )
        colour = TEAL if i in (1, 4) else SLATE
        dash = ' stroke-dasharray="2 10" stroke-linecap="round"' if i in (2, 3) else ""
        parts.append(f'<path d="{d}" fill="none" stroke="{colour}" stroke-width="2.2" opacity="0.85"{dash}/>')
        # small chevrons showing flow direction
        parts.append(
            f'<path d="M{150},{y-7} l10,7 l-10,7" fill="none" stroke="{colour}" stroke-width="2" opacity="0.8"/>'
        )

    # Disc boundary and construction geometry.
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="318" fill="{IVORY}" opacity="0.55"/>')
    parts.append(
        f'<circle cx="{cx}" cy="{cy}" r="300" fill="none" stroke="{NAVY}" stroke-width="1.6" stroke-dasharray="7 9" opacity="0.6"/>'
    )
    for r in (200, 110):
        parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{INK}" stroke-width="1" opacity="0.18"/>')
    for a in range(0, 360, 30):
        x2 = cx + 340 * math.cos(math.radians(a))
        y2 = cy + 340 * math.sin(math.radians(a))
        parts.append(f'<line x1="{cx}" y1="{cy}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{INK}" stroke-width="1" opacity="0.10"/>')

    # Three swept blades.
    blade = "M18,-26 C80,-52 180,-50 286,-16 C298,-11 298,9 286,12 C190,30 86,32 18,24 Z"
    chord = "M30,-1 C120,-4 210,-4 284,-2"
    for i, rot in enumerate((-90, 30, 150)):
        fill = NAVY if i != 1 else NAVY_DEEP
        parts.append(
            f'<g transform="translate({cx},{cy}) rotate({rot})">'
            f'<path d="{blade}" fill="{fill}"/>'
            f'<path d="{chord}" fill="none" stroke="{IVORY}" stroke-width="1.6" opacity="0.45"/>'
            "</g>"
        )
    # Chord stations along one blade: engineering ticks with node markers.
    g = [f'<g transform="translate({cx},{cy}) rotate(30)">']
    for x in (80, 140, 200, 255):
        g.append(f'<line x1="{x}" y1="-70" x2="{x}" y2="62" stroke="{INK}" stroke-width="1.2" opacity="0.55"/>')
        g.append(f'<circle cx="{x}" cy="-70" r="4" fill="{PAPER}" stroke="{INK}" stroke-width="1.4"/>')
    g.append("</g>")
    parts.append("".join(g))

    # Hub.
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="48" fill="{INK}"/>')
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="20" fill="{PAPER}"/>')
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="6" fill="{TEAL}"/>')

    # Abstract regression motif, middle left: points around a fitted line (decorative, no axes values).
    rnd = random.Random(11)
    ox, oy, pw, ph = 150, 640, 330, 250
    parts.append(f'<path d="M{ox},{oy-ph} V{oy} H{ox+pw}" fill="none" stroke="{INK}" stroke-width="1.4" opacity="0.5"/>')
    for _ in range(26):
        t = rnd.random()
        x = ox + 18 + t * (pw - 36)
        y = oy - 20 - t * (ph - 50) + rnd.gauss(0, 14)
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4.2" fill="{SLATE}" opacity="0.9"/>')
    parts.append(f'<line x1="{ox+14}" y1="{oy-18}" x2="{ox+pw-14}" y2="{oy-ph+28}" stroke="{NAVY}" stroke-width="2.4"/>')

    return canvas("\n  ".join(parts), 1010, 470, 420)


# ────────────────────────── Employee Turnover ──────────────────────────
def person(x: float, y: float, style: str) -> str:
    head = f'<circle cx="{x}" cy="{y}" r="15"'
    body = f'<path d="M{x-26},{y+52} C{x-26},{y+24} {x-14},{y+20} {x},{y+20} C{x+14},{y+20} {x+26},{y+24} {x+26},{y+52} Z"'
    if style == "solid":
        return f'{head} fill="{NAVY}"/>{body} fill="{NAVY}"/>'
    if style == "teal":
        return f'{head} fill="{TEAL}"/>{body} fill="{TEAL}"/>'
    if style == "ghost":
        return (
            f'{head} fill="none" stroke="{INK}" stroke-width="1.4" stroke-dasharray="3 4" opacity="0.55"/>'
            f'{body} fill="none" stroke="{INK}" stroke-width="1.4" stroke-dasharray="3 4" opacity="0.55"/>'
        )
    return f'{head} fill="{IVORY}" stroke="{INK}" stroke-width="1.6"/>{body} fill="{IVORY}" stroke="{INK}" stroke-width="1.6"/>'


def turnover() -> str:
    parts = []
    # Left: a quiet grid of abstract employee profiles; a few emphasised, a few fading ("departing").
    styles = {
        (0, 1): "solid", (2, 3): "solid", (4, 0): "solid",
        (1, 3): "teal", (3, 1): "teal",
        (3, 0): "ghost", (0, 3): "ghost", (4, 2): "ghost",
    }
    for row in range(4):
        for col in range(5):
            x = 160 + col * 96
            y = 250 + row * 140
            parts.append(person(x, y, styles.get((col, row), "line")))

    # Bracket linking the profiles to the data field.
    parts.append(
        f'<path d="M640,240 C700,240 700,500 760,500 C700,500 700,760 640,760" fill="none" stroke="{INK}" stroke-width="1.4" opacity="0.45"/>'
    )

    # Right: three clustered groups of points, each with a dashed boundary.
    rnd = random.Random(23)
    clusters = [
        (1000, 330, 120, 70, NAVY, -14),
        (1290, 420, 105, 80, TEAL, 18),
        (1080, 690, 140, 72, SLATE, 6),
    ]
    for cx, cy, rx, ry, colour, rot in clusters:
        parts.append(
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx+36}" ry="{ry+34}" transform="rotate({rot} {cx} {cy})" '
            f'fill="{IVORY}" fill-opacity="0.55" stroke="{INK}" stroke-width="1.3" stroke-dasharray="6 8" opacity="0.8"/>'
        )
        for _ in range(34):
            a = rnd.uniform(0, 2 * math.pi)
            r = math.sqrt(rnd.random())
            x = cx + r * rx * math.cos(a)
            y = cy + r * ry * math.sin(a)
            parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5.2" fill="{colour}" opacity="0.92"/>')
        # centroid marker
        parts.append(f'<circle cx="{cx}" cy="{cy}" r="9" fill="{PAPER}" stroke="{INK}" stroke-width="2"/>')
    # A few unclustered background points.
    for _ in range(18):
        x, y = rnd.uniform(840, 1480), rnd.uniform(180, 860)
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.2" fill="{INK}" opacity="0.18"/>')
    # Hairline axes for the data field (no ticks or values).
    parts.append(f'<path d="M840,170 V870 H1500" fill="none" stroke="{INK}" stroke-width="1.4" opacity="0.4"/>')

    return canvas("\n  ".join(parts), 1150, 500, 400)


# ───────────────────────── Marketing Campaign ─────────────────────────
def marketing() -> str:
    parts = []
    px, py, pw, ph = 250, 150, 1100, 700
    parts.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="14" fill="{IVORY}" stroke="{INK}" stroke-opacity="0.25" stroke-width="1.4" filter="url(#soft)"/>')
    # Panel header: placeholder bars instead of text.
    parts.append(f'<rect x="{px+44}" y="{py+40}" width="220" height="14" rx="7" fill="{INK}" opacity="0.8"/>')
    parts.append(f'<rect x="{px+44}" y="{py+66}" width="140" height="9" rx="4.5" fill="{INK}" opacity="0.25"/>')
    for i in range(3):
        parts.append(f'<rect x="{px+pw-44-(i+1)*62+12}" y="{py+42}" width="50" height="20" rx="10" fill="none" stroke="{INK}" stroke-opacity="0.35" stroke-width="1.2"/>')

    def tile(x, y, w, h):
        parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{PAPER}" stroke="{INK}" stroke-opacity="0.14" stroke-width="1.2"/>')
        parts.append(f'<rect x="{x+24}" y="{y+22}" width="{min(160, w*0.4)}" height="9" rx="4.5" fill="{INK}" opacity="0.35"/>')

    # Tile 1: vertical bars.
    t1 = (px + 44, py + 110, 500, 270)
    tile(*t1)
    heights = [0.92, 0.55, 0.30, 0.26, 0.20, 0.18]
    bw = 46
    base = t1[1] + t1[3] - 36
    for i, h in enumerate(heights):
        x = t1[0] + 40 + i * (bw + 26)
        hh = h * 170
        colour = NAVY if i == 0 else (TEAL if i == 1 else SLATE)
        parts.append(f'<rect x="{x}" y="{base-hh:.1f}" width="{bw}" height="{hh:.1f}" rx="4" fill="{colour}"/>')
    parts.append(f'<line x1="{t1[0]+28}" y1="{base}" x2="{t1[0]+t1[2]-28}" y2="{base}" stroke="{INK}" stroke-width="1.2" opacity="0.4"/>')

    # Tile 2: donut composition.
    t2 = (px + 572, py + 110, 484, 270)
    tile(*t2)
    dcx, dcy, r = t2[0] + 150, t2[1] + 150, 82
    circ = 2 * math.pi * r
    offset = 0.0
    for frac, colour in [(0.46, NAVY), (0.28, TEAL), (0.26, SLATE)]:
        seg = frac * circ
        parts.append(
            f'<circle cx="{dcx}" cy="{dcy}" r="{r}" fill="none" stroke="{colour}" stroke-width="30" '
            f'stroke-dasharray="{seg-6:.1f} {circ-seg+6:.1f}" stroke-dashoffset="{-offset:.1f}" transform="rotate(-90 {dcx} {dcy})"/>'
        )
        offset += seg
    for i, colour in enumerate([NAVY, TEAL, SLATE]):
        y = t2[1] + 104 + i * 40
        parts.append(f'<rect x="{t2[0]+290}" y="{y}" width="14" height="14" rx="3" fill="{colour}"/>')
        parts.append(f'<rect x="{t2[0]+316}" y="{y+3}" width="{110 - i*18}" height="8" rx="4" fill="{INK}" opacity="0.25"/>')

    # Tile 3: paired horizontal bars (campaign A vs B comparison shapes).
    t3 = (px + 44, py + 404, 640, 252)
    tile(*t3)
    for i, (a, b) in enumerate([(0.78, 0.52), (0.46, 0.64), (0.62, 0.38), (0.30, 0.44)]):
        y = t3[1] + 62 + i * 46
        parts.append(f'<rect x="{t3[0]+40}" y="{y}" width="{a*520:.1f}" height="14" rx="4" fill="{NAVY}"/>')
        parts.append(f'<rect x="{t3[0]+40}" y="{y+18}" width="{b*520:.1f}" height="10" rx="4" fill="{SLATE}" opacity="0.85"/>')

    # Tile 4: connected dots (a trend shape).
    t4 = (px + 708, py + 404, 348, 252)
    tile(*t4)
    pts = [(0, 0.35), (1, 0.48), (2, 0.42), (3, 0.64), (4, 0.58), (5, 0.78)]
    coords = [(t4[0] + 40 + i * 54, t4[1] + t4[3] - 40 - v * 150) for i, v in pts]
    parts.append(
        f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in coords)}" fill="none" stroke="{TEAL}" stroke-width="2.6"/>'
    )
    for x, y in coords:
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="6" fill="{IVORY}" stroke="{TEAL}" stroke-width="2.4"/>')

    # A layered card breaking the panel edge, for depth.
    cx0, cy0 = px + pw - 150, py + ph - 90
    parts.append(f'<rect x="{cx0}" y="{cy0}" width="260" height="150" rx="12" fill="{NAVY}" filter="url(#soft)"/>')
    for i, w in enumerate([150, 96, 120]):
        parts.append(f'<rect x="{cx0+28}" y="{cy0+34+i*30}" width="{w}" height="10" rx="5" fill="{IVORY}" opacity="{0.85 - i*0.2:.2f}"/>')

    return canvas("\n  ".join(parts), 1210, 400, 300)


if __name__ == "__main__":
    for name, fn in [
        ("propvision-cover", propvision),
        ("employee-turnover-cover", turnover),
        ("marketing-campaign-cover", marketing),
    ]:
        (OUT / f"{name}.svg").write_text(fn())
        print("wrote", name)
