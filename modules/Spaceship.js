/**
 * @fileoverview Spaceship class definition. Depends on Entity.js.
 * @author girarda.92@gmail.com (Alexandre Girard)
 */

/**
 * Spaceship class, representing a spaceship within a game.
 * @param{GameEngine} game The game engine to which the entity belongs.
 * @constructor
 * @extends {Entity}
 */
function Spaceship(game) {
    //TODO change 400,500 too x,y
    Entity.call(this, game, 400, 500);

    /**
     * The spaceship's sprite.
     * @type {object}
     * @private
     */
    this.sprite = this.game.getAssetManager().getAsset('images/spaceship.png');

    /**
     * Indicates whether the right key is pressed.
     * @type {boolean}
     * @private
     */
    this.isRightKey = false;

    /**
     * Indicates whether the down key is pressed.
     * @type {boolean}
     * @private
     */
    this.isDownKey = false;

    /**
     * Indicates whether the left key is pressed.
     * @type {boolean}
     * @private
     */
    this.isLeftKey = false;

    /**
     * Indicates whether the spacebar key is pressed.
     * @type {boolean}
     * @private
     */
    this.isSpacebar = false;

    /**
     * Indicates whether the spaceship is shooting.
     * @type {boolean}
     * @private
     */
    this.isShooting = false;

    /**
     * The spaceship's speed.
     * @type {boolean}
     * @private
     */
    this.speed = 2.5;

    /**
     * The spaceship's bullets.
     * @type {Array.<Bullet>}
     * @private
     */
    this.bullets = [];

    /**
     * The next bullet to be fired by the spaceship.
     * @type {number}
     * @private
     */
    this.currentBullet = 0;

    /**
     * The maximum number of bullets the spaceship can have.
     * @const
     * @type {number}
     * @private
     */
    this.MAX_BULLETS = 50;
    
    // Full the bullets
    for (var i = 0; i < this.MAX_BULLETS; i++) {
        this.bullets.push(new Bullet(game));
    }
}

Spaceship.prototype = new Entity();
Spaceship.prototype.constructor = Spaceship;

/**
 * Draw the spaceship and its bullets on the game board.
 */
Spaceship.prototype.draw = function() {
    this.game.getBoard().getCtx().drawImage(this.sprite, this.x, this.y);
    this.drawAllBullets();
}

/**
 * Update the spaceship's position, check if it is alive and shooting.
 */
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

    if (this.x <= 2) {
        this.x = 2;
    }
    if (this.x + this.sprite.width >= this.game.getBoard().getWidth() -2)
    {
        this.x = this.game.getBoard().getWidth() - this.sprite.width - 2;
    }
    if (this.y <= 2) {
        this.y = 2;
    }
    if (this.y + this.sprite.height >= this.game.getBoard().getHeight()) {
        y = this.game.getBoard().getHeight() - this.sprite.height;
    }

    this.checkShooting();
    this.checkAlive();
};

/**
 * Draw all the spaceship's bullets.
 * @private
 */
Spaceship.prototype.drawAllBullets = function() {
    for (var i = 0; i < this.MAX_BULLETS; i++) {
        this.bullets[i].update();
        this.bullets[i].draw();
    }
}

/**
 * Check if the spaceship is currently shooting.
 * @private
 * @return {boolean} True if the spaceship is shooting.
 */
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

/**
 * Check if the spaceship is alive.
 * @private
 * @return {boolean} True if the spaceship is alive.
 */
Spaceship.prototype.checkAlive = function() {
    for (var i = 1; i < game.getEntities().length; i++) {
        if (this.game.getEntities()[i].getX() >= this.x &&
            this.game.getEntities()[i].getX() <= this.x + this.sprite.width &&
            this.game.getEntities()[i].getY() >= this.y &&
            this.game.getEntities()[i].getY() <= this.y + this.sprite.height ||
            this.game.getEntities()[i].getX() + this.sprite.width >= this.x &&
            this.game.getEntities()[i].getX() + this.sprite.width <= this.x + this.sprite.width &&
            this.game.getEntities()[i].getY() >= this.y &&
            this.game.getEntities()[i].getY() <= this.y + this.sprite.height ||
            this.game.getEntities()[i].getX() >= this.x &&
            this.game.getEntities()[i].getX() <= this.x + this.width &&
            this.game.getEntities()[i].getY() + this.game.getEntities()[i].sprite.height >= this.y &&
            this.game.getEntities()[i].getY() + this.game.getEntities()[i].sprite.height <= this.y + this.sprite.height ||
            this.game.getEntities()[i].getX() + this.game.getEntities()[i].sprite.width >= this.x &&
            this.game.getEntities()[i].getX() + this.game.getEntities()[i].sprite.width <= this.x + this.sprite.width &&
            this.game.getEntities()[i].getY() + this.game.getEntities()[i].sprite.height >= this.y &&
            this.game.getEntities()[i].getY() + this.game.getEntities()[i].sprite.height <= this.y + this.sprite.height) {
            this.game.getEntities()[i].removeFromWorld();
            this.game.loseLife();
        }

    }
}
