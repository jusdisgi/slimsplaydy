// SMD SOD-323F Diode ergogen footprint
// 
// Created with https://kicad2ergogen.genteure.com/
// kicad footprint D_SOD-323F which comes with
// kicad in ${KICAD9_FOOTPRINT_DIR}/Diode_SMD.pretty/D_SOD-323F.kicad_mod
//
// Tiny edits by @huntercook https://github.com/jusdisgi
//
// Only changes were making the preconfigured nets into the from/to params
// and removing the fp.push('version') line...I don't know wnat the prolem
// is with that line but it's a known bug so if you use the above tool, delete
// the version line and it should work better!

module.exports = {
  params: {
    designator: 'D',
    side: 'F',
    from: undefined,
    to: undefined
  },
  body: p => {
    const fp = [];
    const flip = p.side === "B";
if (!flip && p.side !== "F") throw new Error('unsupported side: ' + p.side);

fp.push(`(footprint "D_SOD-323F"`);
fp.push(p.at);
fp.push(`(layer ${(flip ? "B" : "F")}.Cu)`);
fp.push(`(descr "SOD-323F http://www.nxp.com/documents/outline_drawing/SOD323F.pdf")`);
fp.push(`(tags "SOD-323F")`);
fp.push(`(attr smd)`);

fp.push(`(property "Reference" "${p.ref}" ${p.ref_hide} (at 0 0 ${p.r}) (layer "${p.side}.SilkS") (effects (font (size 1 1) (thickness 0.15))${ p.side === "B" ? " (justify mirror)" : ""}))`);


// Pads
fp.push(`(pad "1" smd roundrect (at ${(flip ? 1.1 : -1.1)} 0 ${p.r}) (size 0.5 0.5) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Mask" "${(flip ? "B" : "F")}.Paste") (roundrect_rratio 0.25) ${p.to})`);
fp.push(`(pad "2" smd roundrect (at ${(flip ? -1.1 : 1.1)} 0 ${p.r}) (size 0.5 0.5) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Mask" "${(flip ? "B" : "F")}.Paste") (roundrect_rratio 0.25) ${p.from})`);

// F.SilkS
fp.push(`(fp_line (start ${(flip ? 1.61 : -1.61)} -0.85) (end ${(flip ? 1.61 : -1.61)} 0.85) (stroke (width 0.12) (type solid)) (layer ${(flip ? "B.SilkS" : "F.SilkS")}))`);
fp.push(`(fp_line (start ${(flip ? 1.61 : -1.61)} -0.85) (end ${(flip ? -1.05 : 1.05)} -0.85) (stroke (width 0.12) (type solid)) (layer ${(flip ? "B.SilkS" : "F.SilkS")}))`);
fp.push(`(fp_line (start ${(flip ? 1.61 : -1.61)} 0.85) (end ${(flip ? -1.05 : 1.05)} 0.85) (stroke (width 0.12) (type solid)) (layer ${(flip ? "B.SilkS" : "F.SilkS")}))`);

// F.CrtYd
fp.push(`(fp_line (start ${(flip ? 1.6 : -1.6)} -0.95) (end ${(flip ? 1.6 : -1.6)} 0.95) (stroke (width 0.05) (type solid)) (layer ${(flip ? "B.CrtYd" : "F.CrtYd")}))`);
fp.push(`(fp_line (start ${(flip ? 1.6 : -1.6)} -0.95) (end ${(flip ? -1.6 : 1.6)} -0.95) (stroke (width 0.05) (type solid)) (layer ${(flip ? "B.CrtYd" : "F.CrtYd")}))`);
fp.push(`(fp_line (start ${(flip ? 1.6 : -1.6)} 0.95) (end ${(flip ? -1.6 : 1.6)} 0.95) (stroke (width 0.05) (type solid)) (layer ${(flip ? "B.CrtYd" : "F.CrtYd")}))`);
fp.push(`(fp_line (start ${(flip ? -1.6 : 1.6)} -0.95) (end ${(flip ? -1.6 : 1.6)} 0.95) (stroke (width 0.05) (type solid)) (layer ${(flip ? "B.CrtYd" : "F.CrtYd")}))`);

// F.Fab
fp.push(`(fp_line (start ${(flip ? 0.9 : -0.9)} -0.7) (end ${(flip ? -0.9 : 0.9)} -0.7) (stroke (width 0.1) (type solid)) (layer ${(flip ? "B.Fab" : "F.Fab")}))`);
fp.push(`(fp_line (start ${(flip ? 0.9 : -0.9)} 0.7) (end ${(flip ? 0.9 : -0.9)} -0.7) (stroke (width 0.1) (type solid)) (layer ${(flip ? "B.Fab" : "F.Fab")}))`);
fp.push(`(fp_line (start ${(flip ? 0.3 : -0.3)} -0.35) (end ${(flip ? 0.3 : -0.3)} 0.35) (stroke (width 0.1) (type solid)) (layer ${(flip ? "B.Fab" : "F.Fab")}))`);
fp.push(`(fp_line (start ${(flip ? 0.3 : -0.3)} 0) (end ${(flip ? 0.5 : -0.5)} 0) (stroke (width 0.1) (type solid)) (layer ${(flip ? "B.Fab" : "F.Fab")}))`);
fp.push(`(fp_line (start ${(flip ? 0.3 : -0.3)} 0) (end ${(flip ? -0.2 : 0.2)} -0.35) (stroke (width 0.1) (type solid)) (layer ${(flip ? "B.Fab" : "F.Fab")}))`);
fp.push(`(fp_line (start ${(flip ? -0.2 : 0.2)} -0.35) (end ${(flip ? -0.2 : 0.2)} 0.35) (stroke (width 0.1) (type solid)) (layer ${(flip ? "B.Fab" : "F.Fab")}))`);
fp.push(`(fp_line (start ${(flip ? -0.2 : 0.2)} 0) (end ${(flip ? -0.45 : 0.45)} 0) (stroke (width 0.1) (type solid)) (layer ${(flip ? "B.Fab" : "F.Fab")}))`);
fp.push(`(fp_line (start ${(flip ? -0.2 : 0.2)} 0.35) (end ${(flip ? 0.3 : -0.3)} 0) (stroke (width 0.1) (type solid)) (layer ${(flip ? "B.Fab" : "F.Fab")}))`);
fp.push(`(fp_line (start ${(flip ? -0.9 : 0.9)} -0.7) (end ${(flip ? -0.9 : 0.9)} 0.7) (stroke (width 0.1) (type solid)) (layer ${(flip ? "B.Fab" : "F.Fab")}))`);
fp.push(`(fp_line (start ${(flip ? -0.9 : 0.9)} 0.7) (end ${(flip ? 0.9 : -0.9)} 0.7) (stroke (width 0.1) (type solid)) (layer ${(flip ? "B.Fab" : "F.Fab")}))`);
fp.push(`(fp_text user "\${REFERENCE}" (at 0 -1.85 ${p.r + 0}) (layer ${(flip ? "B.Fab" : "F.Fab")}) (effects (font (size 1 1) (thickness 0.15))${ p.side === "B" ? " (justify mirror)" : ""}))`);

fp.push(`(generator "pcbnew")`);
fp.push(`(generator_version "9.0")`);
fp.push(`(embedded_fonts no)`);
fp.push(`(model "\${KICAD9_3DMODEL_DIR}/Diode_SMD.3dshapes/D_SOD-323F.wrl" (offset (xyz 0 0 0)) (scale (xyz 1 1 1)) (rotate (xyz 0 0 0)))`);

fp.push(`)`);

    return fp.join('\n');
  }
}
