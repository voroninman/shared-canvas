var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var extend = require('util')._extend;
var clients;

server.listen(5000);

app.use(express.static(__dirname + '/../public/'));

app.get('/reset', function(req, res) {
  clients.clear();
  res.end();
});

clients = {
  _list: {},
  add: function(client) {
    this._list[client.color] = client;
  },
  remove: function(client) {
    delete this._list[client.color];
  },
  all: function() {
    return this._list;
  },
  clear: function() {
    this._list = {}
  }
};


io.on('connection', function (socket) {

  var client;

  Object.keys(clients.all()).forEach(function(key) {
    socket.emit('join', clients.all()[key]);
  });

  socket.on('join', function (data) {
    client = { color: data.color, ip: socket.handshake.address };
    clients.add(client);
    io.emit('join', client);
  });

  socket.on('canvas_x_y', function (data) {
    socket.broadcast.emit('canvas_x_y', data);
  });

  socket.on('disconnect', function() {
    socket.broadcast.emit('leave', client);
    clients.remove(client);
  });

});
