// Kailh PG1316S footprint for Ergogen
//
// Please note this is misslng the mounting holes for the little plastic legs on the switch.
// There is a hopefully better version now I made with https://kicad2ergogen.genteure.com
//
// Author: @huntercook https://github.com/jusdisgi
// Based on KiCad module CPG1316S01D02_mikeholscher By Mike Holscher
//
// The only parameters are "from" and "to" and there is no further configuration available.
//
//
module.exports = {
  params: {
      designator: 'S',
      from: undefined,
      to: undefined
  },
  body: p => `

  (module PG1316S (layer F.Cu) (tedit 67FEEE99)

      ${p.at /* parametric position */}
      (attr smd)
      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
      
      ${''/* corner marks */}
      (fp_line (start -7 -6) (end -7 -7) (layer F.SilkS) (width 0.15))
      (fp_line (start -7 7) (end -6 7) (layer F.SilkS) (width 0.15))
      (fp_line (start -6 -7) (end -7 -7) (layer F.SilkS) (width 0.15))
      (fp_line (start -7 7) (end -7 6) (layer F.SilkS) (width 0.15))
      (fp_line (start 7 6) (end 7 7) (layer F.SilkS) (width 0.15))
      (fp_line (start 7 -7) (end 6 -7) (layer F.SilkS) (width 0.15))
      (fp_line (start 6 7) (end 7 7) (layer F.SilkS) (width 0.15))
      (fp_line (start 7 -7) (end 7 -6) (layer F.SilkS) (width 0.15))

      ${''/* Diode Pocket */} 
      (fp_poly
        (pts
          (xy 3.8 -3.5)
          (xy 3.8 -1.65)
          (xy 3.3 -1.15)
          (xy -2.2 -1.15)
          (xy -2.2 -3.9)
          (xy 2.2 -3.9)
          (xy 2.2 -3.5)
        )
        (stroke (width 0.1) (type solid)) (fill none) (layer "Dwgs.User")
      )

      ${''/* keycap */}
      (fp_rect (start -8 -8) (end 8 8)
        (layer "Dwgs.User") (stroke (width 0.15) (type solid)) (fill none)
      )

      ${''/* pads */}
      (pad "1" smd rect (at -2.5 2.65 ${p.rot}) (size 1.55 2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.to})
      (pad "2" smd rect (at 2.5 2.65 ${p.rot}) (size 1.55 2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.from})
      (pad "MP" smd rect (at -6.35 -6 ${p.rot}) (size 2 2) (layers "F.Cu" "F.Paste" "F.Mask"))
      (pad "MP" smd rect (at -6.35 6 ${p.rot}) (size 2 2) (layers "F.Cu" "F.Paste" "F.Mask"))
      (pad "MP" smd rect (at 6.35 -6 ${p.rot}) (size 2 2) (layers "F.Cu" "F.Paste" "F.Mask"))
      (pad "MP" smd rect (at 6.35 6 ${p.rot}) (size 2 2) (layers "F.Cu" "F.Paste" "F.Mask"))
  )
  `
}