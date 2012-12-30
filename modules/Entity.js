function Entity(gameEngine, posX, posY) {
    this.game = gameEngine;
    this.x = posX
    this.y = posY;
    this.isRemovedFromWorld = false;
}

Entity.prototype.update = function() {
}

Entity.prototype.isOutsideScreen = function() {
    return (this.x < 0 || this.x >  this.game.getBoard().getWidth() ||
            this.y < 0 || this.y > this.game.getBoard().getHeight());
}

Entity.prototype.getX = function() {
    return this.x;
}

Entity.prototype.getY = function() {
    return this.y;
}

Entity.prototype.removeFromWorld = function() {
    this.isRemovedFromWorld = true;
}
