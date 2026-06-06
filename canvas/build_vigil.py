#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
V I G I L  —  A Cartography of Stolen Hours
A meticulously crafted single-page artwork expressing the visual philosophy of
restrained, nocturnal labor. Inspired by 18th-century observatory charts,
contemplative monastic ledgers, and the dignified vigil of those who keep watch.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os, random

# ============== CANVAS SETUP ==============
FONT_DIR = "/Users/koizumishota0323/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/42120eff-7952-43e3-92d4-0d2106b62171/90b018ac-be64-483d-9254-381d4d6b6a58/skills/canvas-design/canvas-fonts"
OUT = "/Users/koizumishota0323/bar-exchange/canvas/VIGIL — I.png"

W, H = 2400, 3200   # 4:5.33 portrait, generous gallery size

# Palette — restrained, documentary, aged paper
PAPER   = (241, 237, 221)        # warm cream
PAPER_2 = (235, 230, 212)        # slightly darker for texture
INK     = (26, 24, 20)           # deep brown-black
INK_S   = (66, 58, 44)           # sepia ink
INK_F   = (130, 118, 96)         # faded ink
AMBER   = (184, 156, 104)        # aged gold accent
DAWN    = (79, 92, 110)          # pre-dawn blue
SHADOW  = (200, 192, 170)        # subtle paper shadow

# ============== HELPERS ==============
def fp(name): return os.path.join(FONT_DIR, name)
def font(name, size): return ImageFont.truetype(fp(name), size)

# Pre-load fonts
F_ITAL  = lambda s: font("Italiana-Regular.ttf", s)
F_GLOOCK= lambda s: font("Gloock-Regular.ttf", s)
F_SERIF = lambda s: font("IBMPlexSerif-Regular.ttf", s)
F_SERIFI= lambda s: font("IBMPlexSerif-Italic.ttf", s)
F_SERIFB= lambda s: font("IBMPlexSerif-Bold.ttf", s)
F_MONO  = lambda s: font("DMMono-Regular.ttf", s)
F_PMONO = lambda s: font("IBMPlexMono-Regular.ttf", s)
F_PMONOB= lambda s: font("IBMPlexMono-Bold.ttf", s)
F_CRIM  = lambda s: font("CrimsonPro-Regular.ttf", s)
F_CRIMI = lambda s: font("CrimsonPro-Italic.ttf", s)
F_INSTR = lambda s: font("InstrumentSerif-Regular.ttf", s)
F_INSTRI= lambda s: font("InstrumentSerif-Italic.ttf", s)

def center_text(draw, xy, text, font, fill):
    """Draw text centered at xy."""
    bbox = draw.textbbox((0,0), text, font=font)
    w, h = bbox[2]-bbox[0], bbox[3]-bbox[1]
    draw.text((xy[0]-w/2-bbox[0], xy[1]-h/2-bbox[1]), text, font=font, fill=fill)

def right_text(draw, xy, text, font, fill):
    bbox = draw.textbbox((0,0), text, font=font)
    w = bbox[2]-bbox[0]
    draw.text((xy[0]-w-bbox[0], xy[1]-bbox[1]), text, font=font, fill=fill)

# ============== BUILD CANVAS ==============
img = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(img, "RGBA")

# ------- PAPER TEXTURE: subtle grain via tiny dots -------
random.seed(7)
for _ in range(38000):
    x = random.randint(0, W-1); y = random.randint(0, H-1)
    a = random.randint(8, 24)
    c = (210 + random.randint(-15, 15), 200 + random.randint(-15, 15), 180 + random.randint(-15, 15), a)
    d.point((x, y), fill=c)

# Subtle paper darkening at edges (vignette mimic via blocks)
for i in range(120):
    a = int(8 * (1 - i/120))
    d.rectangle([i, i, W-i, H-i], outline=(180,170,150,a))

# ============== MARGIN GRID (SOFT) ==============
M = 240  # margin

# Top frame line
d.line([M, M, W-M, M], fill=INK_F + (90,), width=2)
# Bottom frame line
d.line([M, H-M, W-M, H-M], fill=INK_F + (90,), width=2)

# ============== TOP MARGINALIA ==============
# Top-left: catalog mark
d.text((M, M-90), "R A K U R A K U", font=F_PMONO(26), fill=INK_S)
d.text((M, M-58), "vigil  ·  cartographia horarum nocturnarum", font=F_INSTRI(28), fill=INK_F)
# Top-right: catalog number
right_text(d, (W-M, M-90), "MMXXVI · N° III", font=F_PMONO(26), fill=INK_S)
right_text(d, (W-M, M-58), "plate 01 of 01", font=F_INSTRI(28), fill=INK_F)

