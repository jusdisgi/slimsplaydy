function board_right_extrude_1_outline_fn(){
    return new CSG.Path2D([[228.2473786,-151.4819173],[238.5180341,-166.336542]]).appendArc([242.1459776,-167.3969268],{"radius":3,"clockwise":false,"large":false}).appendPoint([271.6806347,-155.0095167]).appendArc([272.8417658,-154.7760362],{"radius":3,"clockwise":true,"large":false}).appendPoint([333.4849234,-154.7921846]).appendArc([336.4401456,-152.3131293],{"radius":3,"clockwise":false,"large":false}).appendPoint([344.7807866,-105.0110033]).appendArc([343.268851,-101.8596159],{"radius":3,"clockwise":false,"large":false}).appendPoint([306.171268,-81.5159702]).appendArc([304.8857884,-81.1505244],{"radius":3,"clockwise":false,"large":false}).appendPoint([287.8773035,-80.2591475]).appendArc([287.3147927,-80.2825679],{"radius":3,"clockwise":false,"large":false}).appendPoint([249.9168064,-85.3843827]).appendArc([249.5113036,-85.4119144],{"radius":3,"clockwise":true,"large":false}).appendPoint([230.7149899,-85.4119144]).appendArc([227.7149899,-88.4119144],{"radius":3,"clockwise":false,"large":false}).appendPoint([227.7149899,-149.7757828]).appendArc([228.2473787,-151.4819173],{"radius":3,"clockwise":false,"large":false}).close().innerToCAG()
.extrude({ offset: [0, 0, 1] });
}




                function bottom_right_case_fn() {
                    

                // creating part 0 of case bottom_right
                let bottom_right__part_0 = board_right_extrude_1_outline_fn();

                // make sure that rotations are relative
                let bottom_right__part_0_bounds = bottom_right__part_0.getBounds();
                let bottom_right__part_0_x = bottom_right__part_0_bounds[0].x + (bottom_right__part_0_bounds[1].x - bottom_right__part_0_bounds[0].x) / 2
                let bottom_right__part_0_y = bottom_right__part_0_bounds[0].y + (bottom_right__part_0_bounds[1].y - bottom_right__part_0_bounds[0].y) / 2
                bottom_right__part_0 = translate([-bottom_right__part_0_x, -bottom_right__part_0_y, 0], bottom_right__part_0);
                bottom_right__part_0 = rotate([0,0,0], bottom_right__part_0);
                bottom_right__part_0 = translate([bottom_right__part_0_x, bottom_right__part_0_y, 0], bottom_right__part_0);

                bottom_right__part_0 = translate([0,0,0], bottom_right__part_0);
                let result = bottom_right__part_0;
                
            
                    return result;
                }
            
            
        
            function main() {
                return bottom_right_case_fn();
            }

        