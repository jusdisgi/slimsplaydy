// Stolen from larssont, then extended by jusdisgi.
//
// Draws the MagSafe ring two ways:
//   1. A hatched B.SilkS ring as a visual cue (original behaviour).
//   2. (optional, on by default) a REAL copper keepout / rule-area annulus on
//      the magnet-side copper layer, so the back-milled magnet pocket stays
//      clear of copper and the pour/traces/vias know to avoid it.
//
// Notes for a back-milled (blind) pocket on a 2-layer board:
//   - The keepout sits on the magnet side only (default B.Cu). That clears the
//     back GND pour, tracks, and through-vias from the milled band (a via would
//     be sheared by the pocket). It deliberately does NOT touch the front layer,
//     so the front GND pour stays continuous across the ring and the keys inside
//     the ring hole still reach GND. Drop one stitching via inside the ring to
//     tie the centre GND island to the front plane.
//   - pads are left allowed (the switches that sit over the band are front-side).

module.exports = {
    params: {
      designator: 'MAG',
      side: 'B',
      inner_diameter: 44.8,
      outer_diameter: 55.2,
      precision: 0.1, // Maximum segment length in mm
      // Real copper keepout (rule area) under the ring:
      keepout: true,            // emit the copper keepout annulus
      keepout_tracks: true,     // disallow tracks in the magnet band
      keepout_vias: true,       // disallow vias (a back-milled pocket shears them)
      keepout_pads: false,      // leave pads allowed (front-side switches overlap the band)
      keepout_copperpour: true, // clear copper pour in the band on the magnet-side layer
      keepout_margin: 0.5,      // grow the keepout this far past the ring (out & in) so
                                // the pour isn't sitting right on the magnets / pocket wall
    },
    body: p => {
      const circle = (r, precision) => {
        const circumference = 2 * Math.PI * r;
        const num_points = Math.ceil(circumference / precision);

        return Array.from({ length: num_points + 1}, (_, i) => {
          const a = (i * 2 * Math.PI) / num_points;
          return `(xy ${p.eaxy(r * Math.cos(a), r * Math.sin(a))})`;
        });
      };

      // annulus outline = outer ring followed by inner ring (even-odd fill)
      const ring_pts = (outer_r, inner_r) =>
        `${circle(outer_r, p.precision)}
                    ${circle(inner_r, p.precision)}`;

      // keepout band = grown past the magnet dimensions by keepout_margin
      const keepout_pts = ring_pts(
        p.outer_diameter / 2 + p.keepout_margin,
        Math.max(0, p.inner_diameter / 2 - p.keepout_margin)
      );

      const allow = b => (b ? 'not_allowed' : 'allowed');

      // REAL, plottable silk ring (inner + outer outlines) at the true magnet dimensions.
      // NB: a (zone ... (keepout ...)) on a silk layer is a RULE AREA - it shows as a hatch in
      // the editor but plots NOTHING to the silk gerber, so JLC can't see the magnet band. Two
      // fp_circle outlines plot correctly and mark where the back-milled pocket goes.
      const ring_circle = r =>
        `(fp_circle (center 0 0) (end ${r} 0)
            (stroke (width 0.2) (type solid)) (fill no) (layer "${p.side}.SilkS"))`;
      const silk =
        `${ring_circle(p.outer_diameter / 2)}
         ${ring_circle(p.inner_diameter / 2)}`

      const keepout = p.keepout ?
        `(zone
            (net 0)
            (net_name "")
            (layer "${p.side}.Cu")
            (name "Magsafe Keepout")
            (hatch edge 0.5)
            (keepout
                (tracks ${allow(p.keepout_tracks)})
                (vias ${allow(p.keepout_vias)})
                (pads ${allow(p.keepout_pads)})
                (copperpour ${allow(p.keepout_copperpour)})
                (footprints allowed)
            )
            (polygon
                (pts
                    ${keepout_pts}
                )
            )
        )` : '';

        return `
            (footprint "magsafe"
                (layer "${p.side}.Cu")
                ${p.at}
                (property "Reference" "${p.ref}"
                    (at 0 2.55 ${p.r})
                    (layer "${p.side}.SilkS")
                    ${p.ref_hide}
                    (effects (font (size 1 1) (thickness 0.15)))
                )
                (attr board_only)
                ${silk}
                ${keepout}
            )`
    }
};
