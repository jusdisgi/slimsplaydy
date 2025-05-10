module.exports = {
  params: {
    designator: 'XX',
    side: 'F',

  },
  body: p => {
    const fp = [];
    const flip = p.side === "B";
if (!flip && p.side !== "F") throw new Error('unsupported side: ' + p.side);

fp.push(`(footprint "Battery_301230"`);
fp.push(p.at);
fp.push(`(layer "${(flip ? "B.Cu" : "F.Cu")}")`);
fp.push(`(property "Reference" "${p.ref}" ${p.ref_hide} (at 0 0 ${p.r}) (layer "${p.side}.SilkS") (effects (font (size 1 1) (thickness 0.15))${ p.side === "B" ? " (justify mirror)" : ""}))`);

fp.push(`(descr "Nothing but silk, 35x15 for a little extra padding")`);
fp.push(`(tags "Battery Lithium 301230")`);
fp.push(`(attr smd board_only exclude_from_bom)`);

// Unknown to kicad2ergogen
fp.push(`(embedded_fonts no)`);

// Drawings on F.SilkS
fp.push(`(fp_line (start ${(flip ? -0 : 0)} 0) (end ${(flip ? -34 : 34)} 0) (stroke (width 0.1) (type default)) (layer "${(flip ? "B.SilkS" : "F.SilkS")}") )`);
fp.push(`(fp_line (start ${(flip ? -0 : 0)} 14) (end ${(flip ? -0 : 0)} 0) (stroke (width 0.1) (type default)) (layer "${(flip ? "B.SilkS" : "F.SilkS")}") )`);
fp.push(`(fp_line (start ${(flip ? -34 : 34)} 0) (end ${(flip ? -34 : 34)} 14) (stroke (width 0.1) (type default)) (layer "${(flip ? "B.SilkS" : "F.SilkS")}") )`);
fp.push(`(fp_line (start ${(flip ? -34 : 34)} 14) (end ${(flip ? -0 : 0)} 14) (stroke (width 0.1) (type default)) (layer "${(flip ? "B.SilkS" : "F.SilkS")}") )`);

// Zones
fp.push(`(zone (net 0) (net_name "") (layer "${(flip ? "B.SilkS" : "F.SilkS")}")  (hatch edge 0.5) (connect_pads (clearance 0)) (min_thickness 0.25) (filled_areas_thickness no) (keepout (tracks allowed) (vias allowed) (pads not_allowed) (copperpour allowed) (footprints not_allowed)) (placement (enabled no) (sheetname "")) (fill (thermal_gap 0.5) (thermal_bridge_width 0.5)) (polygon (pts ${zoneXY(p, flip ? -0 : 0, 0)} ${zoneXY(p, flip ? -34 : 34, 0)} ${zoneXY(p, flip ? -34 : 34, 14)} ${zoneXY(p, flip ? -0 : 0, 14)})))`);

// Properties
// fp.push(`(property "Reference" "Battery" (at ${(flip ? -3.5 : 3.5)} 1 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.SilkS" : "F.SilkS")}")  (effects (font (size 1 1) (thickness 0.1)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Value" "301230" (at ${(flip ? -3.5 : 3.5)} 2.5 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.SilkS" : "F.SilkS")}")  (effects (font (size 1 1) (thickness 0.15)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Datasheet" "Euclid" (at 0 0 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}") (hide yes)  (effects (font (size 1 1) (thickness 0.15)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Description" "" (at 0 0 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}") (hide yes)  (effects (font (size 1 1) (thickness 0.15)) (justify${ flip ? " mirror" : ""})))`);

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
