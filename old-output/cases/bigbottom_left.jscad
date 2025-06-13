function case_left_extrude_1_outline_fn(){
    return new CSG.Path2D([[209.0970654,-153.5036837],[197.6203415,-169.1628509]]).appendArc([194.0414007,-170.1564091],{"radius":3,"clockwise":true,"large":false}).appendPoint([161.2824259,-156.4319339]).appendArc([160.0793585,-156.1992335],{"radius":3,"clockwise":false,"large":false}).appendPoint([100.3217331,-157.072438]).appendArc([97.3234771,-154.5937028],{"radius":3,"clockwise":true,"large":false}).appendPoint([88.2934933,-103.38212]).appendArc([89.7977052,-100.2349829],{"radius":3,"clockwise":true,"large":false}).appendPoint([127.1160599,-79.6273905]).appendArc([128.4092633,-79.2576944],{"radius":3,"clockwise":true,"large":false}).appendPoint([149.4042248,-78.1573951]).appendArc([149.973437,-78.1817373],{"radius":3,"clockwise":true,"large":false}).appendPoint([187.4722396,-83.3834608]).appendArc([187.8844438,-83.4119144],{"radius":3,"clockwise":false,"large":false}).appendPoint([206.6773593,-83.4119144]).appendArc([209.6773593,-86.4119144],{"radius":3,"clockwise":true,"large":false}).appendPoint([209.6773593,-151.7302625]).appendArc([209.0970654,-153.5036837],{"radius":3,"clockwise":true,"large":false}).close().innerToCAG()
.extrude({ offset: [0, 0, 1] });
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
            
            
        
            function main() {
                return bigbottom_left_case_fn();
            }

        