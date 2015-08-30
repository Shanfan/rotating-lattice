//-------------- Helper Functions ------------------//







// ----------- Round Path Corners ------------- //
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