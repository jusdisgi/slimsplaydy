function case_left_extrude_1_outline_fn(){
    return new CSG.Path2D([[209.0970654,-153.5036837],[197.6203415,-169.1628509]]).appendArc([194.0414007,-170.1564091],{"radius":3,"clockwise":true,"large":false}).appendPoint([161.2824259,-156.4319339]).appendArc([160.0793585,-156.1992335],{"radius":3,"clockwise":false,"large":false}).appendPoint([100.3217331,-157.072438]).appendArc([97.3234771,-154.5937028],{"radius":3,"clockwise":true,"large":false}).appendPoint([88.2934933,-103.38212]).appendArc([89.7977052,-100.2349829],{"radius":3,"clockwise":true,"large":false}).appendPoint([127.1160599,-79.6273905]).appendArc([128.4092633,-79.2576944],{"radius":3,"clockwise":true,"large":false}).appendPoint([149.4042248,-78.1573951]).appendArc([149.973437,-78.1817373],{"radius":3,"clockwise":true,"large":false}).appendPoint([187.4722396,-83.3834608]).appendArc([187.8844438,-83.4119144],{"radius":3,"clockwise":false,"large":false}).appendPoint([206.6773593,-83.4119144]).appendArc([209.6773593,-86.4119144],{"radius":3,"clockwise":true,"large":false}).appendPoint([209.6773593,-151.7302625]).appendArc([209.0970654,-153.5036837],{"radius":3,"clockwise":true,"large":false}).close().innerToCAG()
.extrude({ offset: [0, 0, 1] });
}


function case_left_extrude_5_outline_fn(){
    return new CSG.Path2D([[209.0970654,-153.5036837],[197.6203415,-169.1628509]]).appendArc([194.0414007,-170.1564091],{"radius":3,"clockwise":true,"large":false}).appendPoint([161.2824259,-156.4319339]).appendArc([160.0793585,-156.1992335],{"radius":3,"clockwise":false,"large":false}).appendPoint([100.3217331,-157.072438]).appendArc([97.3234771,-154.5937028],{"radius":3,"clockwise":true,"large":false}).appendPoint([88.2934933,-103.38212]).appendArc([89.7977052,-100.2349829],{"radius":3,"clockwise":true,"large":false}).appendPoint([127.1160599,-79.6273905]).appendArc([128.4092633,-79.2576944],{"radius":3,"clockwise":true,"large":false}).appendPoint([149.4042248,-78.1573951]).appendArc([149.973437,-78.1817373],{"radius":3,"clockwise":true,"large":false}).appendPoint([187.4722396,-83.3834608]).appendArc([187.8844438,-83.4119144],{"radius":3,"clockwise":false,"large":false}).appendPoint([206.6773593,-83.4119144]).appendArc([209.6773593,-86.4119144],{"radius":3,"clockwise":true,"large":false}).appendPoint([209.6773593,-151.7302625]).appendArc([209.0970654,-153.5036837],{"radius":3,"clockwise":true,"large":false}).close().innerToCAG()
.extrude({ offset: [0, 0, 5] });
}


