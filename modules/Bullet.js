/**
 * @fileoverview Bullet class definition. Depends on Entity.js
 * @author girarda.92@gmail.com (Alexandre Girard)
 */

/**
 * Bullet class, representing a bullet within a game.
 * @param{GameEngine} game The game engine to which the entity belongs.
 * @constructor
 * @extends {Entity}
 */
function Bullet(game) {
    Entity.call(this, game, -50, -50);
    
    /**
     * The bullet's speed.
     * @type {number}
     * @private
     */
    this.speed = 0.5;
    /**
     * The bullet's sprite.
     * @type {object}
     * @private
     */
    this.sprite = this.game.getAssetManager().getAsset('images/bullet.png')
}

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

/**
 * Update the bullet's position and check if it is outside the screen
 *      and if it hit an enemy.
 */
Bullet.prototype.update = function() {
    if (this.isOutsideScreen()) {
        this.isRemovedFromWorld = true;
        this.x = -50;
        this.y = -50;
    } else {
        this.y -= this.speed * this.game.getDeltaTime();
        this.checkHitEnemy();
        Entity.prototype.update.call(this);
    }
}

/**
 * Draw the bullet on the gameBoard.
 */
Bullet.prototype.draw = function(ctx) {
    this.game.getBoard().getCtx().drawImage(this.sprite, this.x, this.y);
    //Entity.prototype.draw.call(this, ctx);
}

/**
 * Fire the bullet from an (x,y) position.
 * @param {number} startX The x-axis postion.
 * @param {number} startY the y-axis postion.
 */
Bullet.prototype.fire = function(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.isRemovedFromWorld = false;
}

/**
 * Check whether the bullet hit an enemy.
 * @return {boolean} True if it hit an enemy.
 */
Bullet.prototype.checkHitEnemy = function() {
    for (var i = 1; i < this.game.getEntities().length; i++) {
        if (this.x >= this.game.getEntities()[i].x &&
            this.x <= this.game.getEntities()[i].x + this.game.getEntities()[i].sprite.width &&
            this.y >= this.game.getEntities()[i].y &&
            this.y <= this.game.getEntities()[i].y + this.game.getEntities()[i].sprite.height) {
            this.isRemovedFromWorld = true;
            this.game.getEntities()[i].removeFromWorld();
            this.x = -50;
            this.game.incScore();
        }

    }
}

