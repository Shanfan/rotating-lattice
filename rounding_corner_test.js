var size = 100,
    radius = size /2;

var path = new Path.RegularPolygon(view.center, 3, size);
path.fillColor =  '#222';
path.rotate(180);
path.selected = true;

roundPath(path, radius);

console.log(radius);

//Add a rounded corner to the triangles
function roundPath(path,radius) {
	var segments = path.segments.slice(0);
	path.segments = [];
	for(var i = 0, l = segments.length; i < l; i++) {
		var curPoint = segments[i].point;
		var nextPoint = segments[i + 1 == l ? 0 : i + 1].point;
		var prevPoint = segments[i - 1 < 0 ? segments.length - 1 : i - 1].point;
		var nextDelta = curPoint - nextPoint;
		var prevDelta = curPoint - prevPoint;
		nextDelta.length = radius;
		prevDelta.length = radius;
		path.add({
            point:curPoint - prevDelta,
            handleOut: prevDelta/2
		});
		path.add({
            point:curPoint - nextDelta,
            handleIn: nextDelta/2
		});
	}
	path.closed = true;
	return path;
}