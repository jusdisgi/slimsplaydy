// Stolen from larssont
// Only change was to move the drawing from Usr.Drwgs to B.SilkS
// I want it for visual cue, not fabrication information

module.exports = {
    params: {
      designator: 'MAG',
      side: 'B',
      inner_diameter: 44.8,
      outer_diameter: 55.2,
      precision: 0.1, // Maximum segment length in mm
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

      const zone =
        `(zone
            (net 0)
            (net_name "")
            (layer "B.SilkS")
            (name "Magsafe Zone")
            (hatch full 0.5)
            (min_thickness 0.25)
            (filled_areas_thickness no)
            (keepout
                (tracks allowed)
                (vias allowed)
                (pads allowed)
                (copperpour allowed)
                (footprints allowed)
            )
            (polygon
                (pts
                    ${circle(p.outer_diameter / 2, p.precision)}
                    ${circle(p.inner_diameter / 2, p.precision)}
                )
            )
        )`

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
                ${zone}
            )`
    }
};
