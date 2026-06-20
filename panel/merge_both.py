#!/usr/bin/env python3
"""
Merge the two routed slimsplaydy halves into one combined board, slimsplaydy_both.kicad_pcb,
and drop in KiKit tab annotations so the panelizer puts mouse-bite tabs exactly where we want
them (off the battery slots, flanking the MCU slots, NONE between the halves).

Why a script (not KiCad File>Append Board): the per-half boards share reference designators
(S1-S17, CONN1, PWR1, RST1, MCU1, MAG1, MH1-15). KiKit's appendBoard renames on the way in:
right-half refs get a "_2" suffix, nets get L_/R_ prefixes, so the halves stay electrically
distinct in the fab-only combined file. This replaces the hand-merged slimsplaydy_both* files.
Don't hand-edit the output - fix the per-half board (or the lists below) and re-run.

Run on YOUR machine (needs KiCad's pcbnew + KiKit):
    python panel/merge_both.py
Then panelize the result (see panel/README.md). The preset uses tabs.type = "annotation",
so it reads the kikit:Tab footprints this script places.

NOTE: appendBoard's signature is the part most likely to vary by KiKit version. If it errors,
that's the line to check first.
"""
import os
import pcbnew
from pcbnew import VECTOR2I, FromMM, EDA_ANGLE, DEGREES_T
from kikit.panelize import Panel, Origin

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                       # slimsplaydy/
LEFT  = os.path.join(ROOT, "slimsplaydy_left.kicad_pcb")
RIGHT = os.path.join(ROOT, "slimsplaydy_right.kicad_pcb")
OUT   = os.path.join(ROOT, "slimsplaydy_both.kicad_pcb")

# ---------------------------------------------------------------------------------------------
# Nest: STACKED VERTICALLY, center-anchored, NO rotation. The mirror halves have a convex peak on
# the top edge and a concave battery-slot notch on the bottom, so PITCH < board height tucks the
# lower half's top peak into the upper half's battery slot, shrinking the panel.
#
# *** KEEP THE HALVES MILLABLE-APART ***  The router (JLC) is 2 x post.millradius = 2 x 1 mm = 2 mm
# wide. It must be able to sweep the ENTIRE channel between the halves; if a stretch of channel is
# narrower than the bit (or a tight concave pocket the round bit can't enter), JLC leaves the halves
# bridged there with a one-sided cut. Measured (arcs included):
#   PITCH 82 / XOFF -17  -> gap >= 3.69 mm everywhere, 4.96 mm in the right-hand lobe region. Good.
# Moving XOFF more negative slides the lower half left: it OPENS the right channel but PINCHES the
# left (XOFF -15 left the right lobe at ~3.1 mm, which milled as a bridge). PITCH 82 keeps the left
# comfortable while -17 opens the right. Don't drop the global gap below ~3 mm without also lowering
# post.millradius (e.g. 0.5 mm -> 1 mm bit), and narrow routing can cost more at JLC.
BOARD_W = 122.53
BOARD_H = 97.29
PITCH_MM = 82.0          # vertical center-to-center; keep half-to-half gap >> 2*millradius (2 mm)
XOFF_MM  = -17.0         # lower-half horizontal nudge; -17 opens the right-lobe channel (was -15)
CX = BOARD_W / 2.0

# ---------------------------------------------------------------------------------------------
# Tab annotations. KiKit reads footprints with FPID kikit:Tab from the board (tabs.type=annotation
# in the preset). Each is placed ~1.5 mm OUTSIDE a board edge, arrow pointing INTO the board; KiKit
# shoots a ray from the origin to the board edge (one way) and to the frame partition line (the
# other) and builds a tab + mouse-bite between them. EVERY tab here is half->FRAME; there are NO
# half-to-half tabs, so each connection gets a clean two-sided mouse-bite and the halves separate.
#
# Coords are in the slimsplaydy_both frame (+x right, +y DOWN). Direction = (cos th, -sin th):
#   E (into board from the left) = 0deg   N (from bottom) = 90   W (from right) = 180   S (from top) = 270
#
# Each half is held on THREE sides. The two side tabs that reach the concave edges (GreenL on the
# upper-left, GreenR on the lower-right) are longer than the rest because KiKit's partition line
# follows the bounding box - that is expected. To retune: edit a list, re-run, preview; if a tab
# doesn't appear, flip its direction 180deg (the ray pointed the wrong way).
TAB_WIDTH_MM = 3.0

