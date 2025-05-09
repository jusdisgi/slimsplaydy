// Ergogen footprint for Kailh PG1316S "Ultra Low Profile" keyswitches
// Created with https://kicad2ergogen.genteure.com
// Based on https://github.com/mikeholscher/zmk-config-mikefive/blob/main/files/footprint-and-cad/CPG1316S01D02_mikeholscher.kicad_mod
// Minor modifications by @huntercook
//
//
module.exports = {
  params: {
    designator: 'S',
    side: 'F',
    from: undefined,
    to: undefined
  },
  body: p => {
    const fp = [];
    const flip = p.side === "B";
if (!flip && p.side !== "F") throw new Error('unsupported side: ' + p.side);

fp.push(`(footprint "CPG1316S01D02_mikeholscher"`);
fp.push(p.at);
fp.push(`(layer "${(flip ? "B.Cu" : "F.Cu")}")`);
fp.push(`(property "Reference" "${p.ref}" ${p.ref_hide} (at 0 0 ${p.r}) (layer "${p.side}.SilkS") (effects (font (size 1 1) (thickness 0.15))${ p.side === "B" ? " (justify mirror)" : ""}))`);

fp.push(`(attr smd)`);

// Unknown to kicad2ergogen

// Pads
fp.push(`(pad "1" smd rect (at ${(flip ? 2.5 : -2.5)} 2.65 ${p.r}) (size 1.55 2) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Paste" "${(flip ? "B" : "F")}.Mask") (thermal_bridge_angle 45)  ${p.to})`);
fp.push(`(pad "2" smd rect (at ${(flip ? -2.5 : 2.5)} 2.65 ${p.r}) (size 1.55 2) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Paste" "${(flip ? "B" : "F")}.Mask") (thermal_bridge_angle 45)  ${p.from})`);
fp.push(`(pad "3" smd rect (at ${(flip ? 6.35 : -6.35)} -6 ${p.r}) (size 2 2) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Paste" "${(flip ? "B" : "F")}.Mask") (thermal_bridge_angle 45))`);
fp.push(`(pad "3" smd rect (at ${(flip ? 6.35 : -6.35)} 6 ${p.r}) (size 2 2) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Paste" "${(flip ? "B" : "F")}.Mask") (thermal_bridge_angle 45))`);
fp.push(`(pad "3" smd rect (at ${(flip ? -6.35 : 6.35)} -6 ${p.r}) (size 2 2) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Paste" "${(flip ? "B" : "F")}.Mask") (thermal_bridge_angle 45))`);
fp.push(`(pad "3" smd rect (at ${(flip ? -6.35 : 6.35)} 6 ${p.r}) (size 2 2) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Paste" "${(flip ? "B" : "F")}.Mask") (thermal_bridge_angle 45))`);

// Drawings on Edge.Cuts
fp.push(`(fp_circle (center ${(flip ? 5.8 : -5.8)} 2.75) (end ${(flip ? 5.3 : -5.3)} 2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts") )`);
fp.push(`(fp_circle (center ${(flip ? -5.8 : 5.8)} -2.75) (end ${(flip ? -6.4 : 6.4)} -2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts") )`);

// Drawings on F.Fab
fp.push(`(fp_rect (start ${(flip ? 8 : -8)} 8) (end ${(flip ? -8 : 8)} -8) (stroke (width 0.1) (type default)) (fill none) (layer "${(flip ? "B.Fab" : "F.Fab")}") )`);
fp.push(`(fp_rect (start ${(flip ? 6.75 : -6.75)} -6.5) (end ${(flip ? -6.75 : 6.75)} 6.5) (stroke (width 0.1) (type default)) (fill none) (layer "${(flip ? "B.Fab" : "F.Fab")}") )`);

// Drawings on Dwgs.User
fp.push(`(fp_poly (pts (xy ${(flip ? -3.8 : 3.8)} -3.5) (xy ${(flip ? -3.8 : 3.8)} -1.65) (xy ${(flip ? -3.3 : 3.3)} -1.15) (xy ${(flip ? 2.2 : -2.2)} -1.15) (xy ${(flip ? 2.2 : -2.2)} -3.9) (xy ${(flip ? -2.2 : 2.2)} -3.9) (xy ${(flip ? -2.2 : 2.2)} -3.5)) (stroke (width 0.1) (type solid)) (fill none) (layer "Dwgs.User") )`);

// 3D Models
fp.push(`(model "\${KIPRJMOD}/PG1316S--装配体.STEP" (offset (xyz -4.75 -6.25 -10.25)) (scale (xyz 1 1 1)) (rotate (xyz 0 0 0)))`);

// Properties
// fp.push(`(property "Reference" "CPG1316" (at 0 0 ${(p.r + 0) % 360}) (unlocked yes) (layer "Cmts.User") (hide yes)  (effects (font (size 1 1) (thickness 0.1)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Value" "CPG1316S01D02_mikeholscher" (at 0 9 ${(p.r + 0) % 360}) (unlocked yes) (layer "Cmts.User") (hide yes)  (effects (font (size 1 1) (thickness 0.15)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Footprint" "Custom:CPG1316S01D02_mikeholscher" (at 0 10.85 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}") (hide yes)  (effects (font (size 1.27 1.27)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Datasheet" "" (at 0 0 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}") (hide yes)  (effects (font (size 1.27 1.27)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Description" "" (at 0 0 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}") (hide yes)  (effects (font (size 1.27 1.27)) (justify${ flip ? " mirror" : ""})))`);

    fp.push(')');
    return fp.join('\n');
  }
}

