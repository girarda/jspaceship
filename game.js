window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
})();

function AssetManager() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = {};
    this.downloadQueue = [];
}

AssetManager.prototype.queueDownload = function(path) {
    this.downloadQueue.push(path);
}

AssetManager.prototype.downloadAll = function(callback) {
    if (this.downloadQueue.length === 0 && this.soundsQueue.length === 0) {
        callback();
    }
    
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var path = this.downloadQueue[i];
        var img = new Image();
        var that = this;
        img.addEventListener("load", function() {
            console.log(this.src + ' is loaded');
            that.successCount += 1;
            if (that.isDone()) {
                callback();
            }
        }, false);
        img.addEventListener("error", function() {
            that.errorCount += 1;
            if (that.isDone()) {
                callback();
            }
        }, false);
        img.src = path;
        this.cache[path] = img;
    }
}

AssetManager.prototype.getAsset = function(path) {
    return this.cache[path];
}

AssetManager.prototype.isDone = function() {
    return (this.downloadQueue.length == this.successCount + this.errorCount);
}

function GameEngine() {
    this.entities = [];
    this.ctx = null;
    
    this.lastUpdateTimestamp = null;
    this.deltaTime = null;
    
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.halfSurfaceWidth = null;
    this.halfSurfaceHeight = null;
}

GameEngine.prototype.init = function(ctx) {
    console.log('game initialized');
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.halfSurfaceWidth = this.surfaceWidth/2;
    this.halfSurfaceHeight = this.surfaceHeight/2;
}

GameEngine.prototype.start = function() {
    console.log("starting game");
    this.lastUpdateTimestamp = Date.now();
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.addEntity = function(entity) {
    this.entities.push(entity);
}

GameEngine.prototype.draw = function(callback) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    if (callback) {
        callback(this);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function() {
    var entitiesCount = this.entities.length;
    
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }
    
    for (var i = this.entities.length-1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
}

GameEngine.prototype.loop = function() {
    var now = Date.now();
    this.deltaTime = now - this.lastUpdateTimestamp;
    this.update();
    this.draw();
    this.lastUpdateTimestamp = now;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function() {
}

Entity.prototype.draw = function(ctx) {
    if (this.game.showOutlines && this.radius) {
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.stroke();
        ctx.closePath();
    }
}

Entity.prototype.outsideScreen = function() {
    return (this.x > this.game.halfSurfaceWidth || this.x < -(this.game.halfSurfaceWidth) ||
        this.y > this.game.halfSurfaceHeight || this.y < -(this.game.halfSurfaceHeight));
}

function Alien(game, x, y) {
    Entity.call(this, game);
    this.x = x;
    this.y = y;
    this.speed = 0.2;
    this.sprite = ASSET_MANAGER.getAsset('images/alien.png');
}
Alien.prototype = new Entity();
Alien.prototype.constructor = Alien;

Alien.prototype.update = function() {
    //this.x += this.speed * this.game.deltaTime;
    this.y += this.speed * this.game.deltaTime;
    Entity.prototype.update.call(this);
}

Alien.prototype.draw = function(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y);
    Entity.prototype.draw.call(this, ctx);
}

function Spaceship(game) {
    Entity.call(this, game, 0, 0);
    this.sprite = ASSET_MANAGER.getAsset('images/spaceship.png');

    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpacebar = false;
    this.isShooting = false;

    this.speed = 2.5;

}
Spaceship.prototype = new Entity();
Spaceship.prototype.constructor = Spaceship;

Spaceship.prototype.draw = function(ctx) {
    this.checkDirection();
    ctx.drawImage(this.sprite, this.x - this.sprite.width/2, this.y - this.sprite.height/2);
}

Spaceship.prototype.checkDirection = function() {
    if (this.isUpKey) {
        this.y -= this.speed;
    }
    if (this.isRightKey) {
        this.x += this.speed;
    }
    if (this.isDownKey) {
        this.y += this.speed;
    }
    if (this.isLeftKey) {
        this.x -= this.speed;
    }
};

function EvilAliens() {
    GameEngine.call(this);
}
EvilAliens.prototype = new GameEngine();
EvilAliens.prototype.constructor = EvilAliens;

EvilAliens.prototype.start = function() {
    this.ss = new Spaceship(this);
    this.addEntity(this.ss);
    GameEngine.prototype.start.call(this);
}

EvilAliens.prototype.update = function() {
    if (this.lastAlienAddedAt == null || (this.lastUpdateTimestamp - this.lastAlienAddedAt) > 1000) {
        this.addEntity(new Alien(this, Math.random() * 600 + 100, -1000));
        this.lastAlienAddedAt = this.lastUpdateTimestamp;
    }
    
    GameEngine.prototype.update.call(this);
}

EvilAliens.prototype.draw = function() {
    GameEngine.prototype.draw.call(this);
}

var canvas = document.getElementById('surface');
var ctx = canvas.getContext('2d');
var game = new EvilAliens();
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload('images/alien.png');
ASSET_MANAGER.queueDownload('images/spaceship.png');

ASSET_MANAGER.downloadAll(function() {
    document.addEventListener('keydown', checkKeyDown, false);
    document.addEventListener('keyup', checkKeyUp, false);
    game.init(ctx);
    game.start();
});

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        game.ss.isUpKey = true;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        game.ss.isRightKey = true;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        game.ss.isDownKey = true;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        game.ss.isLeftKey = true;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        game.ss.isSpacebar = true;
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        game.ss.isUpKey = false;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        game.ss.isRightKey = false;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        game.ss.isDownKey = false;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        game.ss.isLeftKey = false;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        game.ss.isSpacebar = false;
        e.preventDefault();
    }
}
