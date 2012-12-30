function GameEngine(assetManager) {
    this.entities = [],
    this.board = null;
    this.assetManager = assetManager;

    this.lastUpdateTimestamp = null;
    this.deltaTime = null;

    this.lives = null;
    this.score = null;
    this.user = null;
}

GameEngine.prototype.init = function(gameBoard, nbLives) {
    console.log('game initialized');

    this.board = gameBoard;
    this.lives = nbLives;
    this.score = 0;
}

GameEngine.prototype.start = function() {
    console.log('starting game');
    this.lastUpdateTimestamp = Date.now();
    var that = this;
    (function gameLoop() {
            that.loop();
            this.request = requestAnimFrame(gameLoop, this.board.getCanvas());
    })();
}

GameEngine.prototype.end = function() {
    this.stopLoop();
    this.askUser();
}

GameEngine.prototype.stopLoop = function() {
    setTimeout(function() {
        cancelRequestAnimFrame(this.request);
        init();
    }, 5);
}

GameEngine.prototype.askUser = function() {
    var confirmString = 'Congratulation, you got a score of ' + this.score + ' what is your name?';
    this.user = prompt(confirmString);
}

GameEngine.prototype.addEntity = function(entity) {
    this.entities.push(entity);
}

GameEngine.prototype.draw = function(callback) {
    this.board.clearRect();
    this.board.save();

    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.board.getCtx());
    }
    if (callback) {
        callback(this);
    }
     this.board.restore();
}

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

GameEngine.prototype.loop = function() {
    var now = Date.now();
    this.deltaTime = now - this.lastUpdateTimestamp;
    this.update();
    this.draw();
    this.lastUpdateTimestamp = now
}

GameEngine.prototype.loseLife = function() {
    this.lives--;
}

GameEngine.prototype.incScore = function() {
    this.score++;
}

GameEngine.prototype.getAssetManager = function() {
    return this.assetManager;
}

GameEngine.prototype.getBoard = function() {
    return this.board;
}

GameEngine.prototype.getDeltaTime = function() {
    return this.deltaTime;
}

GameEngine.prototype.getLastUpdateTimestamp = function() {
    return this.lastUpdateTimestamp;
}

GameEngine.prototype.getEntities = function() {
    return this.entities;
}

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

window.cancelRequestAnimFrame = ( function() {
    return  window.cancelAnimationFrame                 ||
            window.webkitCancelRequestAnimationFrame    ||
            window.mozCancelRequestAnimationFrame       ||
            window.oCancelRequestAnimationFrame         ||
            window.msCancelRequestAnimationFrame        ||
            clearTimeout;
} )();
