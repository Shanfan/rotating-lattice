// ---- User Input ---- //
var level = 13,   //TODO: allow for 3 ~ 60 range
    palette = ['#eee'];

// ---- Calculated Variables ---- //
var base_measure = view.size.width < view.size.height ? view.size.width : view.size.height;
    padding = base_measure/4,
    unit = (base_measure - 2 * padding) / level, 
    group_center = new Point(view.center.x, view.center.y),
    radius = unit/2,
    layers = Math.ceil(level / 2);


//--- Create an array of objects that has all the (x, y) coordinates
// and their corresponding indices (i, j); color and rotation.
var lattice = [];
for (var i = 1; i <= level; i++){
    for (var j = 1; j <= level; j++) {
        var x = (level - i) * unit + group_center.x/2,
            y = (level - j) * unit + group_center.y/2,
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

//-------------------------------
var path = new Path.RegularPolygon(view.center, 4, radius);
roundPath(path, radius/6);

var layer_groups = [];
for (var k = 0; k < layers; k++){
    var group = new Group();
    layer_groups.push(group);
}

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

var frame_count = 0, interval = 60;
function onFrame(event){

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
