var base_measure = view.size.width < view.size.height ? view.size.width : view.size.height;
    padding = base_measure/4;

var level = 18,
    unit = (base_measure - 2 * padding) / level, 
    group_center = new Point(view.center.x, view.center.y),
    radius = unit/2,
    center_shift = new Point(0, -radius/6), 
    ratio = Math.sqrt(3) / 2;  //the height of a regular triangle to its side
    layers = Math.ceil(level / 3),
    palette = ['rgb(255,255,229)',
               'rgb(247,252,185)',
               'rgb(217,240,163)',
               'rgb(173,221,142)',
               'rgb(120,198,121)',
               'rgb(65,171,93)',
               'rgb(35,132,67)',
               'rgb(0,104,55)',
               'rgb(0,69,41)'];


//--- Create an array of objects that has all the (x, y) coordinates
// and their corresponding indices (i, j); color and rotation.
var lattice = [];
for (var i = 1; i <= level; i++){
    for (var j = 1; j <= i; j++) {
        var x = group_center.x - (i-1)*unit/2 + (j-1)*unit,
            y = group_center.y + (level - i) * unit * ratio - padding,
            point = new Point(x, y),
            color = palette[0],
            rotation = 60; // Default rotation

        if (i != level || j != 1){
            lattice.push({                                                  
                key: [i, j],
                center: point, 
                color: color, 
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
            copy.fillColor = node.color;
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

var color_count = 0;
function onFrame(event){

    for (var k = 0; k < layers; k++){
        for (var i=0; i < layer_groups[k].children.length; i++){
            
            var triangle = layer_groups[k].children[i].children["triangle"],
                anchor = layer_groups[k].children[i].children["anchor"];
            
            triangle.rotate(.5 * k, anchor.position);
            triangle.fillColor = palette[(color_count+k) % palette.length];
        }
    }
    //color_count= color_count + 1;
}



//----------- Below this line are all debuggers. Remove when it's done ----------//



//-------------- Helper Functions ------------------//
function roundPath(path,radius) {
    var segments = path.segments.slice(0);
    path.removeSegments();

    for(var i = 0, l = segments.length; i < l; i++) {
        var curPoint = segments[i].point;
        var nextPoint = segments[i + 1 == l ? 0 : i + 1].point;
        var prevPoint = segments[i - 1 < 0 ? segments.length - 1 : i - 1].point;
        var nextDelta = curPoint.subtract(nextPoint);
        var prevDelta = curPoint.subtract(prevPoint);

        nextDelta.length = radius;
        prevDelta.length = radius;

        path.add(
            new paper.Segment(
                curPoint.subtract(prevDelta),
                null,
                prevDelta.divide(2)
            )
        );

        path.add(
            new paper.Segment(
                curPoint.subtract(nextDelta),
                nextDelta.divide(2),
                null
            )
        );
    }
    path.closed = true;
    return path;
}


		