function board_left_extrude_5_outline_fn(){
    return new CSG.Path2D([[207.1449706,-151.4819173],[196.8743151,-166.336542]]).appendArc([193.2463716,-167.3969268],{"radius":3,"clockwise":true,"large":false}).appendPoint([163.7117145,-155.0095167]).appendArc([162.5505834,-154.7760362],{"radius":3,"clockwise":false,"large":false}).appendPoint([101.9074258,-154.7921846]).appendArc([98.9522036,-152.3131293],{"radius":3,"clockwise":true,"large":false}).appendPoint([90.6115626,-105.0110033]).appendArc([92.1234982,-101.8596159],{"radius":3,"clockwise":true,"large":false}).appendPoint([129.2210812,-81.5159702]).appendArc([130.5065608,-81.1505244],{"radius":3,"clockwise":true,"large":false}).appendPoint([147.5150457,-80.2591475]).appendArc([148.0775565,-80.2825679],{"radius":3,"clockwise":true,"large":false}).appendPoint([185.4755428,-85.3843827]).appendArc([185.8810456,-85.4119144],{"radius":3,"clockwise":false,"large":false}).appendPoint([204.6773593,-85.4119144]).appendArc([207.6773593,-88.4119144],{"radius":3,"clockwise":true,"large":false}).appendPoint([207.6773593,-149.7757828]).appendArc([207.1449705,-151.4819173],{"radius":3,"clockwise":true,"large":false}).close().innerToCAG()
.extrude({ offset: [0, 0, 5] });
}




                function bigbottom_left_case_fn() {
                    

                // creating part 0 of case bigbottom_left
                let bigbottom_left__part_0 = case_left_extrude_1_outline_fn();

                // make sure that rotations are relative
                let bigbottom_left__part_0_bounds = bigbottom_left__part_0.getBounds();
                let bigbottom_left__part_0_x = bigbottom_left__part_0_bounds[0].x + (bigbottom_left__part_0_bounds[1].x - bigbottom_left__part_0_bounds[0].x) / 2
                let bigbottom_left__part_0_y = bigbottom_left__part_0_bounds[0].y + (bigbottom_left__part_0_bounds[1].y - bigbottom_left__part_0_bounds[0].y) / 2
                bigbottom_left__part_0 = translate([-bigbottom_left__part_0_x, -bigbottom_left__part_0_y, 0], bigbottom_left__part_0);
                bigbottom_left__part_0 = rotate([0,0,0], bigbottom_left__part_0);
                bigbottom_left__part_0 = translate([bigbottom_left__part_0_x, bigbottom_left__part_0_y, 0], bigbottom_left__part_0);

                bigbottom_left__part_0 = translate([0,0,0], bigbottom_left__part_0);
                let result = bigbottom_left__part_0;
                
            
                    return result;
                }
            
            

                function wall_lower_case_fn() {
                    

                // creating part 0 of case wall_lower
                let wall_lower__part_0 = _outerwall_left_case_fn();

                // make sure that rotations are relative
                let wall_lower__part_0_bounds = wall_lower__part_0.getBounds();
                let wall_lower__part_0_x = wall_lower__part_0_bounds[0].x + (wall_lower__part_0_bounds[1].x - wall_lower__part_0_bounds[0].x) / 2
                let wall_lower__part_0_y = wall_lower__part_0_bounds[0].y + (wall_lower__part_0_bounds[1].y - wall_lower__part_0_bounds[0].y) / 2
                wall_lower__part_0 = translate([-wall_lower__part_0_x, -wall_lower__part_0_y, 0], wall_lower__part_0);
                wall_lower__part_0 = rotate([0,0,0], wall_lower__part_0);
                wall_lower__part_0 = translate([wall_lower__part_0_x, wall_lower__part_0_y, 0], wall_lower__part_0);

                wall_lower__part_0 = translate([0,0,0], wall_lower__part_0);
                let result = wall_lower__part_0;
                
            

                // creating part 1 of case wall_lower
                let wall_lower__part_1 = _innerwall_left_case_fn();

                // make sure that rotations are relative
                let wall_lower__part_1_bounds = wall_lower__part_1.getBounds();
                let wall_lower__part_1_x = wall_lower__part_1_bounds[0].x + (wall_lower__part_1_bounds[1].x - wall_lower__part_1_bounds[0].x) / 2
                let wall_lower__part_1_y = wall_lower__part_1_bounds[0].y + (wall_lower__part_1_bounds[1].y - wall_lower__part_1_bounds[0].y) / 2
                wall_lower__part_1 = translate([-wall_lower__part_1_x, -wall_lower__part_1_y, 0], wall_lower__part_1);
                wall_lower__part_1 = rotate([0,0,0], wall_lower__part_1);
                wall_lower__part_1 = translate([wall_lower__part_1_x, wall_lower__part_1_y, 0], wall_lower__part_1);

                wall_lower__part_1 = translate([0,0,0], wall_lower__part_1);
                result = result.subtract(wall_lower__part_1);
                
            
                    return result;
                }
            
            

                function _outerwall_left_case_fn() {
                    

                // creating part 0 of case _outerwall_left
                let _outerwall_left__part_0 = case_left_extrude_5_outline_fn();

                // make sure that rotations are relative
                let _outerwall_left__part_0_bounds = _outerwall_left__part_0.getBounds();
                let _outerwall_left__part_0_x = _outerwall_left__part_0_bounds[0].x + (_outerwall_left__part_0_bounds[1].x - _outerwall_left__part_0_bounds[0].x) / 2
                let _outerwall_left__part_0_y = _outerwall_left__part_0_bounds[0].y + (_outerwall_left__part_0_bounds[1].y - _outerwall_left__part_0_bounds[0].y) / 2
                _outerwall_left__part_0 = translate([-_outerwall_left__part_0_x, -_outerwall_left__part_0_y, 0], _outerwall_left__part_0);
                _outerwall_left__part_0 = rotate([0,0,0], _outerwall_left__part_0);
                _outerwall_left__part_0 = translate([_outerwall_left__part_0_x, _outerwall_left__part_0_y, 0], _outerwall_left__part_0);

                _outerwall_left__part_0 = translate([0,0,0], _outerwall_left__part_0);
                let result = _outerwall_left__part_0;
                
            
                    return result;
                }
            
            

                function _innerwall_left_case_fn() {
                    

                // creating part 0 of case _innerwall_left
                let _innerwall_left__part_0 = board_left_extrude_5_outline_fn();

                // make sure that rotations are relative
                let _innerwall_left__part_0_bounds = _innerwall_left__part_0.getBounds();
                let _innerwall_left__part_0_x = _innerwall_left__part_0_bounds[0].x + (_innerwall_left__part_0_bounds[1].x - _innerwall_left__part_0_bounds[0].x) / 2
                let _innerwall_left__part_0_y = _innerwall_left__part_0_bounds[0].y + (_innerwall_left__part_0_bounds[1].y - _innerwall_left__part_0_bounds[0].y) / 2
                _innerwall_left__part_0 = translate([-_innerwall_left__part_0_x, -_innerwall_left__part_0_y, 0], _innerwall_left__part_0);
                _innerwall_left__part_0 = rotate([0,0,0], _innerwall_left__part_0);
                _innerwall_left__part_0 = translate([_innerwall_left__part_0_x, _innerwall_left__part_0_y, 0], _innerwall_left__part_0);

                _innerwall_left__part_0 = translate([0,0,0], _innerwall_left__part_0);
                let result = _innerwall_left__part_0;
                
            
                    return result;
                }
            
            

                function case_lower_case_fn() {
                    

                // creating part 0 of case case_lower
                let case_lower__part_0 = bigbottom_left_case_fn();

                // make sure that rotations are relative
                let case_lower__part_0_bounds = case_lower__part_0.getBounds();
                let case_lower__part_0_x = case_lower__part_0_bounds[0].x + (case_lower__part_0_bounds[1].x - case_lower__part_0_bounds[0].x) / 2
                let case_lower__part_0_y = case_lower__part_0_bounds[0].y + (case_lower__part_0_bounds[1].y - case_lower__part_0_bounds[0].y) / 2
                case_lower__part_0 = translate([-case_lower__part_0_x, -case_lower__part_0_y, 0], case_lower__part_0);
                case_lower__part_0 = rotate([0,0,0], case_lower__part_0);
                case_lower__part_0 = translate([case_lower__part_0_x, case_lower__part_0_y, 0], case_lower__part_0);

                case_lower__part_0 = translate([0,0,0], case_lower__part_0);
                let result = case_lower__part_0;
                
            

                // creating part 1 of case case_lower
                let case_lower__part_1 = wall_lower_case_fn();

                // make sure that rotations are relative
                let case_lower__part_1_bounds = case_lower__part_1.getBounds();
                let case_lower__part_1_x = case_lower__part_1_bounds[0].x + (case_lower__part_1_bounds[1].x - case_lower__part_1_bounds[0].x) / 2
                let case_lower__part_1_y = case_lower__part_1_bounds[0].y + (case_lower__part_1_bounds[1].y - case_lower__part_1_bounds[0].y) / 2
                case_lower__part_1 = translate([-case_lower__part_1_x, -case_lower__part_1_y, 0], case_lower__part_1);
                case_lower__part_1 = rotate([0,0,0], case_lower__part_1);
                case_lower__part_1 = translate([case_lower__part_1_x, case_lower__part_1_y, 0], case_lower__part_1);

                case_lower__part_1 = translate([0,0,0], case_lower__part_1);
                result = result.union(case_lower__part_1);
                
            
                    return result;
                }
            
            
        
            function main() {
                return case_lower_case_fn();
            }

        