# ============== CENTRAL MERIDIAN — a single faint vertical axis ==============
# Classical engraving technique: a thin line that visually anchors the entire composition
CX_AXIS = W // 2
d.line([CX_AXIS, M + 50, CX_AXIS, H - M - 50], fill=INK_F + (60,), width=1)

# ============== SECTION I — THE WITNESS (CIRCLE) ==============
CX, CY = W // 2, M + 720
R = 380

# Outer ring (thin, deliberate)
d.ellipse([CX-R, CY-R, CX+R, CY+R], outline=INK, width=3)

# Inner ring (softer, slightly larger gap for breathing)
d.ellipse([CX-R+56, CY-R+56, CX+R-56, CY+R-56], outline=INK_F + (180,), width=1)

# Cardinal & sub-cardinal tick marks (sundial / observatory feel)
for i in range(48):
    ang = math.radians(i * 360/48 - 90)
    if i % 12 == 0:    # Major (4 cardinal)
        inner, outer, weight, color = R - 28, R - 4, 4, INK
    elif i % 4 == 0:   # Mid
        inner, outer, weight, color = R - 18, R - 4, 2, INK
    else:              # Minor
        inner, outer, weight, color = R - 10, R - 4, 1, INK_S
    x1 = CX + math.cos(ang) * inner
    y1 = CY + math.sin(ang) * inner
    x2 = CX + math.cos(ang) * outer
    y2 = CY + math.sin(ang) * outer
    d.line([x1, y1, x2, y2], fill=color, width=weight)

# Hour numerals inside the dial (Roman, tasteful)
hours = {0: "XII", 12: "III", 24: "VI", 36: "IX"}
for pos, txt in hours.items():
    ang = math.radians(pos * 360/48 - 90)
    rr = R - 76
    x = CX + math.cos(ang) * rr
    y = CY + math.sin(ang) * rr
    center_text(d, (x, y), txt, F_INSTR(38), INK)

# Cross-hairs of the witness (vertical + horizontal, very thin) — only inside inner ring
inner_r = R - 56
d.line([CX, CY-inner_r+4, CX, CY+inner_r-4], fill=INK_F + (90,), width=1)
d.line([CX-inner_r+4, CY, CX+inner_r-4, CY], fill=INK_F + (90,), width=1)

# Central character — the kanji 「間」 ("ma" - interval, space between)
try:
    F_KANJI = ImageFont.truetype("/System/Library/Fonts/ヒラギノ明朝 ProN.ttc", 240)
except OSError:
    try:
        F_KANJI = ImageFont.truetype("/System/Library/Fonts/Hiragino Sans GB.ttc", 240)
    except OSError:
        F_KANJI = F_INSTR(240)
center_text(d, (CX, CY-12), "間", F_KANJI, INK)

# Tiny inscription below the kanji — closer for tighter composition
center_text(d, (CX, CY+160), "—  t h e   i n t e r v a l  —", F_CRIMI(30), INK_S)

# The Watching Star — at the very top of the dial, with a refined halo
star_x, star_y = CX, CY - R - 22
# Halo: faint radial rings
for halo_r, halo_a in [(28, 30), (20, 55), (14, 95)]:
    d.ellipse([star_x-halo_r, star_y-halo_r, star_x+halo_r, star_y+halo_r],
              outline=AMBER + (halo_a,), width=1)
# The star itself — solid amber
d.ellipse([star_x-8, star_y-8, star_x+8, star_y+8], fill=AMBER)
# Tiny inscribed label for the star (whisper text)
center_text(d, (star_x, star_y - 56), "lvmen", F_CRIMI(20), INK_F)

# ============== SECTION II — TALLY OF HOURS ==============
# A column of tally marks, grouped in fives, representing hours of vigil.
# Centered horizontally for stronger composition with the dial above.
TY = CY + R + 240
TALLY_TOTAL = 36   # 36 hours of vigil = 3 nights × 12 hours
GROUP = 5
TALLY_SPACING = 110
TALLY_STROKE_W = 18
n_groups = (TALLY_TOTAL + GROUP - 1) // GROUP
total_width = (n_groups - 1) * TALLY_SPACING + 4 * (TALLY_STROKE_W - 2)
TX = (W - total_width) // 2

# Caption above — centered
center_text(d, (CX, TY-44), "H O R Æ  C V S T O D I T Æ", F_PMONOB(22), INK_S)
center_text(d, (CX, TY-12), "thirty-six hours kept  ·  grouped by five", F_CRIMI(26), INK_F)

# Draw tally marks
for n in range(TALLY_TOTAL):
    g = n // GROUP
    in_g = n % GROUP
    base_x = TX + g * TALLY_SPACING
    base_y = TY + 30
    if in_g < 4:
        x = base_x + in_g * TALLY_STROKE_W
        d.line([x, base_y, x, base_y + 70], fill=INK, width=5)
    else:
        # diagonal slash through previous 4 — confident, hand-drawn quality
        x1 = base_x - 10
        y1 = base_y + 78
        x2 = base_x + 3*TALLY_STROKE_W + 10
        y2 = base_y - 8
        d.line([x1, y1, x2, y2], fill=INK, width=5)

