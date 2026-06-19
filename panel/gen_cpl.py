#!/usr/bin/env python3
"""
gen_cpl.py - generate the JLCPCB CPL (positions) + BOM directly from the panel board.

Ported from LightFury. Reads slimsplaydy_panel.kicad_pcb, takes each placed part's FOOTPRINT
ORIGIN (= the body center the designer placed it on, which is exactly JLC's placement datum)
in the gerbers' own top-left origin frame, applies a clean per-LCSC rotation correction, and
writes positions.csv + bom.csv fresh. Idempotent; no pcbnew needed.

    python gen_cpl.py <panel.kicad_pcb> <out_dir>

slimsplaydy is simpler than LightFury: no LCD, no encoder, so there is NO RESW injection here.
Parts JLC places, per half: 17x PG1316S (S1-S17, consigned), CONN1 (Molex EZmate), PWR1
(power switch), RST1 (reset switch). Excluded: MCU1 (nice!nano, DNP/hand-soldered), MH1-15
(NPTH mounting holes), MAG1 (magsafe silk only).

WHY ORIGIN, NOT PAD CENTROID: verified on LightFury against F.Fab body outlines - the footprint
origin sits at the body center, while the pad centroid is skewed on any part with asymmetric
pads. JLC places the part so ITS library origin (body center) lands on our point, so origin is
correct. A "centroid correction" is a position BUG that drags good parts off their pads.

Coordinate frame:
    Ox, Oy = panel Edge.Cuts top-left (matches KiKit `post.origin: tl` used for the gerbers)
    CPL_X  = origin_x - Ox
    CPL_Y  = Oy - origin_y            (CPL Y axis is up; board Y is down)
    CPL_R  = footprint_orientation + ROT_CORR[lcsc]   (mod 360)
"""
import sys, os, csv, re
from collections import OrderedDict, Counter
from kicad_panel import load_panel

# per-LCSC rotation correction (deg, CCW+). Only oriented parts whose pin-1 datum differs from
# JLC's library need a nonzero value. CONFIRM each ONCE in JLC's assembly preview (read the exact
# delta, do not nudge iteratively). The reset/power switches use the SAME ceoloide footprints as
# LightFury, where these values were confirmed - good starting points, but re-confirm on the
# slimsplaydy panel. The Molex EZmate (C505023) was NOT on LightFury, so it starts at 0 -> CONFIRM.
ROT_CORR = {
    "C79174":    90.0,   # reset switch (ceoloide reset_switch_smd_side) - from LightFury, re-confirm
    "C2911519":  90.0,   # power switch (ceoloide power_switch_smd_side) - from LightFury, re-confirm
    "C505023":    0.0,   # Molex Pico-EZmate battery connector - NOT yet confirmed, set after JLC pass
    # PG1316S (C9900170245) consigned: left at 0 (no correction on LightFury's 54x). Confirm in preview.
}

# optional per-LCSC position datum override, in part-LOCAL mm (applied before rotation).
# Use ONLY if the JLC preview shows a part's body off its pads. Empty = footprint origin (correct).
POS_OVERRIDE = {
    # e.g. "C2911519": (-0.30, +0.14),   # in part-LOCAL mm; applies to BOTH halves automatically
}

# never place these (no JLC part / DNP / mechanical), even if they carry a stray field.
# NOTE: unlike LightFury, the battery connector here (CONN1, Molex EZmate C505023) IS JLC-placed,
# so "battery_connector" is NOT excluded.
EXCLUDE_LIB = ("mcu_nice_nano", "mounting_hole", "magsafe", "Fiducial", "NPTH")


def _prefix(ref):
    m = re.match(r"[A-Za-z]+", ref)
    return m.group(0) if m else ""


def excluded(fp):
    return any(k in fp.lib for k in EXCLUDE_LIB)


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: gen_cpl.py <panel.kicad_pcb> <out_dir>")
    board, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    panel = load_panel(board)
    Ox, Oy = panel.edge_bbox[0], panel.edge_bbox[1]
    print("panel: %d footprints; gerber tl-origin = (%.3f, %.3f)"
          % (len(panel.footprints), Ox, Oy))

    placed, skipped = [], []
    for fp in panel.footprints:
        # MCU1 carries a literal "DNP" in its LCSC field, so the no-lcsc test won't catch it;
        # EXCLUDE_LIB (mcu_nice_nano) does. A part with no LCSC and not in the exclude set would
        # still be skipped here (it can't be ordered) - none expected on this board.
        bad = (not fp.lcsc) or (fp.lcsc.upper() == "DNP") or excluded(fp)
        (skipped if bad else placed).append(fp)

    def cpl_xy(x, y):
        return round(x - Ox, 4), round(Oy - y, 4)

    cpl_rows = []
    for fp in placed:
        ov = POS_OVERRIDE.get(fp.lcsc)
        if ov:
            px, py = fp._rot_local(ov[0], ov[1])
        else:
            px, py = fp.x, fp.y          # footprint origin = body center = JLC datum
        X, Y = cpl_xy(px, py)
        R = round((fp.rot + ROT_CORR.get(fp.lcsc, 0.0)) % 360, 2)
        side = "bottom" if fp.layer == "B.Cu" else "top"
        cpl_rows.append([fp.ref, X, Y, R, side])

    cpl_rows.sort(key=lambda r: (_prefix(r[0]), r[0]))
    cpl_path = os.path.join(out, "positions.csv")
    with open(cpl_path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["Designator", "Mid X", "Mid Y", "Rotation", "Layer"])
        w.writerows(cpl_rows)
    print("  -> %s  (%d parts)" % (cpl_path, len(cpl_rows)))

    groups = OrderedDict()
    for fp in placed:
        g = groups.setdefault(fp.lcsc, {"refs": [], "fp": fp.lib, "val": fp.value})
        g["refs"].append(fp.ref)

    bom_path = os.path.join(out, "bom.csv")
    with open(bom_path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["Designator", "Footprint", "Quantity", "Value", "LCSC Part #"])
        for lcsc, g in groups.items():
            refs = sorted(g["refs"], key=lambda r: (_prefix(r), r))
            w.writerow([", ".join(refs), g["fp"], len(refs), g["val"], lcsc])
    print("  -> %s  (%d unique parts)" % (bom_path, len(groups)))

    sk = Counter(fp.lib.split(":")[-1] for fp in skipped)
    print("  skipped (no LCSC / mechanical / DNP): "
          + ", ".join("%sx%d" % (k, v) for k, v in sk.items()))


if __name__ == "__main__":
    main()
