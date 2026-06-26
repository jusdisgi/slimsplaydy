# slimsplaydy — JLCPCB panel (KiKit)

Panelize the **routed** slimsplaydy halves for JLCPCB. This is the **scripted** pipeline ported
from LightFury (which proved out the by-hand merge + `kikit fab --assembly` path was a dead end).
The per-half boards (`slimsplaydy_left/right.kicad_pcb`) are the source of truth; everything below
rebuilds the combined board, panel, and CPL/BOM from them, so re-run it any time a half changes.

> **Supersedes** the old "Option B / KiCad *Append Board*" plan and the hand-merged
> `slimsplaydy_both*` files. Don't use those.

Per-half outline ≈ **122.5 × 97.3 mm**. The halves **stack vertically, interlocked** — the lower
half's top peak tucks into the upper half's battery-slot notch — so the nest is much tighter than a
flat side-by-side. Tune `PITCH_MM` / `XOFF_MM` in `merge_both.py` from the first KiKit preview.

**Environment:** use the **KiCad Command Prompt** (so `python` = KiCad's Python with `pcbnew`).
KiKit's `kikit.exe` installs to `...KiCad\9.0\3rdparty\Python311\Scripts`, which isn't on PATH by
default — add it for the session before the `kikit` commands:

```bat
set PATH=%PATH%;C:\Users\hunte\Documents\KiCad\9.0\3rdparty\Python311\Scripts
```

## Full workflow (in order)

```bash
cd slimsplaydy

# 1. Merge the two halves -> slimsplaydy_both.kicad_pcb. Right-half refs get a _2 suffix,
#    nets get L_/R_ prefixes so the halves stay electrically distinct. Vertical interlocked
#    nest, no rotation/tilt (every part is already on a whole degree). Replaces the by-hand
#    merge. ALSO drops 8 kikit:Tab annotations so the panelizer puts tabs exactly where we want.
#    Tune PITCH_MM / XOFF_MM / TAB_ANNOTATIONS in the script from the Step-2 preview.
python panel/merge_both.py

# 2. Frame it into a panel (full frame; tabs come from the annotations, see preset note below).
kikit panelize -p panel/slimsplaydy_panel.json slimsplaydy_both.kicad_pcb panel/slimsplaydy_panel.kicad_pcb

# 3. Export GERBERS from panel/slimsplaydy_panel.kicad_pcb (open in pcbnew -> Fabrication Toolkit
#    plugin, or KiCad Plot). Use the toolkit for GERBERS ONLY — NOT `kikit fab jlcpcb --assembly`
#    (it needs a schematic the panel's _2 refs can't match) and NOT the toolkit's own CPL/BOM.

# 3b. Copy the toolkit's gerber zip up into the canonical order folder:
cp panel/production/slimsplaydy_panel.zip production-panel/

# 4. Generate the CPL + BOM from the SAME panel file, straight into production-panel/.
python panel/gen_cpl.py panel/slimsplaydy_panel.kicad_pcb production-panel

# 5. LOCAL verification — open these and check BEFORE uploading.
python panel/render_cpl.py panel/slimsplaydy_panel.kicad_pcb production-panel/positions.csv panel/verify
#    verify_overview.png : every red dot must sit on a pad cluster, none off-board
#    verify_parts.png    : every red ring at body center; orange star = our pin-1
```

Upload to JLC: the three files in **`../production-panel/`** — `slimsplaydy_panel.zip` +
`positions.csv` + `bom.csv` (and attach `SlimSplaydy_BlindSlot_Both.png` to the order notes).
Full CPL/BOM rules + the one-time JLC rotation pass live in **`CPL_WORKFLOW.md`**.

## Where things live (after cleanup)

- **`../production-panel/`** — the canonical JLC upload set (gerber zip + `bom.csv` + `positions.csv`
  + blind-slot drawing + its own README). **This is what you order from.**
- **`panel/production/`** — Fabrication Toolkit scratch (gitignored, overwritten each run). Not for ordering.
- **`panel/verify/`** — local placement-check PNGs from `render_cpl.py`.
- **`../old_cruft/`** — superseded test-order files (`Production_JLCPCBA/`, the May `production/`,
  retired `cpl_build/`, `REVIEW-KICKOFF.md`). Kept for reference; don't fab from them.

## Parts (what JLC places)

Per half: **17× PG1316S** (S1–S17), **CONN1** Molex Pico-EZmate, **PWR1** power switch, **RST1**
reset switch. LCSC: EZmate `C505023`, power `C2911519`, reset `C79174`, PG1316S **consigned**
`C9900170245`. **Excluded** (not placed): MCU1 nice!nano (**DNP / hand-soldered**), MH1–15 (NPTH
mounting holes), MAG1 (magsafe silk only). `gen_cpl.py` already enforces all of this.

## The one manual step: confirm rotations (do this ONCE)

Positions are exact (origin = body center = JLC datum). The only thing board geometry can't tell us
is how JLC's library part is oriented vs our footprint. Resolve it in a **single clean pass** — read
JLC's exact values, don't nudge:

1. Upload and open JLC's assembly preview.
2. For each **oriented** part — **CONN1** (Molex `C505023`), **PWR1** (`C2911519`), **RST1**
   (`C79174`) — read whether it needs 0/90/180/270°.
3. Put each into `ROT_CORR` in `gen_cpl.py`, keyed by LCSC, then re-run steps 4–5 (positions are
   unaffected) and re-upload. `C79174` = 90 and `C2911519` = 90 are carried over from LightFury (same
   ceoloide footprints) as starting points — **still confirm them**. `C505023` starts at 0
   (un-confirmed). PG1316S (`C9900170245`) starts at 0.

If a part's *body* ever looks off its pads (not just rotated), add `POS_OVERRIDE[lcsc] = (dx, dy)`
in part-local mm. None expected.

## Blind slot (order note — NOT in these files)

The 0.8 mm back pocket for the steel MagSafe ring is **ordered at JLC**, not in the design files —
add it to the order notes / drawing as before
(`Production_JLCPCBA/SlimSplaydy_BlindSlot_Both.png`). At 0.8 mm depth F.Cu is untouched; B.Cu was
hand-routed clear of the ring — keep it clear on any re-route.

## Preset / gotchas

- **`slimsplaydy_panel.json`**: **annotation** tabs + **full frame** + mouse-bites. `fixed`/`spacing`
  tabs distribute blindly and land on the battery-slot openings (and `spacing` errors on concave
  outlines); annotation tabs put a tab exactly at each `kikit:Tab` marker. Rails 5 mm, mouse-bite
  0.5 mm drill @ 0.8 mm, tooling 1.52 mm, fiducials 1 mm copper / 2 mm opening, 1 mm mill radius,
  `JLCJLCJLCJLC` order token, origin `tl`.
- **Tabs are placed by `merge_both.py`** (`UPPER_TABS` + `LOWER_TABS`): **10 tabs, each half held on
  3 sides** — upper: top (2) + right (2) + left (`GreenL`); lower: left (2) + bottom (2) + right
  (`GreenR`). **Every tab is half→frame; there are NO half-to-half tabs** (fewest connections, and
  each cut is cleanly two-sided). They clear both battery slots and flank both MCU slots. Six sit on
  convex bounding-box edges (short tabs); `GreenL`/`GreenR` reach the concave upper-left / lower-right
  edges and are necessarily longer, because KiKit's partition line follows the bounding box.
  `LOWER_TABS` auto-shift with the nest, so they stay on the lower half when you change
  `PITCH_MM`/`XOFF_MM`. To retune: edit a list (each entry is `(x_mm, y_mm, into-board direction
  E/N/W/S)`), re-run step 1, re-preview. **If a tab doesn't appear, flip its direction 180°** — the
  ray pointed the wrong way. You can also drop `kikit:Tab` footprints by hand in KiCad (lib must be
  literally `kikit`; add a text field `KIKIT: width: 3mm`).
- **Don't let KiKit stitch the halves:** KiKit treats `slimsplaydy_both` as ONE board with two
  disjoint outlines and auto-adds a tab joining the two pieces at their single **closest approach**
  (independent of our annotations) — it shows up as a one-sided-cut bridge at the right shoulder of
  the tuck. The fix is separation: **PITCH 85 / XOFF −17** opens the nearest approach to ~6.6 mm
  (right shoulder ~7.6 mm, was 3.5 mm at PITCH 82) so KiKit leaves them apart. Tuck is still ~12 mm.
  (This also clears the **2 mm router** = 2 × `post.millradius` with room to spare.) If KiKit still
  stitches them at this gap, the definitive fix is the **multiboard** route — a `kikit:Board`
  annotation per half so KiKit treats them as two separate boards and never joins them.
- Tune the nest in `merge_both.py`: `PITCH_MM` (vertical center-to-center; smaller = deeper tuck =
  shorter panel, but watch the nearest-approach so KiKit doesn't stitch) and `XOFF_MM` (slide the
  lower half: more negative opens the right shoulder, less negative opens the left). Currently 85 / −17.
- **Prereq (done):** the per-half `LCSC` fields are filled and pushed to the PCBs, so the BOM carries
  part numbers. Verified: `gen_cpl.py` reads `C505023 / C2911519 / C79174 / C9900170245` straight off
  the boards.
- Gerbers and CPL **always** come from the same `slimsplaydy_panel.kicad_pcb` generation. If you
  re-panelize, re-export both — never mix generations.
