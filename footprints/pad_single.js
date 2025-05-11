module.exports = {
  params: {
    designator: 'XX',
    side: 'F',
    P1: { type: 'net', value: undefined },
  },
  body: p => {
    const fp = [];
    const flip = p.side === "B";
if (!flip && p.side !== "F") throw new Error('unsupported side: ' + p.side);

fp.push(`(footprint "Pad_Single"`);
fp.push(p.at);
fp.push(`(layer "${(flip ? "B.Cu" : "F.Cu")}")`);
fp.push(`(property "Reference" "${p.ref}" ${p.ref_hide} (at 0 0 ${p.r}) (layer "${p.side}.SilkS") (effects (font (size 1 1) (thickness 0.15))${ p.side === "B" ? " (justify mirror)" : ""}))`);

fp.push(`(attr smd)`);

// Unknown to kicad2ergogen
fp.push(`(embedded_fonts no)`);

// Pads
fp.push(`(pad "1" smd roundrect (at 0 0 ${p.r}) (size 1.3 0.8) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Mask" "${(flip ? "B" : "F")}.Paste") (roundrect_rratio 0.15) (thermal_bridge_angle 45)  ${p.P1})`);

// Drawings on F.SilkS
fp.push(`(fp_rect (start ${(flip ? 0.75 : -0.75)} -0.5) (end ${(flip ? -0.75 : 0.75)} 0.5) (stroke (width 0.1) (type default)) (fill no) (layer "${(flip ? "B.SilkS" : "F.SilkS")}") )`);

// Zones
fp.push(`(zone (net 0) (net_name "") (layer "${(flip ? "B.SilkS" : "F.SilkS")}")  (hatch edge 0.5) (connect_pads (clearance 0)) (min_thickness 0.25) (filled_areas_thickness no) (keepout (tracks allowed) (vias allowed) (pads not_allowed) (copperpour allowed) (footprints not_allowed)) (placement (enabled no) (sheetname "")) (fill (thermal_gap 0.5) (thermal_bridge_width 0.5)) (polygon (pts ${zoneXY(p, flip ? 0.75 : -0.75, -0.5)} ${zoneXY(p, flip ? -0.75 : 0.75, -0.5)} ${zoneXY(p, flip ? -0.75 : 0.75, 0.5)} ${zoneXY(p, flip ? 0.75 : -0.75, 0.5)})))`);

// Properties
// fp.push(`(property "Reference" "BAT+" (at 0 -0.5 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.SilkS" : "F.SilkS")}") (hide yes)  (effects (font (size 0.5 0.5) (thickness 0.1)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Value" "Pad_Single" (at 0 1 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}") (hide yes)  (effects (font (size 1 1) (thickness 0.15)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Datasheet" "" (at 0 0 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}") (hide yes)  (effects (font (size 1 1) (thickness 0.15)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Description" "Direct Solder Point" (at 0 0 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}") (hide yes)  (effects (font (size 1 1) (thickness 0.15)) (justify${ flip ? " mirror" : ""})))`);

    fp.push(')');
    return fp.join('\n');
  }
}
function zoneXY(point, offsetX, offsetY) {
  const rad = -point.rot * Math.PI / 180;
  const x = point.x + offsetX * Math.cos(rad) - offsetY * Math.sin(rad);
  const y = point.y + offsetX * Math.sin(rad) + offsetY * Math.cos(rad);
  return `(xy ${x.toFixed(3)} ${y.toFixed(3)})`;
}
