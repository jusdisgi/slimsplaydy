# slimsplaydy — review & optimize: session kickoff

Goal: review the **already-routed** slimsplaydy board, fix only genuine functional problems, and get
it panel-ready for JLCPCB. **Preserve the routing.** Regenerating from ergogen wipes routing (forces a
full re-route), so only do it if a real functional defect requires it.

## Context
- 34-key low-profile splay split; nice!nano (one per half), PG1316S. The original "Slim Splaydy".
- **Parent of `../xiphos`** and shares its design concept — read `../xiphos/CLAUDE.md` "Design concept"
  and "Production" sections; the workspace `../CLAUDE.md` "Schematics, combined boards & production"
  section applies here too.
- Already has a **JLC PCBA test order**: `production/` and `Production_JLCPCBA/` (BOM, CPL, gerbers,
  blind-slot drawings). LCSC: EZmate `C505023`, power `C2911519`, reset `C79174`, PG1316S consigned
  `C9900170245`; nano DNP / hand-soldered.
- Files: routed `slimsplaydy_left.kicad_pcb` / `_right` (+ hand-merged `_both*`), `*.kicad_sch`,
  `config.yaml`, local `footprints/`. (Note: `../xiphos/_old_slimsplaydy/` holds copies xiphos forked
  from — the working repo is here.)
- **No `CLAUDE.md` yet** — create one (model on `../zmk-config-totem/CLAUDE.md`; keep it thin) and fold
  in the shared design concept.

## First steps
1. Read `config.yaml`, the routed PCBs, schematics, and the production BOM/CPL. Write `slimsplaydy/CLAUDE.md`.
2. Sanity-check without re-routing: net/ref consistency, BOM completeness (every part has an LCSC #),
   footprints in sync with `../ergogen-footprints`, and schematic ↔ PCB parity per the
   `Schematics_and_Ergogen.md` workflow.
3. **Structure decision:** xiphos moved to a single combined board + one project + `L_`/`R_` nets. For
   slimsplaydy that rework means re-routing — likely **not** worth it since it's routed and PCBA-tested.
   Default to keeping the current structure; unify only if Hunter asks.
4. **Panelize for JLC with KiKit** (multiboard: rails / mouse-bites / fiducials / tooling, nested to
   minimize the bounding rectangle → lower cost). KiKit runs on Hunter's machine; Claude writes the
   config and picks the nest.
5. Confirm the blind-slot fab notes/drawings are current and traces still clear the slot.

git: hands-off — write the commands, don't run them.
