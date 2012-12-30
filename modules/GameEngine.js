/**
 * @fileoverview GameEngine class definition.
 * @author girarda.92@gmail.com (Alexandre Girard)
 */

/**
 * GameEngine class representing a game engine.
 * @param {AssetManager} The asset manager used to retrieve the game's assets.
 * @constructor
 */
function GameEngine(assetManager) {
    /**
     * The game's entities.
     * @type {Array.<Entity>}
     * @private
     */
    this.entities = [],

    /**
     * The game's board.
     * @type {Board}
     * @private
     */
    this.board = null;

    /**
     * The asset manager used to retrieve the game's assets.
     * @type {AssetManager}
     * @private
     */
    this.assetManager = assetManager;

    /**
     * The time of the last update.
     * @type {number}
     * @private
     */
    this.lastUpdateTimestamp = null;

    /**
     * The time difference between the two last updates.
     * @type {number
     * @private
     */
    this.deltaTime = null;

    /**
     * The remaining player's lives.
     * @type {number}
     * @private
     */
    this.lives = null;

    /**
     * The player's score.
     * @type {number}
     * @private
     */
    this.score = null;

    /**
     * The player's username
     * @type {string}
     * @private
     */
    this.user = null;
}

/**
 * Initializes the game's internal state.
 * @param {GameBoard} gameBoard The game's board.
 * @param {number} nbLives The initial number of lives.
 */
GameEngine.prototype.init = function(gameBoard, nbLives) {
    console.log('game initialized');

    this.board = gameBoard;
    this.lives = nbLives;
    this.score = 0;
}

/**
 * Start the game.
 */
GameEngine.prototype.start = function() {
    console.log('starting game');
    this.lastUpdateTimestamp = Date.now();
    var that = this;
    (function gameLoop() {
            that.loop();
            this.request = requestAnimFrame(gameLoop, this.board.getCanvas());
    })();
}

/**
 * End the game.
 */
GameEngine.prototype.end = function() {
    this.stopLoop();
    this.askUser();
}

/**
 * Stop the game's loop
 */
GameEngine.prototype.stopLoop = function() {
    setTimeout(function() {
        cancelRequestAnimFrame(this.request);
        init();
    }, 5);
}

/**
 * Ask the player's name.
 * TODO
 */
GameEngine.prototype.askUser = function() {
    var confirmString = 'Congratulation, you got a score of ' + this.score + ' what is your name?';
    this.user = prompt(confirmString);
}

/**
 * Add an new entity to the game.
 * @param {Entity} entity The new entity to add.
 */
GameEngine.prototype.addEntity = function(entity) {
    this.entities.push(entity);
}

/**
 * Draw the game and its components on the board.
 */
GameEngine.prototype.draw = function(callback) {
    this.board.clear();
    this.board.save();

    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw();
    }
    if (callback) {
        callback(this);
    }
     this.board.restore();
}

/**
 * Update the game's entities internal states.
 */
GameEngine.prototype.update = function() {
    if (this.lives <= 0) {
        this.end();
    }

    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        if (!entity.isRemovedFromWorld) {
            entity.update();
        }
    }
    for (var i = this.entities.length-1; i >= 0; --i) {
        if (this.entities[i].isRemovedFromWorld) {
            this.entities.splice(i, 1);
        }
    }
}

/**
 * Update the timestamps used to move entities.
 */
GameEngine.prototype.loop = function() {
    var now = Date.now();
    this.deltaTime = now - this.lastUpdateTimestamp;
    this.update();
    this.draw();
    this.lastUpdateTimestamp = now
}

/**
 * Decrement the player's lives.
 */
GameEngine.prototype.loseLife = function() {
    this.lives--;
}

/**
 * Increment the player's score.
 */
GameEngine.prototype.incScore = function() {
    this.score++;
}

/**
 * Get the asset manager used to retrieve the game's sprites.
 * @return {AssetManager} The asset manager used by the game.
 */
GameEngine.prototype.getAssetManager = function() {
    return this.assetManager;
}

/**
 * Get the game board.
 * @return {Board} The game's board.
 */
GameEngine.prototype.getBoard = function() {
    return this.board;
}

/**
 * Get the time difference between the two last timestamp.
 * @return {number} The time difference between the two last timestamp.
 */
GameEngine.prototype.getDeltaTime = function() {
    return this.deltaTime;
}

/**
 * Get the time of the last timestamp.
 * @return {number} The time of the last timestamp.
 */
GameEngine.prototype.getLastUpdateTimestamp = function() {
    return this.lastUpdateTimestamp;
}

/**
 * Get the game's array of entities.
 * @return {Array.<Entities>} The game's entities.
 */
GameEngine.prototype.getEntities = function() {
    return this.entities;
}

/**
 * Request the scheduled repaint of the window for the next animation frame.
 */
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function(/* function */ callback, /* DOMElement */ element){
             return window.setTimeout(callback, 1000 / 60);
           };
})();

/**
 * Cancel the scheduled repaint of the windoe.
 */
window.cancelRequestAnimFrame = ( function() {
    return  window.cancelAnimationFrame                 ||
            window.webkitCancelRequestAnimationFrame    ||
            window.mozCancelRequestAnimationFrame       ||
            window.oCancelRequestAnimationFrame         ||
            window.msCancelRequestAnimationFrame        ||
            clearTimeout;
} )();
