// ---- User Input ---- //
var level = 42,   //TODO: allow for 10 ~ 60 range
    palette = swatches.makeup_artist;

// ---- Calculated Variables ---- //
var base_measure = view.size.width < view.size.height ? view.size.width : view.size.height;
    padding = base_measure/6,
    unit = (base_measure - 2 * padding) / level, 
    group_center = new Point(view.center.x, view.center.y),
    radius = unit/2,
    center_shift = new Point(0, -radius/6), 
    ratio = Math.sqrt(3) / 2;  //the height of a regular triangle to its side
    layers = Math.ceil(level / 3);
    

//--- Create an array of objects that has all the (x, y) coordinates
// and their corresponding indices (i, j); color and rotation.
var lattice = [];
for (var i = 1; i <= level; i++){
    for (var j = 1; j <= i; j++) {
        var x = group_center.x - (i-1)*unit/2 + (j-1)*unit,
            y = group_center.y + (level - i) * unit * ratio - padding,
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

//-------------------------------
var path = new Path.RegularPolygon(view.center, 3, radius);
roundPath(path, radius/6);

var layer_groups = [];
for (var k = 0; k < layers; k++){
    var group = new Group();
    layer_groups.push(group);
}

lattice.forEach(function(node){
    for (var k = 0; k < layers; k++){
        if ((node.key[1] == k + 1 && node.key[0] > k*2 && node.key[0] <= level - k)
            || (node.key[1] == node.key[0] - k && node.key[0] > k*2 && node.key[0] <= level - k) 
            || (node.key[0] == level - k && node.key[1] > k && node.key[1] < node.key[0]-k)
        ){
            var copy = path.clone();
            copy.position = node.center + center_shift;
            copy.rotate(node.rotation, node.center);
            
            var anchor = new Path(new Point(node.center));  //these will the anchors for the triangle rotation center

            copy.name = "triangle";
            anchor.name = "anchor";
            
            var subgroup = new Group([copy, anchor]);
            layer_groups[k].addChild(subgroup);
        }
    }
});

var frame_count = 0, 
    interval = Math.ceil(60/level);

function onFrame(event){

    for (var k = 0; k < layers; k++){

        for (var i=0; i < layer_groups[k].children.length; i++){
            
            var triangle = layer_groups[k].children[i].children["triangle"],
                anchor = layer_groups[k].children[i].children["anchor"];
            
            triangle.rotate(.5 * k, anchor.position);
            
            if (frame_count%interval===0){
                triangle.fillColor = palette[(frame_count/interval + k) % palette.length];
            } 
        }
    }
    frame_count++;

}






