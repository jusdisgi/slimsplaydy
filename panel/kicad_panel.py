#!/usr/bin/env python3
"""
kicad_panel.py — pure-Python reader for a KiCad .kicad_pcb panel.

No pcbnew dependency: parses the s-expression text directly so it runs anywhere
(sandbox, CI, your machine). Used by gen_cpl.py and render_cpl.py.

Exposes:
    load_panel(path) -> Panel
    Panel.footprints : list[Footprint]
    Panel.edge_bbox  : (min_x, min_y, max_x, max_y)   # gerber tl-origin = (min_x, min_y)
"""
import re, math
from dataclasses import dataclass, field


def _blocks(s, tag):
    """Yield each top-level (tag ...) block by paren matching."""
    out = []
    i = 0
    while True:
        j = s.find(tag, i)
        if j < 0:
            break
        depth = 0
        k = j
        while k < len(s):
            c = s[k]
            if c == '(':
                depth += 1
            elif c == ')':
                depth -= 1
                if depth == 0:
                    out.append(s[j:k + 1])
                    i = k + 1
                    break
            k += 1
        else:
            break
    return out


_AT = re.compile(r'\(at (-?[\d.]+) (-?[\d.]+)(?: (-?[\d.]+))?\)')


@dataclass
class Pad:
    name: str
    ptype: str          # smd | thru_hole | np_thru_hole
    lx: float           # local x (footprint frame, pre-rotation)
    ly: float
    w: float
    h: float
    # filled in by Footprint: global position
    gx: float = 0.0
    gy: float = 0.0


@dataclass
class Footprint:
    ref: str
    lib: str            # e.g. "Resistor_SMD:R_0603_1608Metric"
    layer: str          # F.Cu | B.Cu
    x: float            # footprint origin, board frame
    y: float
    rot: float          # degrees, KiCad orientation (CCW+)
    value: str = ""
    lcsc: str = ""
    pads: list = field(default_factory=list)
    fab_pts: list = field(default_factory=list)   # F.Fab outline pts (board frame) for body render

    def _rot_local(self, lx, ly):
        """Rotate a local point by the footprint orientation into the board frame.
        KiCad screen frame: +x right, +y DOWN, orientation CCW-positive on screen
        which, with y-down, is implemented as the standard matrix below (verified
        against the shipped CPL global offset)."""
        a = math.radians(self.rot)
        ca, sa = math.cos(a), math.sin(a)
        gx = self.x + lx * ca - ly * sa
        gy = self.y + lx * sa + ly * ca
        return gx, gy

    def finalize(self):
        for p in self.pads:
            p.gx, p.gy = self._rot_local(p.lx, p.ly)

    def electrical_pads(self):
        """Solder pads only (exclude non-plated mechanical holes)."""
        return [p for p in self.pads if p.ptype != 'np_thru_hole']

    def pad_centroid(self, electrical_only=True):
        ps = self.electrical_pads() if electrical_only else self.pads
        if not ps:
            return self.x, self.y
        return (sum(p.gx for p in ps) / len(ps),
                sum(p.gy for p in ps) / len(ps))

    def pad_by_name(self, name):
        for p in self.pads:
            if p.name == name:
                return p
        return None


@dataclass
class Panel:
    footprints: list
    edge_bbox: tuple


def _parse_footprint(b):
    mlib = re.search(r'\(footprint "([^"]+)"', b)
    lib = mlib.group(1) if mlib else "?"
    mlayer = re.search(r'\(layer "([^"]+)"\)', b)
    layer = mlayer.group(1) if mlayer else "F.Cu"
    mref = re.search(r'\(property "Reference" "([^"]*)"', b) or \
           re.search(r'\(fp_text reference "([^"]*)"', b)
    ref = mref.group(1) if mref else "?"
    mval = re.search(r'\(property "Value" "([^"]*)"', b)
    value = mval.group(1) if mval else ""
    mlcsc = re.search(r'\(property "(?:LCSC|JLCPCB Part|JLC Part|Field4)" "([^"]*)"', b)
    lcsc = mlcsc.group(1).strip() if mlcsc else ""
    mat = _AT.search(b)
    if not mat:
        return None
    fx, fy, frot = float(mat.group(1)), float(mat.group(2)), float(mat.group(3) or 0.0)

    fp = Footprint(ref=ref, lib=lib, layer=layer, x=fx, y=fy, rot=frot,
                   value=value, lcsc=lcsc)

    # pads
    for pm in _blocks(b, '(pad '):
        nm = re.search(r'\(pad "([^"]*)" (\w+)', pm)
        if not nm:
            continue
        at = _AT.search(pm)
        if not at:
            continue
        sz = re.search(r'\(size (-?[\d.]+) (-?[\d.]+)\)', pm)
        fp.pads.append(Pad(
            name=nm.group(1), ptype=nm.group(2),
            lx=float(at.group(1)), ly=float(at.group(2)),
            w=float(sz.group(1)) if sz else 0.5,
            h=float(sz.group(2)) if sz else 0.5,
        ))

    # F.Fab outline pts (for body rendering) — collect line endpoints on F.Fab
    for seg in _blocks(b, '(fp_line'):
        if '"F.Fab"' in seg:
            pts = re.findall(r'\((?:start|end) (-?[\d.]+) (-?[\d.]+)\)', seg)
            for px, py in pts:
                fp.fab_pts.append(fp._rot_local(float(px), float(py)))

    fp.finalize()
    return fp


def load_panel(path):
    data = open(path, encoding="utf-8", errors="replace").read().replace("\x00", "")
    fps = []
    for b in _blocks(data, '(footprint'):
        fp = _parse_footprint(b)
        if fp:
            fps.append(fp)

    # Edge.Cuts bounding box (panel outline incl. KiKit frame)
    xs, ys = [], []
    for m in re.finditer(r'\(gr_(?:line|rect|arc|poly|circle)\b(.*?)\(layer "Edge\.Cuts"\)',
                         data, re.S):
        for cm in re.finditer(r'\((?:start|end|center|mid|xy) (-?[\d.]+) (-?[\d.]+)\)',
                              m.group(1)):
            xs.append(float(cm.group(1)))
            ys.append(float(cm.group(2)))
    bbox = (min(xs), min(ys), max(xs), max(ys)) if xs else (0, 0, 0, 0)
    return Panel(footprints=fps, edge_bbox=bbox)


if __name__ == "__main__":
    import sys
    p = load_panel(sys.argv[1])
    print(f"{len(p.footprints)} footprints; edge bbox {p.edge_bbox}")
