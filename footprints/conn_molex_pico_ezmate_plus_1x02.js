// Molex Pico EZMate Plus 1x02 Connector ergogen footprint
//
// NOT TO BE CONFUSED WITH Molex Pico EZMate
// The "Plus" is a different part with 1.0mm pitch instead of 1.2mm
// For the regular, non-Plus part, use ceoloide's footprint here: https://github.com/ceoloide/ergogen-footprints/blob/main/battery_connector_molex_pico_ezmate_1x02.js
// (Yes, I made that mistake in reverse and ordered the plus ones and that's why this footprint exists.)
//
//
// Author: Hunter Cook @huntercook https://github.com/jusdisgi
// Canonical location: https://github.com/jusdisgi/ergogen-footprints/blob/main/conn_molex_picoblade_tht_1x08_1mm25_horiz.js
//
// created with kicad2ergogen: https://kicad2ergogen.genteure.com/
//
// Component datasheet: https://www.molex.com/en-us/products/part-detail/2121340002?display=pdf
//
// Nets/Parameters
//
// side: F (default) for Front, B for Back
// P1: Battery negative pad, default GND
// P2: Battery positive pad, default BAT_P
// conn_3dmodel_filename: Filename for step model
// conn_3dmodel_xyz_offset: array of offset values, default is no offset
// conn_3dmodel_xyz_rotation: array of rotation values, default is no rotation
// conn_3dmodel_xyz_scale: array of model scale values, default is 1 (for 100% scale)
//
//

module.exports = {
  params: {
    designator: 'CONN',
    side: 'F',
    P1: { type: 'net', value: 'GND' },
    P2: { type: 'net', value: 'BAT_P' },    
    conn_3dmodel_filename: '\${MODELS}/2121340002.stp', // Available at: https://www.molex.com/content/dam/molex/molex-dot-com/products/automated/en-us/3dcadmodels/212/212134/2121340002_stp.zip
    conn_3dmodel_xyz_offset: [0, 0, 0],
    conn_3dmodel_xyz_rotation: [0, 0, 0],
    conn_3dmodel_xyz_scale: [1, 1, 1],
  },
  body: p => {
    const fp = [];
    const flip = p.side === "B";
if (!flip && p.side !== "F") throw new Error('unsupported side: ' + p.side);

fp.push(`(footprint "Molex_Pico_EZMate_Plus_1x02"`);
fp.push(p.at);
fp.push(`(layer "${(flip ? "B.Cu" : "F.Cu")}")`);
fp.push(`(property "Reference" "${p.ref}" ${p.ref_hide} (at 0 0 ${p.r}) (layer "${p.side}.SilkS") (effects (font (size 1 1) (thickness 0.15))${ p.side === "B" ? " (justify mirror)" : ""}))`);

fp.push(`(attr smd)`);

// Unknown to kicad2ergogen
fp.push(`(embedded_fonts no)`);

// Pads
fp.push(`(pad "" smd roundrect (at ${(flip ? 1.525 : -1.525)} 1.76 ${p.r}) (size 0.55 0.8) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Mask" "${(flip ? "B" : "F")}.Paste") (roundrect_rratio 0.15) (thermal_bridge_angle 45) )`);
fp.push(`(pad "" smd roundrect (at ${(flip ? -1.525 : 1.525)} 1.76 ${p.r}) (size 0.55 0.8) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Mask" "${(flip ? "B" : "F")}.Paste") (roundrect_rratio 0.15) (thermal_bridge_angle 45) )`);
fp.push(`(pad "1" smd roundrect (at ${(flip ? 0.5 : -0.5)} -2.24 ${p.r}) (size 0.7 0.8) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Mask" "${(flip ? "B" : "F")}.Paste") (roundrect_rratio 0.15) (thermal_bridge_angle 45)  ${p.P1})`);
fp.push(`(pad "2" smd roundrect (at ${(flip ? -0.5 : 0.5)} -2.24 ${p.r}) (size 0.7 0.8) (layers "${(flip ? "B" : "F")}.Cu" "${(flip ? "B" : "F")}.Mask" "${(flip ? "B" : "F")}.Paste") (roundrect_rratio 0.15) (thermal_bridge_angle 45)  ${p.P2})`);

// Drawings on F.Fab
fp.push(`(fp_text user "\${REFERENCE}" (at 0 2.5 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}")  (effects (font (size 1 1) (thickness 0.15)) (justify${ flip ? " mirror" : ""})))`);

// Drawings on F.SilkS
fp.push(`(fp_rect (start ${(flip ? 1.95 : -1.95)} -2.36) (end ${(flip ? -1.95 : 1.95)} 2.36) (stroke (width 0.1) (type solid)) (fill no) (layer "${(flip ? "B.SilkS" : "F.SilkS")}") )`);

// Properties
// fp.push(`(property "Reference" "REF**" (at 0 -0.5 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.SilkS" : "F.SilkS")}")  (effects (font (size 1 1) (thickness 0.1)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Value" "Molex_Pico_EZMate_Plus_1x02" (at 0 1 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}")  (effects (font (size 1 1) (thickness 0.15)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Datasheet" "" (at 0 0 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}") (hide yes)  (effects (font (size 1 1) (thickness 0.15)) (justify${ flip ? " mirror" : ""})))`);
// fp.push(`(property "Description" "" (at 0 0 ${(p.r + 0) % 360}) (unlocked yes) (layer "${(flip ? "B.Fab" : "F.Fab")}") (hide yes)  (effects (font (size 1 1) (thickness 0.15)) (justify${ flip ? " mirror" : ""})))`);

//3D Model
fp.push(`(model ${p.conn_3dmodel_filename} (offset (xyz ${p.conn_3dmodel_xyz_offset[0]} ${p.conn_3dmodel_xyz_offset[1]} ${p.conn_3dmodel_xyz_offset[2]})) (scale (xyz ${p.conn_3dmodel_xyz_scale[0]} ${p.conn_3dmodel_xyz_scale[1]} ${p.conn_3dmodel_xyz_scale[2]})) (rotate (xyz ${p.conn_3dmodel_xyz_rotation[0]} ${p.conn_3dmodel_xyz_rotation[1]} ${p.conn_3dmodel_xyz_rotation[2]})))`);

    fp.push(')');
    return fp.join('\n');
  }
}

