function createTriangle(level, palette) {
    project.clear();
    // ---- Setup Variables ---- //
    // TODO: to move these shared variables out of the scope, it has to make sure the paper.setup() is called.
    var base_measure = view.size.width < view.size.height ? view.size.width : view.size.height;
        padding = base_measure/6,
        unit = (base_measure - 2 * padding) / level, 
        group_center = new Point(view.center.x, view.center.y),
        radius = unit/2,
        frame_count = 0, 
        interval = 20,
        lattice = [];

    //--- Create base shape ---//
    var path = new Path.RegularPolygon(view.center, 3, radius);
    roundPath(path, radius/6);

    var center_shift = new Point(0, -radius/6), 
        ratio = Math.sqrt(3) / 2;  //the height to side ratio of a reg trig
        layers = Math.ceil(level / 3),
        layer_groups = [];

    //--- Create layer groups placeholder ---//
    for (var k = 0; k < layers; k++){
        var group = new Group();
        layer_groups.push(group);
    }
        
    //--- Create an array of objects that has all the (x, y) coordinates
    // and their corresponding indices (i, j); color and rotation.
    for (var i = 1; i <= level; i++){
        for (var j = 1; j <= i; j++) {
            var x = group_center.x - (i-1)*unit/2 + (j-1)*unit,
                y = group_center.y + level * unit * ratio/2 - i *unit*ratio,
                point = new Point(x, y),
                rotation = 60; // Default rotation

            if (i != level || j != 1){
                lattice.push({                                                  
                    key: [i, j],
                    center: point, 
                    rotation: rotation
                });
            }
        }
    }
    lattice.pop();
    lattice.shift();

    lattice.forEach(function(node){
        for (var k = 0; k < layers; k++){
            if ((node.key[1] == k + 1 && node.key[0] > k*2 && node.key[0] <= level - k)
                || (node.key[1] == node.key[0] - k && node.key[0] > k*2 && node.key[0] <= level - k) 
                || (node.key[0] == level - k && node.key[1] > k && node.key[1] < node.key[0]-k)
            ){
                var copy = path.clone();
                copy.position = node.center.add(center_shift); //you can use + in PaperScript. But in JS .add must be called to operate on vectors.
                copy.rotate(node.rotation, node.center);
                
                var anchor = new Path(new Point(node.center));  //these will the anchors for the triangle rotation center

                copy.name = "triangle";
                anchor.name = "anchor";
                
                var subgroup = new Group([copy, anchor]);
                layer_groups[k].addChild(subgroup);
            }
        }
    });

    view.onFrame = function(event){
        for (var k = 0; k < layers; k++){
            for (var i=0; i < layer_groups[k].children.length; i++){
                var triangle = layer_groups[k].children[i].children["triangle"],
                    anchor = layer_groups[k].children[i].children["anchor"];
                
                triangle.rotate(.5 * k, anchor.position);

                //TODO: Add a mouse over action:
                //Somehow allows the user to choose between static color
                //or the beaming color
                triangle.fillColor = palette[k % palette.length];
                
                // if (frame_count%interval===0){
                //     triangle.fillColor = palette[(frame_count/interval + k) % palette.length];
                // } 
            }
        }
        frame_count++;
    }
} 

function createSquare(level, palette) {
    project.clear();
    // ---- Setup Variables ---- //
    var base_measure = view.size.width < view.size.height ? view.size.width : view.size.height;
        padding = base_measure/6,
        unit = (base_measure - 2 * padding) / level, 
        group_center = new Point(view.center.x, view.center.y),
        radius = unit/2,
        frame_count = 0, 
        interval = 2,
        lattice = [];

    //--- Create base shape ---//
    var path = new Path.RegularPolygon(view.center, 4, radius);
    roundPath(path, radius/6);
    
    var layers = Math.ceil(level / 2),
        layer_groups = [];
    
    //--- Create layer groups placeholder ---//
    for (var k = 0; k < layers; k++){
        var group = new Group();
        layer_groups.push(group);
    }
    
    //--- Create an array of objects that has all the (x, y) coordinates
    // and their corresponding indices (i, j); color and rotation.
    for (var i = 1; i <= level; i++){
        for (var j = 1; j <= level; j++) {
            var x = group_center.x - level * unit / 2 + (i-1) * unit + unit/2,
                y = group_center.y - level * unit / 2 + (j-1) * unit + unit/2,
                point = new Point({x: x, y: y}),
                rotation = 0;
            
            if ((i != level && j != level) || (i != 1 && j != 1)){
                lattice.push({
                    key: [i, j], 
                    center: point,
                    rotation: rotation
                });
            }
        }
    }

    lattice.pop();
    lattice.shift();

    lattice.forEach(function(node){
        var i = node.key[0],
            j = node.key[1];

        for (var k=0; k<layers; k++){
            if(((i == k+1 || i == level - k) && j > k && j <= level - k)
            || ((j == k+1 || j == level - k) && i > k && i <= level -k)){
                
                var copy = path.clone();
                copy.position = node.center;
                layer_groups[k].addChild(copy);
            }
        }
    });

    view.onFrame = function(event){

        for (var k = 0; k < layers; k++){
            for (var i=0; i < layer_groups[k].children.length; i++){
                var square = layer_groups[k].children[i];
                square.rotate(.5 * k);
                
                if (frame_count%interval===0){
                    square.fillColor = palette[(frame_count/interval + k) % palette.length];
                } 
            }
        }
        frame_count++;
    }

}



