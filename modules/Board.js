function Board(canvas_ctx) {
    this.ctx = canvas_ctx;
}

Board.prototype.getWidth = function() {
    return this.ctx.canvas.width;
}

Board.prototype.getHeight = function() {
    return this.ctx.canvas.height;
}

Board.prototype.getCanvas = function() {
    return this.ctx.canvas;
}

Board.prototype.clearRect = function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
}

Board.prototype.restore = function() {
    //TODO to verify
    this.ctx.restore();
}

Board.prototype.save = function() {
    //TODO to verify
    this.ctx.save();
}

Board.prototype.getCtx = function() {
    return this.ctx;
}
