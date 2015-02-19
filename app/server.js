var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(5000);

app.use(express.static(__dirname + '/../public/'));

io.on('connection', function (socket) {
  socket.on('canvas_x_y', function (data) {
    socket.to('others').emit('canvas_x_y', data);
  });
});