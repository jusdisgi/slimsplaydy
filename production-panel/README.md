# SlimSplaydy — JLCPCB order set

**These files are what you upload to JLCPCB. Nothing else.**

| file | what it is | upload as |
|---|---|---|
| `slimsplaydy_panel.zip` | Gerbers + drill for the full panel (both halves, frame, mouse-bites) | Gerber |
| `bom.csv` | Bill of materials (one line per LCSC part) | BOM |
| `positions.csv` | Pick-and-place / CPL (origin datum, integer rotations, PWR offset applied) | CPL |
| `SlimSplaydy_BlindSlot_Both.png` | Drawing for the 0.8 mm blind back-pocket | attach to **order notes** |

The gerber is uploaded once at the **start** of the order (before PCBA). The BOM/CPL are uploaded
in the PCBA step and can be re-uploaded freely. **You only need a fresh gerber when the copper
changes** (re-panelize or a half edit) — pure rotation/position tweaks ride on the CPL alone.

## What JLC assembles vs. what you do by hand

- **Assembled (40 placements):** 34× PG1316S (S1–S17 ×2, **consigned** reel `C9900170245`),
  2× power switch (`C2911519`), 2× reset switch (`C79174`), 2× Molex Pico-EZmate (`C505023`).
- **NOT assembled (mark DNP / hand-solder):** the **nice!nano** (one per half) — not in JLC's
  library. The mounting holes, MAG1 silk, and fiducials are mechanical/markers, not parts.

## Order notes (don't forget)

- **Blind slot:** mill a **0.8 mm-deep back pocket** (B side) under each MagSafe ring per
  `SlimSplaydy_BlindSlot_Both.png`. It is **not** in the gerbers — request it in the order remarks.
- **PG1316S are consigned** (your reel) — declare them as customer-supplied, not JLC-sourced.
- **nice!nano = DNP**, hand-soldered after.

## Regenerating these

Full procedure + hard rules: [`../panel/CPL_WORKFLOW.md`](../panel/CPL_WORKFLOW.md). Short version,
from the repo root, all from the **same** panel generation:

```bat
:: gerbers: open panel\slimsplaydy_panel.kicad_pcb in KiCad, run the Fabrication Toolkit,
:: then copy its zip up here:
copy panel\production\slimsplaydy_panel.zip production-panel\

:: BOM + CPL straight from the same panel file:
python panel\gen_cpl.py panel\slimsplaydy_panel.kicad_pcb production-panel

:: optional local sanity render (writes PNGs to panel\verify\):
python panel\render_cpl.py panel\slimsplaydy_panel.kicad_pcb production-panel\positions.csv panel\verify
```

Gerbers and CPL **must** come from the same panel generation, or parts land on stale copper.

## Part-specific corrections baked into `gen_cpl.py`

- Rotation (`ROT_CORR`) and position (`POS_OVERRIDE`) tweaks for the oriented parts live at the top
  of `gen_cpl.py`. Current: PWR/RST `C2911519`/`C79174` = **90°**, Molex `C505023` = **0°**,
  PG1316S = 0°; PWR `C2911519` nudged **0.3 mm west** (part-local, so the mirrored half tracks it).
- These rotations are confirmed-by-eye in JLC's assembly preview — see the one-time pass in
  `CPL_WORKFLOW.md` if a half edit ever changes a footprint.
