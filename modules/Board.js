/**
 * @fileoverview Board class definition.
 * @author girarda.92@gmail.com (Alexandre Girard)
 */

/**
 * Board class.
 * @param {object} canvas_ctx A canvas's context.
 * @constructor
 */
function Board(canvas_ctx) {
    /**
     * The board's context
     * @type {object}
     * @private
     */
    this.ctx = canvas_ctx;
}

/**
 * Get the board's width.
 * @return {number} The board's width.
 */
Board.prototype.getWidth = function() {
    return this.ctx.canvas.width;
}

/**
 * Get the board's height.
 * @return {number} The board's height.
 */
Board.prototype.getHeight = function() {
    return this.ctx.canvas.height;
}

/**
 * Get the board's canvas.
 * @return {object} The board's width.
 */
Board.prototype.getCanvas = function() {
    return this.ctx.canvas;
}

/**
 * Get the board's context.
 * @return {object} The board's context.
 */
Board.prototype.getCtx = function() {
    return this.ctx;
}

/**
 * Clear the board.
 */
Board.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
}

/**
 * Restore the board to its saved state
 */
Board.prototype.restore = function() {
    this.ctx.restore();
}

/**
 * Save the board's current state for future use.
 */
Board.prototype.save = function() {
    this.ctx.save();
}

