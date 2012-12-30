/**
 * @fileoverview Entity class definition.
 * @author girarda.92@gmail.com (Alexandre Girard)
 */

/**
 * Entity class, representign any entity within a game.
 * @param{GameEngine} gameEngine The game engine to which the entity belongs.
 * @param{number} posX The entity's x-axis.
 * @param{number} posY The entity's y-axis.
 * @constructor
 */
function Entity(gameEngine, posX, posY) {
    /**
     * The game engine
     * @type {GameEngine}
     * @private
     */
    this.game = gameEngine;
    /**
     * The x-axis.
     * @type {number}
     * @private
     */
    this.x = posX
    /**
     * The y-axis.
     * @type {number}
     * @private
     */
    this.y = posY;
    /**
     * Indicate whether the entity is removed from the world or not.
     * @type {boolean}
     * @private
     */
    this.isRemovedFromWorld = false;
}

/**
 * Update the entity's internal state.
 * @interface
 */
Entity.prototype.update = function() {}

/**
 * Indicates whether the entity is outside the screen.
 * @return {boolean} True if the entity is outside the screen.
 */
Entity.prototype.isOutsideScreen = function() {
    return (this.x < 0 || this.x >  this.game.getBoard().getWidth() ||
            this.y < 0 || this.y > this.game.getBoard().getHeight());
}

/**
 * Get the x-axis.
 * @return {number} The entity's x-axis coordinate.
 */
Entity.prototype.getX = function() {
    return this.x;
}

/**
 * Get the y-axis.
 * @return {number} The entity's y-axis coordinate.
 */
Entity.prototype.getY = function() {
    return this.y;
}

/**
 * Remove the entity from the world.
 */
Entity.prototype.removeFromWorld = function() {
    this.isRemovedFromWorld = true;
}
