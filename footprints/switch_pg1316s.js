// Kailh PG1316S "Ultra Low Profile" keyswitch ergogen footprint
// Author: Hunter Cook @huntercook https://github.com/jusdisgi
// Canonical location: https://github.com/jusdisgi/ergogen-footprints/blob/main/switch_pg1316s.js
//
// Based on KiCad Footprints by Mike Holscher available at: https://github.com/mikeholscher/zmk-config-mikefive/blob/main/files/footprint-and-cad/
//
// Nets:
//    from: corresponds to pin 1
//    to: corresponds to pin 2
//
// Params:
//    reversible: default is false
//      If true, the footprint will be placed on both sides so that the PCB can be
//      reversible.
//    side: default is 'F'
//      The side on which to place the single-side footprint and designator, either 
//      F (Front) or B (Back). This parameter is ignored if reversible = true.
//    large_p1: default is false
//        If true, pad 1 will be drawn as a rounded rectangle the same size and position
//        as the contact on the switch. If both this and square_p1 are false this pad
//        will be 1.55x2mm (like P2) and not rounded, as per the Kailh datasheet.
//    square_p1: default is false
//        If true and large_p1 false, pad 1 will be drawn as a rounded square with 
//        2mm sides, at the outer edge of the switch contact. This sizing 
//        matches P2 when square_p2 = true.
//    square_p2: default is false
//        If true pad 2 will be drawn as a rounded square with 2mm sides, positioned
//        to match the position of the switch contact. If both this and shift_p2 are false 
//        it will be drawn as per the Kailh datasheet. Please note that the 
//        datasheet positioning results in only half of the pad making contact with less
//        than half of the switch. It is unknown to the authors why the datasheet is this
//        way, but it is suspected to be in error.t
//    shift_p2: default is true
//        If true and square_p2 false, P2 will be drawn as a rounded 1.55x2mm rectangle
//        which matches the datasheet pad size, but positioned fully on the switch
//        contact, aligned to the outer edge.
//    small_mp: default is false
//        If true, mounting pads (all labeled P3) will be sized 1.4mm X 1.75mm, instead
//        of 2x2mm as per the Kailh datasheet. Recommended only if mp_vias is true.
//    mp_gnd: default is false
//        If true, mounting pads (all labeled P3) will be added to the GND net. Some
//        people like to put a GND pour on F.Cu and add mount points to that net for
//        improved mounting strength.
//    mp_net: default is GND
//        Sets the net if and only if mp_gnd is true. You almost certainly do not want
//        to change this.
//    pad_vias: default is false
//        If true, vias will be created in the center of each data pad (i.e. P1 and P2).
// **!!** NOTE: these vias can leak solder (and at the default size almost certainly 
//        will) which can require cleanup and/or damage reflow equipment! Use at your 
//        risk, and consider mitigations such as aluminum foil on the hotplate.
// **!!** NOTE: When reversible = true, vias are placed at the center of the
//        *front side* pads. For some pad configurations this may put them off-center on
//        the back side. This is unavoidable inasmuch as the centers of the pads are not
//        aligned, but if you desire a different via position consider placing the vias
//        manually in KiCad.
//    pad_via_size: default is 1.2
//        Size in mm of via (plating) in P1 and P2. No effect if pad_vias = false.
//        NOTE: see above warning re: solder leakage.
//    pad_via_hole: default is 0.8
//        Size in mm of via hole (drilling) in P1 and P2. No effect if pad_vias = false.
//        NOTE: see above warning re: solder leakage.
//    mp_vias: default is false
//        If true, vias will be created in the center of each mounting pad (all P3).
//        NOTE: see above warning re: solder leakage.
//    mp_via_size: default is 1.0
//        Size in mm of via (plating) in P3 mounting point pads. No effect if mp_vias = false.
//        NOTE: see above warning re: solder leakage.
//    mp_via_hole: default is 0.6
//        Size in mm of via hole (drilling) in P3 mounting pads. No effect if mp_vias = false.
//        NOTE: see above warning re: solder leakage.
//    key_3dmodel_filename: default is '\${MODELS}/PG1316S--装配体.STEP'
//        KiCad file location for 3D model file.
//    key_3dmodel_xyz_offset: default is [-4.75, -6.25, -10.25]
//        Spatial offset for 3D model.
//    key_3dmodel_xyz_rotation: default is [0, 0, 0]
//        Rotation for 3D model.
//    key_3dmodel_xyz_scale: [1, 1, 1]
//        Scale factors for 3D model.

