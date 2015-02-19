function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var sharedCanvas = new SharedCanvas('canvas', getRandomColor());
var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connection', function(socket){

    sharedCanvas.listenTouch(function(x, y, color) {
        socket.emit('canvas_x_y', { x: x, y: y, color: color });
    });

    socket.on('canvas_x_y', function (data) {
        sharedCanvas.touch(data.x, data.y, data.color);
    });

});



