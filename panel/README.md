# slimsplaydy — JLCPCB panel (KiKit)

Workflow for panelizing the **routed** slimsplaydy halves for JLCPCB. Chosen approach (**Option B**):
build a fab-only combined board with KiCad's *Append Board* (routing preserved), then drive the
declarative `kikit panelize` CLI, then `kikit fab jlcpcb`. We do **not** reuse the old hand-merged
`slimsplaydy_both*` files. Everything here runs on Hunter's machine (KiKit needs `pcbnew`).

Per-half outline ≈ **123 × 98 mm** → side-by-side nest ≈ **250 × 110 mm** panel (inside JLC tiers).

## Step 1 — Build the combined source (KiCad, one-time per routing change)

Work on a **copy** so the routed `slimsplaydy_left.kicad_pcb` stays pristine.

1. Open `slimsplaydy_left.kicad_pcb` → **File → Save As…** → `slimsplaydy_panel_src.kicad_pcb`.
2. **File → Append Board…** → pick `slimsplaydy_right.kicad_pcb`. The whole right half drops in with all
   tracks/zones intact.
3. Position the right half **beside** the left with a ~2–3 mm gap (eyeball it — exact spacing isn't
   critical; KiKit frames around whatever arrangement it finds). Optionally rotate the right half 180°
   if it interlocks the angled edges and shrinks the bounding box — judge from the Step 2 preview.
4. **Ignore** the duplicate-reference / DRC warnings (two CONN1, two sets of S1–S17). This is a
   fab-only artifact with no schematic; `kikit fab jlcpcb` makes the designators unique in the CPL/BOM.
5. Save.

## Step 2 — Panelize

```sh
kikit panelize -p panel/slimsplaydy_panel.json \
  slimsplaydy_panel_src.kicad_pcb \
  panel/slimsplaydy_panel.kicad_pcb
```

Open `panel/slimsplaydy_panel.kicad_pcb` and check: 5 mm rails top & bottom, mousebite tabs on the
**straight outer edges** (not the angled corners or over the MCU/battery cutouts), 4 fiducials + 4
tooling holes on the rails. If a tab lands badly on a trapezoid corner, add explicit tab hints in the
preset (`"tabs": {"type": "fixed", ...}` with `vcount`/`hcount`, or KiKit tab annotations) and re-run.

## Step 3 — Fabrication outputs

Gerbers + drill only (assign LCSC / BOM in JLC's web app, as with the test order):

```sh
kikit fab jlcpcb panel/slimsplaydy_panel.kicad_pcb fab/
```

Full assembly (BOM + CPL) — only once the footprints carry an `LCSC` field, else LCSC comes out blank:

```sh
kikit fab jlcpcb --assembly --no-drc panel/slimsplaydy_panel.kicad_pcb fab/
```

LCSC parts: battery connector `C505023`, power switch `C2911519`, reset switch `C79174`, PG1316S
**consigned** `C9900170245`. nice!nano = **DNP / hand-soldered** (mark DNP, exclude from assembly).

## Notes

- Blind slot (0.8 mm back pocket for the steel MagSafe ring) is **ordered at JLC**, not in these files
  — add it to the order notes / drawing as before (`Production_JLCPCBA/SlimSplaydy_BlindSlot_Both.png`).
- Preset values (rails 5 mm, mousebite drill 0.5 / spacing 0.75 mm, tooling 1.52 mm, fiducials
  1 mm copper / 2 mm opening, 1 mm mill radius) are JLC-friendly defaults — tune from the preview.
