var padding = view.size.width/4; //canvas padding.

var count = 5,
    unit = (view.size.width - 2 * padding) / count, 
    lattice_center = new Point(view.center.x, padding + unit),
    size = unit/2,
    layers = Math.ceil(count / 3),
    palette = ['rgb(255,255,229)',
               'rgb(247,252,185)',
               'rgb(217,240,163)',
               'rgb(173,221,142)',
               'rgb(120,198,121)',
               'rgb(65,171,93)',
               'rgb(35,132,67)',
               'rgb(0,104,55)',
               'rgb(0,69,41)'];

var lattice = [];
// Create an array of objects that has all the (x, y) coordinates
// and their corresponding indices (i, j); color and rotation.
for (var i = 1; i <= count; i++){
    for (var j = 1; j <= i; j++) {
        var x = lattice_center.x - (i-1)*unit/2 + (j-1)*unit,
            y = lattice_center.y + (count - i) * unit *.8,
            point = new Point({x: x, y: y}),
            color = '#eee', // Placeholder color
            rotation = 60; // Default rotation
        //if (i != count || j != 1){
            lattice.push({                                                  
                key: [i, j],
                center: point, 
                color: color, 
                rotation: rotation
            });
        //}
    }
}
//lattice.pop();
//lattice.shift();

var path = new Path.RegularPolygon(view.center, 3, size);
roundPath(path, size/6);

for (var k = 0; k < layers; k++){
    lattice.forEach(function(node){
        if ( (node.key[0] == node.key[1]) 
            || node.key[1] == 1 || node.key[0] == count) {
            var copy = path.clone();
            copy.fillColor = node.color;
            copy.position = node.center;
            copy.rotate(node.rotation, node.center);
        } else if ((node.key[1] == k + 1 && node.key[0] > k*2 && node.key[0] <= count - k)
            || (node.key[1] == node.key[0] - k && node.key[0] > k*2 && node.key[0] <= count - k) 
            || (node.key[0] == count - k && node.key[1] > k && node.key[1] < node.key[0]-k)
        ){
            var copy = path.clone();
            copy.fillColor = node.color;
            copy.position = node.center;
            copy.rotate(node.rotation+360/layers * k, node.center);
        }
    });
}


var children = project.activeLayer.children
console.log(lattice.length, children.length);


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


		

