#!/usr/bin/env python3
"""
render_cpl.py — local visual verification of a generated CPL against the real board.

Draws, in board coordinates, each part's copper pads + F.Fab body outline, then overlays
the placement marker decoded back from positions.csv (so it tests the ACTUAL numbers we'd
ship). A correct CPL = dot sits at the part body center, and the rotation tick + the
highlighted pin-1 pad agree with the part.

Outputs:
    verify_overview.png    whole panel: every placement dot over every pad (global alignment)
    verify_parts.png       one zoomed panel per unique LCSC part (datum + rotation + pin-1)

    python render_cpl.py <panel.kicad_pcb> <positions.csv> <out_dir>
"""
import sys, os, csv, math
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon
from kicad_panel import load_panel


def pad_corners(p, cx, cy, ang_deg):
    """Rectangle corners of a pad already placed at global (p.gx,p.gy); the pad's own
    rotation equals the footprint rotation for these parts, so reuse ang."""
    a = math.radians(ang_deg)
    ca, sa = math.cos(a), math.sin(a)
    hw, hh = p.w / 2.0, p.h / 2.0
    out = []
    for dx, dy in [(-hw, -hh), (hw, -hh), (hw, hh), (-hw, hh)]:
        out.append((p.gx + dx * ca - dy * sa, p.gy + dx * sa + dy * ca))
    return out


def load_cpl(path):
    d = {}
    raw = open(path, encoding="utf-8", errors="replace").read().replace("\x00", "")
    r = csv.reader(raw.splitlines())
    next(r)
    for row in r:
        if len(row) >= 5:
            d[row[0]] = (float(row[1]), float(row[2]), float(row[3]), row[4])
    return d


def main():
    board, cpl_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
    os.makedirs(out, exist_ok=True)
    panel = load_panel(board)
    Ox, Oy = panel.edge_bbox[0], panel.edge_bbox[1]
    cpl = load_cpl(cpl_path)
    byref = {fp.ref: fp for fp in panel.footprints}

    def cpl_to_board(X, Y):
        return X + Ox, Oy - Y

    # ── overview: all pads (grey) + placement dots (red), board frame ──────────────
    fig, ax = plt.subplots(figsize=(11, 14))
    for fp in panel.footprints:
        for p in fp.electrical_pads():
            ax.add_patch(Rectangle((p.gx - 0.3, p.gy - 0.3), 0.6, 0.6,
                                   color="#bbb", lw=0))
    for ref, (X, Y, R, side) in cpl.items():
        bx, by = cpl_to_board(X, Y)
        ax.plot(bx, by, ".", color="red", ms=3)
    ax.set_title("CPL overview — red dots are placement points, grey are copper pads.\n"
                 "Every dot should sit inside a pad cluster (no dots in empty space / off-board).")
    ax.set_aspect("equal")
    ax.invert_yaxis()   # board Y is down
    fig.tight_layout()
    fig.savefig(os.path.join(out, "verify_overview.png"), dpi=110)
    plt.close(fig)

    # ── per-unique-part zoom ───────────────────────────────────────────────────────
    seen = {}
    for fp in panel.footprints:
        if fp.ref in cpl and fp.lcsc and fp.lcsc not in seen:
            seen[fp.lcsc] = fp
    items = list(seen.items())
    n = len(items)
    cols = 4
    rows = math.ceil(n / cols)
    fig, axes = plt.subplots(rows, cols, figsize=(4 * cols, 4 * rows))
    axes = axes.flatten()
    for ax in axes[n:]:
        ax.axis("off")

    for ax, (lcsc, fp) in zip(axes, items):
        X, Y, R, side = cpl[fp.ref]
        bx, by = cpl_to_board(X, Y)
        # pads
        for p in fp.pads:
            col = "#5b9bd5" if p.ptype != "np_thru_hole" else "#e0e0e0"
            for poly in [pad_corners(p, bx, by, fp.rot)]:
                ax.add_patch(Polygon(poly, closed=True, facecolor=col,
                                     edgecolor="#1f4e79", lw=0.5, alpha=0.8))
            # mark pin 1 / first electrical pad
            if p.name == "1":
                ax.plot(p.gx, p.gy, "*", color="orange", ms=16, zorder=5)
                ax.annotate("pin1", (p.gx, p.gy), color="darkorange",
                            fontsize=8, weight="bold")
        # fab body outline
        if fp.fab_pts:
            xs = [q[0] for q in fp.fab_pts]
            ys = [q[1] for q in fp.fab_pts]
            ax.plot(xs, ys, ".", color="green", ms=1)
        # placement dot + rotation tick
        ax.plot(bx, by, "o", color="red", ms=9, zorder=6,
                markerfacecolor="none", markeredgewidth=2)
        a = math.radians(R)
        ax.annotate("", xy=(bx + 2.0 * math.cos(a), by + 2.0 * math.sin(a)),
                    xytext=(bx, by),
                    arrowprops=dict(arrowstyle="->", color="red", lw=1.5), zorder=6)
        ax.set_title(f"{fp.value}\n{lcsc}  ({fp.ref})  rot={R:g}°", fontsize=9)
        ax.set_aspect("equal")
        ax.invert_yaxis()
        # frame around the part
        allx = [q[0] for p in fp.pads for q in pad_corners(p, bx, by, fp.rot)] + [bx]
        ally = [q[1] for p in fp.pads for q in pad_corners(p, bx, by, fp.rot)] + [by]
        m = 2.0
        ax.set_xlim(min(allx) - m, max(allx) + m)
        ax.set_ylim(max(ally) + m, min(ally) - m)   # inverted

    fig.suptitle("Per-part verification — red ring = placement point (should be body center); "
                 "orange ★ = our pin-1; red arrow = rotation; blue = solder pads, grey = mounting.",
                 fontsize=11)
    fig.tight_layout(rect=(0, 0, 1, 0.98))
    fig.savefig(os.path.join(out, "verify_parts.png"), dpi=110)
    plt.close(fig)
    print("wrote verify_overview.png and verify_parts.png to", out)


if __name__ == "__main__":
    main()