# Tabs on the UPPER half (anchored at the top - these never move when you tune the nest).
UPPER_TABS = [
    ( 30.0,  -2.0, "S"),   # top edge (left of peak)
    ( 88.0,  -2.0, "S"),   # top edge (right of peak; backs the upper MCU-slot strip)
    (124.0,  28.0, "W"),   # right edge (beside the MCU slot)
    (124.0,  62.0, "W"),   # right edge (below the MCU slot)
    (  3.0,  60.0, "E"),   # GreenL: left edge (3rd-side support; longer tab, concave side)
]
# Tabs on the LOWER half. Defined at the reference nest below; the script shifts them by however
# much you move the lower half (PITCH_MM / XOFF_MM) so they stay glued to its edges.
LOWER_TABS = [
    (-17.0, 103.0, "E"),   # left edge (backs the lower MCU-slot rail)
    (-17.0, 148.0, "E"),   # left edge (below the MCU slot)
    ( 15.0, 170.5, "N"),   # bottom-left lobe (left of battery slot)
    ( 92.0, 161.5, "N"),   # bottom-right lobe (right of battery slot)
    (110.0, 112.0, "W"),   # GreenR: right edge (3rd-side support where the old bridge was; longer tab)
]
LOWER_TABS_REF_PITCH = 79.0    # PITCH the LOWER_TABS coords were measured at
LOWER_TABS_REF_XOFF  = -15.0   # XOFF  the LOWER_TABS coords were measured at

_DIR_DEG = {"E": 0.0, "N": 90.0, "W": 180.0, "S": 270.0}


def add_tab_annotation(board, x_mm, y_mm, direction, width_mm=TAB_WIDTH_MM):
    """Place one kikit:Tab annotation footprint on the board."""
    fp = pcbnew.FOOTPRINT(board)
    fp.SetFPID(pcbnew.LIB_ID("kikit", "Tab"))
    fp.SetPosition(VECTOR2I(FromMM(x_mm), FromMM(y_mm)))
    fp.SetOrientationDegrees(_DIR_DEG[direction])
    # KiKit reads the tab width from a graphic text starting with "KIKIT:"; it is mandatory.
    txt = pcbnew.PCB_TEXT(fp)
    txt.SetText("KIKIT: width: %gmm" % width_mm)
    txt.SetLayer(pcbnew.Cmts_User)
    fp.Add(txt)
    board.Add(fp)


panel = Panel(OUT)

# Upper half (LEFT): centered, no rotation. nets -> L_<name>, refs unchanged.
panel.appendBoard(
    LEFT,
    VECTOR2I(FromMM(CX), FromMM(BOARD_H / 2.0)),
    origin=Origin.Center,
    rotationAngle=EDA_ANGLE(0, DEGREES_T),
    netRenamer=lambda seq, name: f"L_{name}",
    refRenamer=lambda seq, ref: ref,
    inheritDrc=False,
)

# Lower half (RIGHT): centered below by PITCH_MM (+XOFF_MM across), no rotation. Its top peak
# tucks into the upper half's battery slot. nets -> R_<name>, refs -> <ref>_2.
panel.appendBoard(
    RIGHT,
    VECTOR2I(FromMM(CX + XOFF_MM), FromMM(BOARD_H / 2.0 + PITCH_MM)),
    origin=Origin.Center,
    rotationAngle=EDA_ANGLE(0, DEGREES_T),
    netRenamer=lambda seq, name: f"R_{name}",
    refRenamer=lambda seq, ref: f"{ref}_2",
    inheritDrc=False,
)

# Place the tab annotations. Upper tabs as-is; lower tabs shifted to track the lower half.
for x_mm, y_mm, d in UPPER_TABS:
    add_tab_annotation(panel.board, x_mm, y_mm, d)
ldx = XOFF_MM - LOWER_TABS_REF_XOFF
ldy = PITCH_MM - LOWER_TABS_REF_PITCH
for x_mm, y_mm, d in LOWER_TABS:
    add_tab_annotation(panel.board, x_mm + ldx, y_mm + ldy, d)
ntabs = len(UPPER_TABS) + len(LOWER_TABS)

panel.save()
print(f"Wrote {OUT}  (+{ntabs} kikit:Tab annotations; lower tabs shifted by dx={ldx:g} dy={ldy:g})")
print("Next: kikit panelize -p panel/slimsplaydy_panel.json "
      "slimsplaydy_both.kicad_pcb panel/slimsplaydy_panel.kicad_pcb")
