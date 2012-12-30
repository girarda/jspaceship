function JSpaceship(assetManager) {
    GameEngine.call(this, assetManager);

    this.lastAlienAddedAt = null;
}
JSpaceship.prototype = new GameEngine();
JSpaceship.prototype.constructor = JSpaceship;

JSpaceship.prototype.start = function() {
    this.ss = new Spaceship(this);
    this.addEntity(this.ss);
    GameEngine.prototype.start.call(this);
}

JSpaceship.prototype.update = function() {
    if (this.lastAlienAddedAt == null || (this.lastUpdateTimestamp - this.lastAlienAddedAt) > 1000) {
        this.addEntity(new Alien(this, Math.random() * 600 + 100, -1000));
        this.lastAlienAddedAt = this.lastUpdateTimestamp;
    }
    
    GameEngine.prototype.update.call(this);
}

JSpaceship.prototype.draw = function() {
    GameEngine.prototype.draw.call(this, function(game) {
        game.drawScore();
        game.drawLives();
    });
}

JSpaceship.prototype.drawScore = function() {
    this.board.getCtx().fillStyle = "red";
    this.board.getCtx().font = "bold 2em Arial";
    this.board.getCtx().fillText("Score " + this.score, 10, 550);
}

JSpaceship.prototype.drawLives = function() {
    this.board.getCtx().fillStyle = "red";
    this.board.getCtx().font = "bold 2em Arial";
    this.board.getCtx().fillText("Lives: " + this.lives, 10, 575);
}
