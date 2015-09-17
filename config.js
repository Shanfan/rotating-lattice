// --- Initiate Drawing --- //
paper.install(window);
window.onload = function(){
	paper.setup('lattice');
	createTriangle(12, ["#fff"]);

    //---- Pick a random background image ----//
    document.querySelector('.content').style.backgroundImage = imgs[Math.floor(Math.random()*imgs.length)];

    //---- Event Listeners ----//
    document.config.geom[0].addEventListener('change', configure, false);
    document.config.geom[1].addEventListener('change', configure, false);
    
    document.config.level.addEventListener('change', configure, false);
    
    document.config.level.addEventListener('input', function(){
        document.querySelector('output#for_level').innerHTML = document.querySelector('input#level').value;
    }, false);

    //TODO: document.config.speed.addEventListener('change', configure, false);

    document.config.speed.addEventListener('input', function(){
        document.querySelector('output#for_speed').innerHTML = document.querySelector('input#speed').value;
    }, false);

    var selected_palette = document.config.palette;
    for (var i = 0; i < selected_palette.length; i++) {
        selected_palette[i].addEventListener('change', configure, false);
    }

    var swatch_list = document.getElementsByClassName('swatches');
    for (var i = 0; i < swatch_list.length; i++) {
        swatch_list[i].innerHTML = outputSwatches(swatch_list[i].outerHTML);
    }
};

function outputSwatches(swa_str){
    var list_item = '\n',
        swatch_name = swa_str.slice(swa_str.indexOf('ches ') + 5, swa_str.indexOf('"></ul>'));
        
    swatches[swatch_name].forEach(function(co){
        list_item = list_item + '<li style="background:' + co + ';"></li>' + '\n'
    });

    return list_item;
}

function configure(){
	var shape = getShape(),
		level = getLevel(),
		palette = getPalette();
	
	if (shape == "triangle") {
		createTriangle(level, palette);
	}else {
		createSquare(level, palette);
	}
}


function getShape(){
    var val, selected_shape = document.getElementsByName('geom');

    for (var i=0; i<selected_shape.length; i++){
        if (selected_shape[i].checked) {
            val = selected_shape[i].value;
            break;
        }
    }
    return val;
}

function getLevel(){
    return document.getElementById('level').value;
}

function getPalette(){
    var val, selected_palette = document.getElementsByName('palette');

    for (var i=0; i<selected_palette.length; i++) {
        if (selected_palette[i].checked) {
            val = selected_palette[i].value;
            if (val == 'monotone') {
                document.querySelector('.content canvas').style.backgroundColor = "rgba(0,0,0, .1)";
            }else{
                document.querySelector('.content canvas').style.backgroundColor = "#212121";
            }
            break;
        }
    }
    return swatches[val];
}

// --- Images --- //
var imgs = [
    'url(/img/IMG_1503.JPG)',
    'url(/img/IMG_1504.JPG)',
    'url(/img/IMG_1515.JPG)',
    'url(/img/IMG_1601.JPG)',
    'url(/img/IMG_1602.JPG)'
];

// --- Define the paletes --- //
var swatches = {
    monotone: ['#fff'],
    duo: ['#e8466c', '#fb8db4'],
    trio: ['#ecf8f4', '#dcdfcf', '#b3c0d2'],
    green_gradient: [
        'rgb(255,255,229)',
        'rgb(247,252,185)',
        'rgb(217,240,163)',
        'rgb(173,221,142)',
        'rgb(120,198,121)',
        'rgb(65,171,93)',
        'rgb(35,132,67)',
        'rgb(0,104,55)',
        'rgb(0,69,41)'
    ],  
    spring_lilac: [
        'rgb(47, 62, 29)',
        'rgb(58, 86, 37)',
        'rgb(64, 95, 36)',
        'rgb(107, 134, 79)',
        'rgb(166, 186, 157)',
        'rgb(148, 173, 144)',
        'rgb(135, 157, 144)',
        'rgb(198, 160, 186)',
        'rgb(231, 95, 187)',
        'rgb(228, 128, 190)',
        'rgb(240, 171, 204)'
    ],
    birth_universe: [
        'rgb(5, 7, 2)',
        'rgb(42, 20, 58)',
        'rgb(64, 47, 84)',
        'rgb(107, 72, 101)',
        'rgb(178, 115, 172)',
        'rgb(206, 182, 198)',
        'rgb(226, 228, 215)',
        'rgb(245, 184, 105)',
        'rgb(222, 215, 207)',
        'rgb(196, 164, 188)',
        'rgb(173, 112, 171)',
        'rgb(107, 72, 120)',
        'rgb(56, 43, 77)',
        'rgb(27, 25, 46)'
    ],
    makeup_artist: [
        'rgb(200, 70, 64)',
        'rgb(191, 56, 78)',
        'rgb(182, 56, 86)',
        'rgb(172, 46, 73)',
        'rgb(151, 50, 70)',
        'rgb(143, 41, 114)',
        'rgb(186, 84, 147)',
        'rgb(191, 102, 132)',
        'rgb(241, 118, 209)',
        'rgb(110, 57, 103)',
        'rgb(58, 30, 53)',
        'rgb(22, 20, 41)',
        'rgb(144, 103, 77)',
        'rgb(199, 137, 107)',
        'rgb(234, 136, 27)',
        'rgb(230, 177, 107)',
        'rgb(230, 213, 64)'
    ],
    earth: [
        'rgb(76, 43, 24)',
        'rgb(156, 62, 62)',
        'rgb(165, 69, 53)',
        'rgb(194, 92, 69)',
        'rgb(118, 83, 43)',
        'rgb(83, 76, 47)',
        'rgb(72, 68, 41)',
        'rgb(198, 158, 107)',
        'rgb(235, 182, 144)',
        'rgb(237, 248, 244)',
        'rgb(220, 224, 207)',
        'rgb(179, 192, 211)',
        'rgb(208, 194, 193)',
        'rgb(143, 114, 111)',
        'rgb(105, 51, 64)',
        'rgb(87, 37, 46)',
        'rgb(98, 41, 34)'
    ]
};

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
