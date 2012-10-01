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

Entity.prototype.isOutsideScreen = function() {
    return (this.x < 0 || this.x >  this.game.surfaceWidth ||
        this.y < 0 || this.y > this.game.surfaceHeight);
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
    if (this.y >= 900)
    {
        this.removeFromWorld = true;
    }
}

Alien.prototype.draw = function(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y);
}

function Spaceship(game) {
    Entity.call(this, game, 400, 500);
    this.sprite = ASSET_MANAGER.getAsset('images/spaceship.png');

    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpacebar = false;
    this.isShooting = false;

    this.speed = 2.5;

    this.bullets = [];
    this.currentBullet = 0;
    this.MAX_BULLETS = 50;
    for (var i = 0; i < this.MAX_BULLETS; i++) {
        this.bullets.push(new Bullet(this.game));
    }

}
Spaceship.prototype = new Entity();
Spaceship.prototype.constructor = Spaceship;

Spaceship.prototype.draw = function(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y);
    this.drawAllBullets(ctx);
}

Spaceship.prototype.update = function() {
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
    this.checkShooting();
    this.checkAlive();
};

Spaceship.prototype.drawAllBullets = function(ctx) {
    for (var i = 0; i < this.MAX_BULLETS; i++) {
        this.bullets[i].update();
        this.bullets[i].draw(ctx);
    }
}

Spaceship.prototype.checkShooting = function() {
    if (this.isSpacebar && !this.isShooting) {
        this.isShooting = true;
        this.bullets[this.currentBullet].fire(this.x + this.sprite.width/2 - 3, this.y);
        this.currentBullet++;
        
        if (this.currentBullet >= this.MAX_BULLETS) {
            this.currentBullet = 0;
        }
    } else if (!this.isSpacebar) {
        this.isShooting = false;
    }
}

Spaceship.prototype.checkAlive = function() {
    for (var i = 1; i < this.game.entities.length; i++) {
        if (this.game.entities[i].x >= this.x &&
            this.game.entities[i].x <= this.x + this.sprite.width &&
            this.game.entities[i].y >= this.y &&
            this.game.entities[i].y <= this.y + this.sprite.height ||
            this.game.entities[i].x + this.sprite.width >= this.x &&
            this.game.entities[i].x + this.sprite.width <= this.x + this.sprite.width &&
            this.game.entities[i].y >= this.y &&
            this.game.entities[i].y <= this.y + this.sprite.height ||
            this.game.entities[i].x >= this.x &&
            this.game.entities[i].x <= this.x + this.width &&
            this.game.entities[i].y + this.game.entities[i].sprite.height >= this.y &&
            this.game.entities[i].y + this.game.entities[i].sprite.height <= this.y + this.sprite.height ||
            this.game.entities[i].x + this.game.entities[i].sprite.width >= this.x &&
            this.game.entities[i].x + this.game.entities[i].sprite.width <= this.x + this.sprite.width &&
            this.game.entities[i].y + this.game.entities[i].sprite.height >= this.y &&
            this.game.entities[i].y + this.game.entities[i].sprite.height <= this.y + this.sprite.height) {
            this.game.entities[i].removeFromWorld = true;
            this.game.lives-- ;
        }

    }
}

function Bullet(game) {
    Entity.call(this, game, 50, 50);
    this.game = game;
    this.x = 50;
    this.y = 50;
    this.speed = 0.5;
    this.sprite = ASSET_MANAGER.getAsset('images/bullet.png');
}
Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
    if (this.isOutsideScreen()) {
        this.removeFromWorld = true;
    } else {
        this.y -= this.speed * this.game.deltaTime;
        this.checkHitEnemy();
        Entity.prototype.update.call(this);
    }
}

Bullet.prototype.draw = function(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y);
    //Entity.prototype.draw.call(this, ctx);
}

Bullet.prototype.fire = function(startX, startY) {
    this.x = startX;
    this.y = startY;
    removeFromWorld = false;
}

Bullet.prototype.checkHitEnemy = function() {
    for (var i = 1; i < this.game.entities.length; i++) {
        if (this.x >= this.game.entities[i].x &&
            this.x <= this.game.entities[i].x + this.game.entities[i].sprite.width &&
            this.y >= this.game.entities[i].y &&
            this.y <= this.game.entities[i].y + this.game.entities[i].sprite.height) {
            this.removeFromWorld = true;
            this.game.entities[i].removeFromWorld = true;
            this.x = -50;
            this.game.score +=10;
        }

    }
}

function EvilAliens() {
    GameEngine.call(this);
    this.score = 0;
    this.lives = 5;
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
    GameEngine.prototype.draw.call(this, function(game) {
        game.drawScore();
        game.drawLives();
    });
}

EvilAliens.prototype.drawScore = function() {
    this.ctx.fillStyle = "red";
    this.ctx.font = "bold 2em Arial";
    this.ctx.fillText("Score " + this.score, 10, 550);
}

EvilAliens.prototype.drawLives = function() {
    this.ctx.fillStyle = "red";
    this.ctx.font = "bold 2em Arial";
    this.ctx.fillText("Lives: " + this.lives, 10, 575);
}

var canvas = document.getElementById('surface');
var ctx = canvas.getContext('2d');
var game = new EvilAliens();
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload('images/alien.png');
ASSET_MANAGER.queueDownload('images/spaceship.png');
ASSET_MANAGER.queueDownload('images/bullet.png');

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
