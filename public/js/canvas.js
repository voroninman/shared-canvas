(function(){

    function SharedCanvas(id, drawColor) {
        this.node = document.getElementById(id);
        this.ctx = this.node.getContext('2d');
        this.drawColor = drawColor;
        this.radius = 10;
        this.isDrawing = false;
        this._touchListeners = [];
        this._bind();
    }

    SharedCanvas.prototype = {
        _bind: function() {
            var self = this;
            self.node.onmousemove = function(e) {
                if (!self.isDrawing) {
                   return;
                }
                var x = e.pageX - self.node.offsetLeft;
                var y = e.pageY - self.node.offsetTop;
                self.touch(x, y, self.drawColor);
            };
            self.node.onmousedown = function() {
                self.isDrawing = true;
            };
            self.node.onmouseup = function() {
                self.isDrawing = false;
            };
        },
        touch: function(x, y, color) {
            this.ctx.fillStyle = this.drawColor;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.arc(x, y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fill();
            this._touchListeners.forEach(function(cb) {
                cb(x, y, color);
            });
        },
        listenTouch: function(cb) {
            this._touchListeners.push(cb);
        }
    };

    window.SharedCanvas = SharedCanvas;
})();