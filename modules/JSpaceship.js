/**
 * @fileoverview JSpaceship class definition.
 * @author girarda.92@gmail.com (Alexandre Girard)
 */

/**
 * JSpaceship class representing a JSPaceship game engine.
 * @param {AssetManager} The asset manager used to retrieve the game's assets.
 * @constructor
 */
function JSpaceship(assetManager) {
    GameEngine.call(this, assetManager);

    /**
     * The time the last alien was added.
     * @type {number}
     * @private
     */
    this.lastAlienAddedAt = null;
}
JSpaceship.prototype = new GameEngine();
JSpaceship.prototype.constructor = JSpaceship;

/**
 * Start the game.
 */
JSpaceship.prototype.start = function() {
    this.ss = new Spaceship(this);
    this.addEntity(this.ss);
    GameEngine.prototype.start.call(this);
}

/**
 * Update the game's internal state and periodically add a new alien in the game.
 */
JSpaceship.prototype.update = function() {
    if (this.lastAlienAddedAt == null || (this.lastUpdateTimestamp - this.lastAlienAddedAt) > 1000) {
        this.addEntity(new Alien(this, Math.random() * 600 + 100, -1000));
        this.lastAlienAddedAt = this.lastUpdateTimestamp;
    }
    
    GameEngine.prototype.update.call(this);
}

/**
 * Draw the game and its components on the board.
 */
JSpaceship.prototype.draw = function() {
    GameEngine.prototype.draw.call(this, function(game) {
        game.drawScore();
        game.drawLives();
    });
}

/**
 * Draw the current score on the board.
 */
JSpaceship.prototype.drawScore = function() {
    this.board.getCtx().fillStyle = "red";
    this.board.getCtx().font = "bold 2em Arial";
    this.board.getCtx().fillText("Score " + this.score, 10, 550);
}

/**
 * Draw the remaining lives on the board.
 */
JSpaceship.prototype.drawLives = function() {
    this.board.getCtx().fillStyle = "red";
    this.board.getCtx().font = "bold 2em Arial";
    this.board.getCtx().fillText("Lives: " + this.lives, 10, 575);
}
