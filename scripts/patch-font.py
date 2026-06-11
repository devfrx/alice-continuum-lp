# Patch Kaluar Demo and regenerate public/fonts/kaluar.woff2.
#
# The demo font ships placeholder "box" glyphs for every precomposed
# accented letter and for em/en dash and curly quotes — they render as
# tofu in display titles ("PUÒ", "METÀ", "È", "—"). The base letters and
# the grave/acute marks are real, so we rebuild what the page needs:
#
#   - À È É Ì Ò Ù (+ lowercase, + acute variants) as flat outlines of
#     base letter + mark (the lazily loaded glyf table can't take NEW
#     glyph names, so everything is decomposed into the existing slots)
#   - em/en dash by stretching the hyphen's right-side points
#   - U+2018/2019 remapped to the (real) straight quote
#
# Run:  python scripts/patch-font.py
# Requires: pip install fonttools brotli

from io import BytesIO

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

SRC = 'public/fonts/kaluar-demo.semi-bold.ttf'
OUT = 'public/fonts/kaluar.woff2'

# Everything the landing's display copy can reach (titles are
# text-transform: uppercase, but lowercase forms are patched too).
# Deliberately NOT the whole Latin-1 block: most of U+00A0-00FF maps to
# the demo font's heavy placeholder boxes we did not repair.
SUBSET_UNICODES = (
    'U+0020-007E,U+00A0,U+00B7,'
    'U+00C0-00C1,U+00C8-00C9,U+00CC-00CD,U+00D2-00D3,U+00D9-00DA,'
    'U+00E0-00E1,U+00E8-00E9,U+00EC-00ED,U+00F2-00F3,U+00F9-00FA,'
    'U+2013-2014,U+2018-2019,U+2026'
)

font = TTFont(SRC)
glyf = font['glyf']
hmtx = font['hmtx']
cmap = font.getBestCmap()
glyph_set = font.getGlyphSet()


def bounds(name: str):
    pen = BoundsPen(glyph_set)
    glyph_set[name].draw(pen)
    return pen.bounds  # (xMin, yMin, xMax, yMax)


X_HEIGHT = bounds(cmap[ord('o')])[3]    # 542
CAP_HEIGHT = bounds(cmap[ord('E')])[3]  # 711
MARK_GAP = bounds('grave')[1] - X_HEIGHT  # designed clearance above lowercase
CAP_MARK_DY = CAP_HEIGHT + MARK_GAP - bounds('grave')[1]


def contours_of(name: str) -> list:
    """A glyph's outline as a list of contours (moveTo .. closePath runs)."""
    rec = RecordingPen()
    glyph_set[name].draw(rec)
    contours, current = [], []
    for op, args in rec.value:
        current.append((op, args))
        if op in ('closePath', 'endPath'):
            contours.append(current)
            current = []
    return contours


def contour_bbox(contour: list):
    pts = [pt for _, args in contour for pt in args if isinstance(pt, tuple)]
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def replay(pen, contour: list, dx: float = 0, dy: float = 0) -> None:
    for op, args in contour:
        moved = tuple(
            (pt[0] + dx, pt[1] + dy) if isinstance(pt, tuple) else pt
            for pt in args
        )
        getattr(pen, op)(*moved)


def compose(target: str, base: str, mark: str, dy: float, drop_dot: bool = False) -> None:
    """Overwrite the placeholder `target` with base (optionally minus its
    dot, for ì/í) plus the mark centered above what remains."""
    kept = [
        c for c in contours_of(base)
        if not (drop_dot and contour_bbox(c)[1] > X_HEIGHT)
    ]
    boxes = [contour_bbox(c) for c in kept]
    left = min(b[0] for b in boxes)
    right = max(b[2] for b in boxes)
    mark_b = bounds(mark)
    dx = (left + right) / 2 - (mark_b[0] + mark_b[2]) / 2
    pen = TTGlyphPen(font.getGlyphSet())
    for c in kept:
        replay(pen, c)
    for c in contours_of(mark):
        replay(pen, c, round(dx), round(dy))
    glyf[target] = pen.glyph()
    hmtx[target] = hmtx[base]


def stretch_dash(target: str, extra: float) -> None:
    """Overwrite `target` with the hyphen, its right-side points pushed
    out by `extra` units — keeps corner geometry, unlike x-scaling."""
    hyphen = cmap[ord('-')]
    b = bounds(hyphen)
    mid_x = (b[0] + b[2]) / 2
    pen = TTGlyphPen(font.getGlyphSet())
    for contour in contours_of(hyphen):
        for op, args in contour:
            moved = tuple(
                (pt[0] + extra, pt[1])
                if isinstance(pt, tuple) and pt[0] > mid_x
                else pt
                for pt in args
            )
            getattr(pen, op)(*moved)
    glyf[target] = pen.glyph()
    adv, lsb = hmtx[hyphen]
    hmtx[target] = (int(adv + extra), lsb)


# ——— accented letters ———
UPPER = {'Agrave': ('A', 'grave'), 'Egrave': ('E', 'grave'), 'Eacute': ('E', 'acute'),
         'Igrave': ('I', 'grave'), 'Iacute': ('I', 'acute'),
         'Ograve': ('O', 'grave'), 'Oacute': ('O', 'acute'),
         'Ugrave': ('U', 'grave'), 'Uacute': ('U', 'acute'), 'Aacute': ('A', 'acute')}
LOWER = {'agrave': ('a', 'grave'), 'egrave': ('e', 'grave'), 'eacute': ('e', 'acute'),
         'ograve': ('o', 'grave'), 'oacute': ('o', 'acute'),
         'ugrave': ('u', 'grave'), 'uacute': ('u', 'acute'), 'aacute': ('a', 'acute')}
for target, (base, mark) in UPPER.items():
    compose(target, base, mark, CAP_MARK_DY)
for target, (base, mark) in LOWER.items():
    compose(target, base, mark, 0)
compose('igrave', 'i', 'grave', 0, drop_dot=True)
compose('iacute', 'i', 'acute', 0, drop_dot=True)

# ——— dashes ———
stretch_dash('emdash', 480)   # hyphen advance 520 → em ≈ 1000
stretch_dash('endash', 130)   # → en ≈ 650

# ——— curly quotes → straight quote ———
straight = cmap[ord("'")]
for table in font['cmap'].tables:
    if table.isUnicode():
        for cp in (0x2018, 0x2019):
            table.cmap[cp] = straight

# ——— subset to woff2 ———
options = Options(flavor='woff2', hinting=False, desubroutinize=False)
options.layout_features = ['*']
subsetter = Subsetter(options=options)
subsetter.populate(unicodes=[
    cp
    for chunk in SUBSET_UNICODES.split(',')
    for lo, _, hi in [chunk.replace('U+', '').partition('-')]
    for cp in range(int(lo, 16), int(hi or lo, 16) + 1)
])
subsetter.subset(font)

buf = BytesIO()
font.save(buf)
data = buf.getvalue()
with open(OUT, 'wb') as fh:
    fh.write(data)
print(f'wrote {OUT}: {len(data) / 1024:.1f} KB')