module.exports = {
  params: {
    designator: 'S',
    from: undefined,
    to: undefined,
    reversible: false,
    side: 'F',
    large_p1: false,
    square_p1: false,
    square_p2: false,
    shift_p2: true,
    small_mp: false,
    mp_gnd: false,
    mp_net: { type: 'net', value: 'GND' }, // You really should not change this; set mp_gnd to false instead, there's no other net you want it attached to
    pad_vias: false,
    pad_via_size: 1.2,
    pad_via_hole: 0.8,
    mp_vias: false,
    mp_via_size: 1.0,
    mp_via_hole: 0.6,
    key_3dmodel_filename: '\${MODELS}/PG1316S--装配体.STEP', //Available at https://github.com/mikeholscher/zmk-config-mikefive/blob/main/files/footprint-and-cad/PG1316S--%E8%A3%85%E9%85%8D%E4%BD%93.STEP
    key_3dmodel_xyz_offset: [-4.75, -6.25, -10.25],
    key_3dmodel_xyz_rotation: [0, 0, 0],
    key_3dmodel_xyz_scale: [1, 1, 1],
  },
  body: p => {
    const fp = [];
    const backside = (p.reversible || p.side === "B");
    const frontside = (p.reversible || p.side === "F");
    const flip = (backside && !frontside);

    if (!backside && !frontside) throw new Error('unsupported side: ' + p.side);
    if (p.mp_via_size < p.mp_via_hole + 0.1) p.mp_via_size = p.mp_via_hole + 0.1;
    if (p.pad_via_size < p.pad_via_hole + 0.1) p.mp_via_size = p.mp_via_hole + 0.1;

fp.push(`(footprint "PG1316S"`);
fp.push(p.at);
fp.push(`(layer "${(flip ? "B.Cu" : "F.Cu")}")`);
fp.push(`(property "Reference" "${p.ref}" ${p.ref_hide} (at 0 0 ${p.r}) (layer "${p.side}.SilkS") (effects (font (size 1 1) (thickness 0.15))${flip ? " (justify mirror)" : ""}))`);

fp.push(`(attr smd)`);

// Drawings on F.Fab
fp.push(`(fp_rect (start -8 8) (end 8 -8) (stroke (width 0.1) (type default)) (fill none) (layer "F.Fab"))`);
fp.push(`(fp_rect (start -6.75 -6.5) (end 6.75 6.5) (stroke (width 0.1) (type default)) (fill none) (layer "F.Fab"))`);

// Drawings on Dwgs.User
fp.push(`(fp_poly (pts (xy ${(flip ? -3.8 : 3.8)} -3.5) (xy ${(flip ? -3.8 : 3.8)} -1.65) (xy ${(flip ? -3.3 : 3.3)} -1.15) (xy ${(flip ? 2.2 : -2.2)} -1.15) (xy ${(flip ? 2.2 : -2.2)} -3.9) (xy ${(flip ? -2.2 : 2.2)} -3.9) (xy ${(flip ? -2.2 : 2.2)} -3.5)) (stroke (width 0.1) (type solid)) (fill none) (layer "Dwgs.User") )`);

//Uncomment for silkscreens showing the biggest pads
//Helpful for understanding the other pad types.
//Front
//fp.push(`(fp_rect (start -3.175 1.65) (end 0.075 3.65) (stroke (width 0.1) (type default)) (fill no) (layer "F.SilkS") )`);
//fp.push(`(fp_rect (start 0.55 1.65) (end 2.55 3.65) (stroke (width 0.1) (type default)) (fill no) (layer "F.SilkS") )`);
//Back
//fp.push(`(fp_rect (start 3.175 1.65) (end -0.075 3.65) (stroke (width 0.1) (type default)) (fill no) (layer "B.SilkS") )`);
//fp.push(`(fp_rect (start -0.55 1.65) (end -2.55 3.65) (stroke (width 0.1) (type default)) (fill no) (layer "B.SilkS") )`);


// Holes for stabilizing legs, Front Side (side = 'F' and/or reversible = true)
if (frontside) {

  // These were the originals from Mike's kicad footprint. Changed to drilled holes to improve fabrication accuracy.
  // fp.push(`(fp_circle (center -5.8 2.75) (end -5.3 2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);
  // fp.push(`(fp_circle (center 5.8 -2.75) (end 6.4 -2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);

  fp.push(`(pad "" np_thru_hole circle (at -5.8 2.75) (size 1 1) (drill 1) (layers "*.Cu" "*.Mask"))`);
  fp.push(`(pad "" np_thru_hole circle (at 5.8 -2.75) (size 1.2 1.2) (drill 1.2) (layers "*.Cu" "*.Mask"))`);
  

//Pad 1, Front Side; default net = 'from'
//If/elseif/else for pad config; inline conditionals for via config
  if (p.large_p1) {
    fp.push(`(pad "1" smd roundrect (at -1.55 2.65 ${p.r}) (size 3.25 2) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`);
  } else if (p.square_p1) {
    fp.push(`(pad "1" smd roundrect (at -2.175 2.65 ${p.r}) (size 2 2) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`); 
  } else {
    fp.push(`(pad "1" smd rect (at -2.5 2.65 ${p.r}) (size 1.55 2) (layers "F.Cu" "F.Paste" "F.Mask") (thermal_bridge_angle 45) ${p.from})`);
  }

//Pad 2, Front Side; default net = 'to'
  if (p.square_p2) {
    fp.push(`(pad "2" smd roundrect (at 1.55 2.65 ${p.r}) (size 2 2) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.to})`);
  } else if (p.shift_p2) {
    fp.push(`(pad "2" smd rect (at 1.775 2.65 ${p.r}) (size 1.55 2) (layers "F.Cu" "F.Paste" "F.Mask") (thermal_bridge_angle 45) ${p.to})`);
  } else {
    fp.push(`(pad "2" smd rect (at 2.5 2.65 ${p.r}) (size 1.55 2) (layers "F.Cu" "F.Paste" "F.Mask") (thermal_bridge_angle 45) ${p.to})`);
  }

//Front Side Mount Points, all labeled P3; no net
//Inline conditionals for smaller pad config
  fp.push(`(pad "3" smd roundrect (at ${p.small_mp ? "-6.05 -5.875" : "-6.35 -6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" smd roundrect (at ${p.small_mp ? "-6.05 5.875" : "-6.35 6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" smd roundrect (at ${p.small_mp ? "6.05 -5.875" : "6.35 -6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" smd roundrect (at ${p.small_mp ? "6.05 5.875" : "6.35 6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
}

// Holes for stabilizing legs, Back Side (side = 'B' and/or reversible = true)
if (backside) {
  // fp.push(`(fp_circle (center -5.8 -2.75) (end -5.2 -2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);
  // fp.push(`(fp_circle (center 5.8 2.75) (end 6.3 2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);

  fp.push(`(pad "" np_thru_hole circle (at -5.8 -2.75) (size 1 1) (drill 1) (layers "*.Cu" "*.Mask"))`);
  fp.push(`(pad "" np_thru_hole circle (at 5.8 2.75) (size 1.2 1.2) (drill 1.2) (layers "*.Cu" "*.Mask"))`);


//Pad 1, Back Side; default net = 'from'
  if (p.large_p1) {
    fp.push(`(pad "1" smd roundrect (at 1.55 2.65 ${p.r}) (size 3.25 2) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`);
  } else if (p.square_p1) {
    fp.push(`(pad "1" smd roundrect (at 2.175 2.65 ${p.r}) (size 2 2) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`);
  } else {
    fp.push(`(pad "1" smd rect (at 2.5 2.65 ${p.r}) (size 1.55 2) (layers "B.Cu" "B.Paste" "B.Mask") (thermal_bridge_angle 45) ${p.from})`);
  }

//Pad 2, Back Side; default net = 'to'
  if (p.square_p2) {
    fp.push(`(pad "2" smd roundrect (at -1.55 2.65 ${p.r}) (size 2 2) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.to})`);
  } else if (p.shift_p2) {
    fp.push(`(pad "2" smd rect (at -1.775 2.65 ${p.r}) (size 1.55 2) (layers "B.Cu" "B.Paste" "B.Mask") (thermal_bridge_angle 45) ${p.to})`);
  } else {
    fp.push(`(pad "2" smd rect (at -2.5 2.65 ${p.r}) (size 1.55 2) (layers "B.Cu" "B.Paste" "B.Mask") (thermal_bridge_angle 45) ${p.to})`);
  }

//Back Side Mount Points, all labeled P3; no net
//Inline conditionals for smaller pad config
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "-6.05 -5.875" : "-6.35 -6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "-6.05 5.875" : "-6.35 6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "6.05 -5.875" : "6.35 -6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "6.05 5.875" : "6.35 6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);  
}

//Data Pad vias.
if (p.pad_vias) {
  if (frontside) { // Remember "frontside" includes reversable!
    if (p.large_p1) {
      fp.push(`(pad "1" thru_hole circle (at -1.55 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    } else if (p.square_p1) {
      fp.push(`(pad "1" thru_hole circle (at -2.175 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    } else {
      fp.push(`(pad "1" thru_hole circle (at -2.5 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    }
    if (p.square_p2) {
      fp.push(`(pad "2" thru_hole circle (at 1.55 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    } else if (p.shift_p2) {
      fp.push(`(pad "2" thru_hole circle (at 1.775 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    } else {
      fp.push(`(pad "2" thru_hole circle (at 2.5 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    }
  } else { //If it ain't frontside, must be backside ONLY 
    if (p.large_p1) {
      fp.push(`(pad "1" thru_hole circle (at 1.55 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    } else if (p.square_p1) {
      fp.push(`(pad "1" thru_hole circle (at 2.175 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    } else {
      fp.push(`(pad "1" thru_hole circle (at 2.5 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    }
    if (p.square_p2) {
      fp.push(`(pad "2" thru_hole circle (at -1.55 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    } else if (p.shift_p2) {
      fp.push(`(pad "2" thru_hole circle (at -1.775 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    } else {
      fp.push(`(pad "2" thru_hole circle (at -2.5 2.65 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    }
  }
}

//Mounting Point Vias
if (p.mp_vias) {
  fp.push(`(pad "3" thru_hole circle (at ${p.small_mp ? "-6.05 -5.875" : "-6.35 -6" } ${p.r}) (size ${p.mp_via_size} ${p.mp_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.mp_via_hole}) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" thru_hole circle (at ${p.small_mp ? "-6.05 5.875" : "-6.35 6" } ${p.r}) (size ${p.mp_via_size} ${p.mp_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.mp_via_hole}) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" thru_hole circle (at ${p.small_mp ? "6.05 -5.875" : "6.35 -6" } ${p.r}) (size ${p.mp_via_size} ${p.mp_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.mp_via_hole}) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" thru_hole circle (at ${p.small_mp ? "6.05 5.875" : "6.35 6" } ${p.r}) (size ${p.mp_via_size} ${p.mp_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.mp_via_hole}) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
}

//3D Model
fp.push(`(model ${p.key_3dmodel_filename} (offset (xyz ${p.key_3dmodel_xyz_offset[0]} ${p.key_3dmodel_xyz_offset[1]} ${p.key_3dmodel_xyz_offset[2]})) (scale (xyz ${p.key_3dmodel_xyz_scale[0]} ${p.key_3dmodel_xyz_scale[1]} ${p.key_3dmodel_xyz_scale[2]})) (rotate (xyz ${p.key_3dmodel_xyz_rotation[0]} ${p.key_3dmodel_xyz_rotation[1]} ${p.key_3dmodel_xyz_rotation[2]})))`);

    fp.push(')');
    return fp.join('\n');
  }
}

