#!/usr/bin/env python3
"""
Merge the two routed slimsplaydy halves into one combined board, slimsplaydy_both.kicad_pcb.

Why a script (and not the old KiCad File>Append Board "Option B"): the two per-half boards
use IDENTICAL reference designators (both have S1-S17, CONN1, PWR1, RST1, MCU1, MAG1,
MH1-15). A plain append produces duplicate refs, which JLC's BOM/CPL can't use. KiKit's
appendBoard renames on the way in: right-half refs get a "_2" suffix and nets get L_/R_
prefixes so the two halves stay electrically distinct in the fab-only combined file.

This replaces the hand-merged slimsplaydy_both*.kicad_pcb AND the old Append-Board plan.
Don't hand-edit the output — fix the per-half board and re-run.

Run on YOUR machine (needs KiCad's pcbnew + KiKit):
    python panel/merge_both.py
Then panelize the result (see panel/README.md).

NOTE: appendBoard's signature is the part most likely to vary by KiKit version. If it
errors, that's the line to check first.
"""
import os
from pcbnew import VECTOR2I, FromMM, EDA_ANGLE, DEGREES_T
from kikit.panelize import Panel, Origin

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                       # slimsplaydy/
LEFT  = os.path.join(ROOT, "slimsplaydy_left.kicad_pcb")
RIGHT = os.path.join(ROOT, "slimsplaydy_right.kicad_pcb")
OUT   = os.path.join(ROOT, "slimsplaydy_both.kicad_pcb")

# Nest the halves SIDE BY SIDE (horizontal) using CENTER-anchored placement. Center anchoring
# is rotation-invariant, so it behaves predictably. Each outline is ~122.5 x ~97.3 mm.
# The two halves are mirror images, so side-by-side with no rotation lets their splayed edges
# face each other naturally (this is how they already sit in their absolute coordinates).
# Unlike LightFury (vertical stack + 180deg flip + integer TILT), slimsplaydy needs neither a
# flip nor a tilt: every part is already on a whole-degree orientation, so TILT=0 keeps them
# there and JLC's preview stays clean.
BOARD_W = 122.53
BOARD_H = 97.29
GAP_MM  = 2.5                       # gap between the facing edges; tighter = cheaper panel
PITCH_MM = BOARD_W + GAP_MM        # horizontal center-to-center spacing
CY = BOARD_H / 2.0

panel = Panel(OUT)

# Left half: centered, no rotation. nets -> L_<name>, refs unchanged.
panel.appendBoard(
    LEFT,
    VECTOR2I(FromMM(BOARD_W / 2.0), FromMM(CY)),
    origin=Origin.Center,
    rotationAngle=EDA_ANGLE(0, DEGREES_T),
    netRenamer=lambda seq, name: f"L_{name}",
    refRenamer=lambda seq, ref: ref,
    inheritDrc=False,
)

# Right half: centered to the right, no rotation. nets -> R_<name>, refs -> <ref>_2
# (S1->S1_2, CONN1->CONN1_2, PWR1->PWR1_2, ...).
panel.appendBoard(
    RIGHT,
    VECTOR2I(FromMM(BOARD_W / 2.0 + PITCH_MM), FromMM(CY)),
    origin=Origin.Center,
    rotationAngle=EDA_ANGLE(0, DEGREES_T),
    netRenamer=lambda seq, name: f"R_{name}",
    refRenamer=lambda seq, ref: f"{ref}_2",
    inheritDrc=False,
)

panel.save()
print(f"Wrote {OUT}")
print("Next: kikit panelize -p panel/slimsplaydy_panel.json "
      "slimsplaydy_both.kicad_pcb panel/slimsplaydy_panel.kicad_pcb")