# ============== SECTION III — LATIN GESTURE ==============
# A single declarative phrase, the only "loud" text on the page
PHRASE_Y = TY + 268
# Pre-draw faint ornamental flourishes (asterisms) flanking the title
d.text((CX - 360, PHRASE_Y - 8), "✦", font=F_INSTR(28), fill=INK_S)
d.text((CX + 340, PHRASE_Y - 8), "✦", font=F_INSTR(28), fill=INK_S)
# The title — bold inscription
center_text(d, (CX, PHRASE_Y), "VIGILES  NOCTIS", F_GLOOCK(118), INK)
# Subtitle below — italic serif
center_text(d, (CX, PHRASE_Y + 92), "those who keep watch when the world sleeps", F_CRIMI(38), INK_S)

# Thin horizontal separator with center mark
sep_y = PHRASE_Y + 168
d.line([CX-200, sep_y, CX-12, sep_y], fill=INK, width=2)
d.line([CX+12, sep_y, CX+200, sep_y], fill=INK, width=2)
# Center diamond — meticulous detail
diamond_pts = [(CX, sep_y-6), (CX+6, sep_y), (CX, sep_y+6), (CX-6, sep_y)]
d.polygon(diamond_pts, fill=INK)

# ============== SECTION IV — COORDINATES / FOOTER ==============
# A coordinate (Tokyo, Minato-ku) — referencing the vigil's location
COORD_Y = sep_y + 90
center_text(d, (CX, COORD_Y), "35°39′29″N    139°44′28″E", F_MONO(32), INK_S)
center_text(d, (CX, COORD_Y + 44), "P O R T   W A R D   ·   T O K Y O   ·   H O R A   X X I I I – I I I",
            F_PMONO(20), INK_F)

# ============== RIGHT MARGIN ORDINALS ==============
# Tiny ordinal markers like a star chart's right ascension column
ORD_X = W - M + 60
ord_top = M + 100
ord_bot = H - M - 100
ord_count = 25
for i in range(ord_count):
    y = ord_top + i * (ord_bot - ord_top) / (ord_count - 1)
    is_major = (i % 5 == 0)
    tick_len = 22 if is_major else 10
    weight = 2 if is_major else 1
    d.line([ORD_X, y, ORD_X + tick_len, y], fill=INK_F if not is_major else INK_S, width=weight)
    if is_major:
        right_text(d, (ORD_X - 8, y - 14), f"{(i+1)*4:02d}", F_MONO(22), INK_S)

# Continuous thin vertical line down the right side
d.line([ORD_X, ord_top, ORD_X, ord_bot], fill=INK_F + (180,), width=1)

# ============== LEFT MARGIN ORDINALS ==============
# Symmetric on the left — but with a different scale (declination)
ORD_X_L = M - 60
for i in range(ord_count):
    y = ord_top + i * (ord_bot - ord_top) / (ord_count - 1)
    is_major = (i % 5 == 0)
    tick_len = 22 if is_major else 10
    weight = 2 if is_major else 1
    d.line([ORD_X_L - tick_len, y, ORD_X_L, y], fill=INK_F if not is_major else INK_S, width=weight)
    if is_major:
        d.text((ORD_X_L + 12, y - 14), f"{i*2:02d}°", font=F_MONO(22), fill=INK_S)

d.line([ORD_X_L, ord_top, ORD_X_L, ord_bot], fill=INK_F + (180,), width=1)

# ============== BOTTOM FOOTER ==============
# Three lines of carefully spaced footer information
foot_y = H - M + 60
d.text((M, foot_y), "OBSERVATA  ·  IN  NOCTE  ·  SOLITARIA", font=F_PMONO(22), fill=INK_S)
right_text(d, (W-M, foot_y), "EX  LIBRO  RAKURAKU  ·  PLATE  III", font=F_PMONO(22), fill=INK_S)

d.text((M, foot_y + 36), "—  composed by hand, after the hours were counted  —", font=F_CRIMI(28), fill=INK_F)
right_text(d, (W-M, foot_y + 36), "ARS  HORARUM", font=F_INSTRI(30), fill=INK_F)

# ============== FINAL VERY SUBTLE INK BLEED EFFECT ==============
# Apply a very slight gaussian blur to mimic ink-paper interaction
img = img.filter(ImageFilter.GaussianBlur(radius=0.4))

# ============== SAVE ==============
os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT, "PNG", optimize=True)
print(f"Saved: {OUT}")
print(f"Size: {os.path.getsize(OUT)/1024:.1f} KB")
