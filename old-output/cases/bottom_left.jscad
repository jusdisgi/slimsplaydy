function board_left_extrude_1_outline_fn(){
    return new CSG.Path2D([[207.1449706,-151.4819173],[196.8743151,-166.336542]]).appendArc([193.2463716,-167.3969268],{"radius":3,"clockwise":true,"large":false}).appendPoint([163.7117145,-155.0095167]).appendArc([162.5505834,-154.7760362],{"radius":3,"clockwise":false,"large":false}).appendPoint([101.9074258,-154.7921846]).appendArc([98.9522036,-152.3131293],{"radius":3,"clockwise":true,"large":false}).appendPoint([90.6115626,-105.0110033]).appendArc([92.1234982,-101.8596159],{"radius":3,"clockwise":true,"large":false}).appendPoint([129.2210812,-81.5159702]).appendArc([130.5065608,-81.1505244],{"radius":3,"clockwise":true,"large":false}).appendPoint([147.5150457,-80.2591475]).appendArc([148.0775565,-80.2825679],{"radius":3,"clockwise":true,"large":false}).appendPoint([185.4755428,-85.3843827]).appendArc([185.8810456,-85.4119144],{"radius":3,"clockwise":false,"large":false}).appendPoint([204.6773593,-85.4119144]).appendArc([207.6773593,-88.4119144],{"radius":3,"clockwise":true,"large":false}).appendPoint([207.6773593,-149.7757828]).appendArc([207.1449705,-151.4819173],{"radius":3,"clockwise":true,"large":false}).close().innerToCAG()
.extrude({ offset: [0, 0, 1] });
}




                function bottom_left_case_fn() {
                    

                // creating part 0 of case bottom_left
                let bottom_left__part_0 = board_left_extrude_1_outline_fn();

                // make sure that rotations are relative
                let bottom_left__part_0_bounds = bottom_left__part_0.getBounds();
                let bottom_left__part_0_x = bottom_left__part_0_bounds[0].x + (bottom_left__part_0_bounds[1].x - bottom_left__part_0_bounds[0].x) / 2
                let bottom_left__part_0_y = bottom_left__part_0_bounds[0].y + (bottom_left__part_0_bounds[1].y - bottom_left__part_0_bounds[0].y) / 2
                bottom_left__part_0 = translate([-bottom_left__part_0_x, -bottom_left__part_0_y, 0], bottom_left__part_0);
                bottom_left__part_0 = rotate([0,0,0], bottom_left__part_0);
                bottom_left__part_0 = translate([bottom_left__part_0_x, bottom_left__part_0_y, 0], bottom_left__part_0);

                bottom_left__part_0 = translate([0,0,0], bottom_left__part_0);
                let result = bottom_left__part_0;
                
            
                    return result;
                }
            
            
        
            function main() {
                return bottom_left_case_fn();
            }

        