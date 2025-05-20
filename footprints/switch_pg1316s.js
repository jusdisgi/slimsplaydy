// Ergogen footprint for Kailh PG1316S "Ultra Low Profile" keyswitches
// By Hunter Cook @huntercook https://github.com/jusdisgi
// Based on KiCad Footprint by Mike Holscher available at: https://github.com/mikeholscher/zmk-config-mikefive/blob/main/files/footprint-and-cad/CPG1316S01D02_reversible_mikefives.kicad_mod

// Nets:
//    from: corresponds to pin 1
//    to: corresponds to pin 2
//
// Params:
//    side: default is F for Front
//      the side on which to place the single-side footprint and designator, either F or B
//    reversible: default is false
//      if true, the footprint will be placed on both sides so that the PCB can be
//      reversible

module.exports = {
  params: {
    designator: 'S',
    side: 'F',
    reversable: false,    
    from: undefined,
    to: undefined,
  },
  body: p => {
    const fp = [];
    const backside = (p.reversable || p.side === "B");
    const frontside = (p.reversable || p.side === "F");
    const flip = (backside && !frontside);

    if (!backside && !frontside) throw new Error('unsupported side: ' + p.side);

fp.push(`(footprint "PG1316S"`);
fp.push(p.at);
fp.push(`(layer "${(p.reversable ? "F.Cu" : (backside ? "B.Cu" : "F.Cu"))}")`);
fp.push(`(property "Reference" "${p.ref}" ${p.ref_hide} (at 0 0 ${p.r}) (layer "${p.side}.SilkS") (effects (font (size 1 1) (thickness 0.15))${flip ? " (justify mirror)" : ""}))`);

fp.push(`(attr smd)`);

// Drawings on F.Fab
fp.push(`(fp_rect (start -8 8) (end 8 -8) (stroke (width 0.1) (type default)) (fill none) (layer "F.Fab"))`);
fp.push(`(fp_rect (start -6.75 -6.5) (end 6.75 6.5) (stroke (width 0.1) (type default)) (fill none) (layer "F.Fab"))`);

// Drawings on Dwgs.User
fp.push(`(fp_poly (pts (xy ${(flip ? -3.8 : 3.8)} -3.5) (xy ${(flip ? -3.8 : 3.8)} -1.65) (xy ${(flip ? -3.3 : 3.3)} -1.15) (xy ${(flip ? 2.2 : -2.2)} -1.15) (xy ${(flip ? 2.2 : -2.2)} -3.9) (xy ${(flip ? -2.2 : 2.2)} -3.9) (xy ${(flip ? -2.2 : 2.2)} -3.5)) (stroke (width 0.1) (type solid)) (fill none) (layer "Dwgs.User") )`);

// Edge Cuts and Pads, on either or both sides.
if (frontside) {
  fp.push(`(fp_circle (center -5.8 2.75) (end -5.3 2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);
  fp.push(`(fp_circle (center 5.8 -2.75) (end 6.4 -2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);
  fp.push(`(pad "1" smd roundrect (at -1.55 2.65 ${p.r}) (size 3.25 2) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`);
  fp.push(`(pad "2" smd roundrect (at 1.55 2.65 ${p.r}) (size 2 2) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45)${p.to})`);
  fp.push(`(pad "3" smd roundrect (at -6.05 -5.875 ${p.r}) (size 1.4 1.75) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.1785714286) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" smd roundrect (at -6.05 5.875 ${p.r}) (size 1.4 1.75) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.1785714286) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" smd roundrect (at 6.05 -5.875 ${p.r}) (size 1.4 1.75) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.1785714286) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" smd roundrect (at 6.05 5.875 ${p.r}) (size 1.4 1.75) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.1785714286) (thermal_bridge_angle 45))`);
}
if (backside) {
  fp.push(`(fp_circle (center -5.8 -2.75) (end -5.2 -2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);
  fp.push(`(fp_circle (center 5.8 2.75) (end 6.3 2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);
  fp.push(`(pad "1" smd roundrect (at -1.55 2.65 ${p.r}) (size 2 2) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "2" smd roundrect (at 1.55 2.65 ${p.r}) (size 3.25 2) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" smd roundrect (at -6.05 -5.875 ${p.r}) (size 1.4 1.75) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.1785714286) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" smd roundrect (at -6.05 5.875 ${p.r}) (size 1.4 1.75) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.1785714286) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" smd roundrect (at 6.05 -5.875 ${p.r}) (size 1.4 1.75) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.1785714286) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" smd roundrect (at 6.05 5.875 ${p.r}) (size 1.4 1.75) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.1785714286) (thermal_bridge_angle 45))`);
}

//3D Model
fp.push(`(model "\${MODELS}/PG1316S--装配体.STEP" (offset (xyz -4.75 -6.25 -10.25)) (scale (xyz 1 1 1)) (rotate (xyz 0 0 0)))`);

    fp.push(')');
    return fp.join('\n');
  }
}

