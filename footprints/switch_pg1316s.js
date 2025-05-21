// Ergogen footprint for Kailh PG1316S "Ultra Low Profile" keyswitches
// By Hunter Cook @huntercook https://github.com/jusdisgi
// Based on KiCad Footprints by Mike Holscher available at: https://github.com/mikeholscher/zmk-config-mikefive/blob/main/files/footprint-and-cad/

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
//      F (Front) or B (Back). This parameter is ignored if reversable = true.
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
//        If true, Mounting pads (all labeled P3) will be sized 1.4mm X 1.75mm, instead
//        of 2x2mm as per the Kailh datasheet. Recommended only if mp_vias is true.
//    pad_vias: default is false
//        If true, vias will be created in the center of each data pad (i.e. P1 and P2).
//        NOTE: When reversable = true certain pad type combinations result in two vias
//        being placed; for those configurations this option is not recommended; if vias
//        are desired with these pad combinations, place them manually in KiCad.
// **!!** NOTE: these vias can leak solder (and at the default size almost certainly 
//        will) which can require cleanup and/or damage reflow equipment! Use at your 
//        risk, and consider mitigations such as aluminum foil on the hotplate.
//    pad_via_size: default is 0.8
//        Size in mm of via holes in P1 and P2. No effect if pad_vias = false.
//        NOTE: see above warning re: solder leakage.
//    mp_vias: default is false
//        If true, vias will be created in the center of each mounting pad (all P3).
//        NOTE: see above warning re: solder leakage.
//    mp_via_size: default is 0.6
//        Size in mm of via holes in P3 mounting point pads. No effect if mp_vias = false.
//        Please note same solder leakage note as above.
//        NOTE: see above warning re: solder leakage.

module.exports = {
  params: {
    designator: 'S',
    from: undefined,
    to: undefined,
    reversable: false,
    side: 'F',
    large_p1: false,
    square_p1: false,
    square_p2: false,
    shift_p2: true,
    small_mp: false,
    pad_vias: false,
    pad_via_size: 0.8,
    mp_vias: false,
    mp_via_size: 0.6
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

//Testing! Show the biggest pads on the silk layer.
//fp.push(`(fp_rect (start -3.175 1.65) (end 0.075 3.65) (stroke (width 0.1) (type default)) (fill no) (layer "F.SilkS") )`);
//fp.push(`(fp_rect (start 0.55 1.65) (end 2.55 3.65) (stroke (width 0.1) (type default)) (fill no) (layer "F.SilkS") )`);
fp.push(`(fp_rect (start 3.175 1.65) (end -0.075 3.65) (stroke (width 0.1) (type default)) (fill no) (layer "B.SilkS") )`);
fp.push(`(fp_rect (start -0.55 1.65) (end -2.55 3.65) (stroke (width 0.1) (type default)) (fill no) (layer "B.SilkS") )`);


// Edge Cuts and Pads, Frontside (either side = 'F' or reversable = true)
if (frontside) {
  fp.push(`(fp_circle (center -5.8 2.75) (end -5.3 2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);
  fp.push(`(fp_circle (center 5.8 -2.75) (end 6.4 -2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);
  if (p.large_p1) {
    fp.push(`(pad "1" ${p.pad_vias ? 'thru_hole' : 'smd'} roundrect (at -1.55 2.65 ${p.r}) (size 3.25 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`);
  } else if (p.square_p1) {
    fp.push(`(pad "1" ${p.pad_vias ? 'thru_hole' : 'smd'} roundrect (at -2.175 2.65 ${p.r}) (size 2 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`); 
  } else {
    fp.push(`(pad "1" ${p.pad_vias ? 'thru_hole' : 'smd'} rect (at -2.5 2.65 ${p.r}) (size 1.55 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "F.Cu" "F.Paste" "F.Mask") (thermal_bridge_angle 45) ${p.from})`);
  }

  if (p.square_p2) {
    fp.push(`(pad "2" ${p.pad_vias ? 'thru_hole' : 'smd'} roundrect (at 1.55 2.65 ${p.r}) (size 2 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.to})`);
  } else if (p.shift_p2) {
    fp.push(`(pad "2" ${p.pad_vias ? 'thru_hole' : 'smd'} rect (at 1.775 2.65 ${p.r}) (size 1.55 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "F.Cu" "F.Paste" "F.Mask") (thermal_bridge_angle 45) ${p.to})`);
  } else {
    fp.push(`(pad "2" ${p.pad_vias ? 'thru_hole' : 'smd'} rect (at 2.5 2.65 ${p.r}) (size 1.55 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "F.Cu" "F.Paste" "F.Mask") (thermal_bridge_angle 45) ${p.to})`);
  }
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "-6.05 -5.875" : "-6.35 -6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "-6.05 5.875" : "-6.35 6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "6.05 -5.875" : "6.35 -6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "6.05 5.875" : "6.35 6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
}
// Edge Cuts and Pads, Backside (either side = 'B' or reversable = true)
if (backside) {
  fp.push(`(fp_circle (center -5.8 -2.75) (end -5.2 -2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);
  fp.push(`(fp_circle (center 5.8 2.75) (end 6.3 2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);

  if (p.large_p1) {
    fp.push(`(pad "1" ${p.pad_vias ? 'thru_hole' : 'smd'} roundrect (at 1.55 2.65 ${p.r}) (size 3.25 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`);
  } else if (p.square_p1) {
    fp.push(`(pad "1" ${p.pad_vias ? 'thru_hole' : 'smd'} roundrect (at 2.175 2.65 ${p.r}) (size 2 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`);
  } else {
    fp.push(`(pad "1" ${p.pad_vias ? 'thru_hole' : 'smd'} rect (at 2.5 2.65 ${p.r}) (size 1.55 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (thermal_bridge_angle 45) ${p.from})`);
  }

  if (p.square_p2) {
    fp.push(`(pad "2" ${p.pad_vias ? 'thru_hole' : 'smd'} roundrect (at -1.55 2.65 ${p.r}) (size 2 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.to})`);
  } else if (p.shift_p2) {
    fp.push(`(pad "2" ${p.pad_vias ? 'thru_hole' : 'smd'} rect (at -1.775 2.65 ${p.r}) (size 1.55 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (thermal_bridge_angle 45) ${p.to})`);
  } else {
    fp.push(`(pad "2" ${p.pad_vias ? 'thru_hole' : 'smd'} rect (at -2.5 2.65 ${p.r}) (size 1.55 2) ${p.pad_vias ? `(drill ${p.pad_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (thermal_bridge_angle 45) ${p.to})`);
  }

  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "-6.05 -5.875" : "-6.35 -6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "-6.05 5.875" : "-6.35 6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "6.05 -5.875" : "6.35 -6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "6.05 5.875" : "6.35 6" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);  
}

//Testing! Place a via
// Doesn't work...need to learn how
//	fp.push(`(via (at -2.175 2.65 ${p.r}) (size 0.8) (drill 0.4) (layers "F.Cu" "B.Cu") ${p.from})`);

//3D Model
fp.push(`(model "\${MODELS}/PG1316S--装配体.STEP" (offset (xyz -4.75 -6.25 -10.25)) (scale (xyz 1 1 1)) (rotate (xyz 0 0 0)))`);

    fp.push(')');
    return fp.join('\n');
  }
}

