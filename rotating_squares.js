var unit = 44, 
    count = 7, 
    size = unit/1.8;

var path = new Path.RegularPolygon(view.center, 4, size);
path.fillColor =  '#eee';
path.rotate(180);

roundPath(path, size/6);

var symbol = new Symbol(path);

var positions = [];

for (var i = 1; i <= count; i++){
    for (var j = 1; j <= count; j++) {
        var x = (count - i) * unit + view.center.x/2;
        var y = (count - j) * unit + view.center.y/2;
        var point = new Point({x: x, y: y});
        positions.push({i: i, j: j, point: point});
    }
}

var nested_postions = [];
for (var i=1; i<=count; i++){
    var new_group = positions.filter(function(p){
        return p.i == i;
    });
    nested_postions.push(new_group);
}


    
console.log(nested_postions);

positions.forEach(function(p){
    var placed = symbol.place(p.point);
    var text = new PointText(p.point);
    text.fillColor = 'red';
    text.justification = 'center';
    text.content = p.i + ', ' + p.j;
});

function roundPath(path, r) {
    var l = path.segments.length;
    var segments = path.segments.slice(0);
    path.segments = [];
    
    for (var i = 0; i < l; i++ ){
        
        var curPoint = segments[i].point,
            nextPoint = segments[i + 1 == l ? 0 : i + 1].point,
            prevPoint = segments[i - 1 < 0 ? segments.length - 1 : i - 1].point,
            nextDelta = curPoint - nextPoint,
            prevDelta = curPoint - prevPoint,
            radian = (prevDelta.angleInRadians - nextDelta.angleInRadians)/2;
        
        if (radian < 0) { radian += Math.PI; }
        else if (radian > Math.PI) { radian = 2*Math.PI - radian; }
        
        nextDelta.length = Math.abs(r/Math.tan(radian));
        prevDelta.length = Math.abs(r/Math.tan(radian));
        
        var handle_l = Math.abs(r * Math.tan((Math.PI - 2*radian)/3.1));
        
    	path.add({
            point: curPoint - prevDelta,
            handleOut: prevDelta.normalize(handle_l)
    	});
    	path.add({
            point: curPoint - nextDelta,
            handleIn: nextDelta.normalize(handle_l)
    	});
    }
    path.closed = true;
    return path;
}



		

