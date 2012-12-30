/**
 * @fileoverview Alien class definition. Depends on Entity.js.
 * @author girarda.92@gmail.com (Alexandre Girard)
 */

/**
 * Alien class, representing an Alien within a game.
 * @param{GameEngine} gameEngine The game engine to which the entity belongs.
 * @param{number} posX The entity's x-axis.
 * @param{number} posY The entity's y-axis.
 * @constructor
 * @extends {Entity}
 */
function Alien(gameEngine, posX, posY) {
    Entity.call(this, gameEngine, posX, posY);
    /*
     * The alien's speed
     * @type {number}
     * @private
     */
    this.speed = 0.2; 
    /*
     * The alien's sprite.
     * @type {object}
     * @private
     */
    this.sprite = this.game.getAssetManager().getAsset('images/alien.png');
}

Alien.prototype = new Entity();
Alien.prototype.constructor = Alien;

/**
 * Update the alien's position and remove it from the world 
 *      if it is outside the screen.
 * @override
 */
Alien.prototype.update = function() {
    //this.x += this.speed * this.game.deltaTime;
    this.y += this.speed * this.game.deltaTime;
    if (this.y >= 900)
    {
        this.isRemovedFromWorld = true;
    }
}

/**
 * Draw the alien on the game board
 */
Alien.prototype.draw = function() {
    this.game.getBoard().getCtx().drawImage(this.sprite, this.x, this.y);
}
