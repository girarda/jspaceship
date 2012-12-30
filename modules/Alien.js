function Alien(gameEngine, posX, posY) {
    Entity.call(this, gameEngine, posX, posY);
    this.speed = 0.2; 
    this.sprite = this.game.getAssetManager().getAsset('images/alien.png');
}

Alien.prototype = new Entity();
Alien.prototype.constructor = Alien;

Alien.prototype.update = function() {
    //this.x += this.speed * this.game.deltaTime;
    this.y += this.speed * this.game.deltaTime;
    if (this.y >= 900)
    {
        this.isRemovedFromWorld = true;
    }
}

Alien.prototype.draw = function(ctx) {
    game.getBoard().getCtx().drawImage(this.sprite, this.x, this.y);
}
