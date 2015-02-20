(function(io, SharedCanvas){
  "use strict";

  var color = function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }();

  function ClientView(id) {
    this.list = document.getElementById(id);
  }
  ClientView.prototype.join = function(ip, color) {
    var item = document.createElement('li');
    item.id = color;
    item.style.color = color;
    item.innerHTML = ip;
    this.list.appendChild(item);
  };
  ClientView.prototype.leave = function(ip, color) {
    var item = document.getElementById(color);
    item.parentNode.removeChild(item);
  };

  var sharedCanvas = new SharedCanvas('canvas', color);
  var clients = new ClientView('client_list');
  var ws = io.connect('//' + document.domain + ':' + location.port);

  ws.on('connect', function() {
    ws.emit('join', { color: color });
  });

  sharedCanvas.listenTouch(function(x, y, color) {
    ws.emit('canvas_x_y', {x: x, y: y, color: color});
  });

  ws.on('canvas_x_y', function(data) {
    sharedCanvas.touch(data.x, data.y, data.color);
  });

  ws.on('join', function(data) {
    clients.join(data.ip, data.color);
  });

  ws.on('leave', function(data) {
    clients.leave(data.ip, data.color);
  });

})(io, SharedCanvas);


