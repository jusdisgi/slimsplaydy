# SlimSplaydy CPL / BOM workflow

How to produce a correct JLCPCB pick-and-place (CPL) + BOM for the panel. Ported from LightFury,
which debugged this end-to-end; SlimSplaydy is simpler (no LCD, no encoder, no RESW injection).

## The rule set (proven on LightFury, applies here)

- **Position = footprint origin.** The footprint origin sits at each part's body center, which is
  exactly JLC's placement datum. Never shift to the pad centroid — that drags asymmetric parts
  (the Molex, the switches) off their pads.
- **CPL origin = panel Edge.Cuts top-left, Y flipped** — the same frame KiCad/the Fabrication
  Toolkit plots the gerbers in, so CPL and gerbers share one origin **by construction**, no global
  offset.
- **Rotation = footprint orientation + a per-LCSC correction** (`ROT_CORR`), integer degrees.
- **Single source of truth:** CPL + BOM come straight from `panel/slimsplaydy_panel.kicad_pcb` —
  the same file the gerbers come from. Never hand-patch positions.

## The tools (pure Python, no pcbnew — run anywhere)

- `kicad_panel.py` — parses the `.kicad_pcb` (footprints, pads, F.Fab outlines, Edge.Cuts bbox).
- `gen_cpl.py` — writes `positions.csv` + `bom.csv`. Idempotent. `ROT_CORR` / `POS_OVERRIDE` tables
  at the top hold the per-part corrections.
- `render_cpl.py` — draws the placement points over the real copper pads (→ `panel/verify/`) for
  **local** verification before uploading.

## Procedure

Run on the **same** panel file, in lockstep, whenever a half changes:

```bat
cd C:\Users\hunte\Documents\gittyup\slimsplaydy

:: 1. (only if a half changed) re-merge + re-panelize. Needs KiCad's pcbnew + KiKit on PATH.
python panel\merge_both.py
kikit panelize -p panel\slimsplaydy_panel.json slimsplaydy_both.kicad_pcb panel\slimsplaydy_panel.kicad_pcb

:: 2. GERBERS: open panel\slimsplaydy_panel.kicad_pcb in KiCad -> Fabrication Toolkit (-> panel\production\),
::    then copy the zip up into the canonical order folder:
copy panel\production\slimsplaydy_panel.zip production-panel\

:: 3. BOM + CPL from the SAME panel file, straight into production-panel\
python panel\gen_cpl.py panel\slimsplaydy_panel.kicad_pcb production-panel

:: 4. LOCAL verification — render onto the real pads and eyeball before uploading
python panel\render_cpl.py panel\slimsplaydy_panel.kicad_pcb production-panel\positions.csv panel\verify
start panel\verify\verify_overview.png
start panel\verify\verify_parts.png
```

Upload to JLC: the files in **`production-panel\`** — `slimsplaydy_panel.zip` + `positions.csv`
+ `bom.csv` (and attach `SlimSplaydy_BlindSlot_Both.png` to the order notes).

## The one manual step: confirm rotations (do ONCE per footprint change)

Positions are exact; only how JLC's library part is oriented vs our footprint needs a human check.

1. Upload, open JLC's assembly preview.
2. For each oriented part — power SW `C2911519`, reset SW `C79174`, Molex `C505023` — read whether
   it needs 0/90/180/270°. Read JLC's exact value; don't nudge iteratively.
3. Put each into `ROT_CORR` in `gen_cpl.py`, keyed by LCSC; re-run step 3 (positions unaffected).
   Current: `C2911519` = 90, `C79174` = 90 (from LightFury's same ceoloide footprints),
   `C505023` = 0, PG1316S `C9900170245` = 0.

If a part's *body* looks off its pads (not just rotated), add `POS_OVERRIDE[lcsc] = (dx, dy)` in
part-LOCAL mm — it auto-applies to the mirrored half. (PWR `C2911519` already carries a −0.3 mm
local x nudge.)

## Hard rules

- Gerbers and CPL always come from the **same** `slimsplaydy_panel.kicad_pcb` generation. Re-panelize
  → re-export both. No mixing generations.
- The nest (`PITCH_MM` / `XOFF_MM` in `merge_both.py`) must keep the two halves' nearest approach
  apart enough that KiKit doesn't stitch them and the 2 mm router can clear the channel — see the
  note in `merge_both.py`. Current good nest: **PITCH 80 / XOFF −15**.
