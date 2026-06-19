# slimsplaydy — JLCPCB panel (KiKit)

Panelize the **routed** slimsplaydy halves for JLCPCB. This is the **scripted** pipeline ported
from LightFury (which proved out the by-hand merge + `kikit fab --assembly` path was a dead end).
The per-half boards (`slimsplaydy_left/right.kicad_pcb`) are the source of truth; everything below
rebuilds the combined board, panel, and CPL/BOM from them, so re-run it any time a half changes.

> **Supersedes** the old "Option B / KiCad *Append Board*" plan and the hand-merged
> `slimsplaydy_both*` files. Don't use those.

Per-half outline ≈ **122.5 × 97.3 mm** → side-by-side nest ≈ **250 × 110 mm** panel (inside JLC tiers).

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
#    nets get L_/R_ prefixes so the halves stay electrically distinct. Side-by-side nest,
#    no rotation/tilt (every part is already on a whole degree). Replaces the by-hand merge.
python panel/merge_both.py

# 2. Frame it into a panel (fixed tabs + full frame; see preset note below).
kikit panelize -p panel/slimsplaydy_panel.json slimsplaydy_both.kicad_pcb panel/slimsplaydy_panel.kicad_pcb

# 3. Export GERBERS from panel/slimsplaydy_panel.kicad_pcb (open in pcbnew -> Fabrication Toolkit
#    plugin, or KiCad Plot). Use the toolkit for GERBERS ONLY — NOT `kikit fab jlcpcb --assembly`
#    (it needs a schematic the panel's _2 refs can't match) and NOT the toolkit's own CPL/BOM.

# 4. Generate the CPL + BOM from the SAME panel file (position = footprint origin; no pcbnew needed).
python panel/gen_cpl.py panel/slimsplaydy_panel.kicad_pcb panel/cpl_build

# 5. LOCAL verification — open these and check BEFORE uploading.
python panel/render_cpl.py panel/slimsplaydy_panel.kicad_pcb panel/cpl_build/positions.csv panel/cpl_build
#    verify_overview.png : every red dot must sit on a pad cluster, none off-board
#    verify_parts.png    : every red ring at body center; orange star = our pin-1
```

Upload to JLC: the **gerbers from step 3** + `panel/cpl_build/positions.csv` + `panel/cpl_build/bom.csv`.

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

- **`slimsplaydy_panel.json`**: **fixed** tabs (2/edge) + **full frame** + mouse-bites. LightFury
  found KiKit `spacing` tabs error in concave notches on irregular outlines; fixed tabs to the frame
  are reliable. Rails 5 mm, mouse-bite 0.5 mm drill @ 0.8 mm, tooling 1.52 mm, fiducials 1 mm copper /
  2 mm opening, 1 mm mill radius, `JLCJLCJLCJLC` order token, origin `tl`.
- Tighten `GAP_MM` in `merge_both.py` (currently 2.5 mm) if the halves sit too far apart — tighter =
  cheaper panel.
- **Prereq (done):** the per-half `LCSC` fields are filled and pushed to the PCBs, so the BOM carries
  part numbers. Verified: `gen_cpl.py` reads `C505023 / C2911519 / C79174 / C9900170245` straight off
  the boards.
- Gerbers and CPL **always** come from the same `slimsplaydy_panel.kicad_pcb` generation. If you
  re-panelize, re-export both — never mix generations.
