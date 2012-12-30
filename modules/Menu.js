/**
 * @fileoverview Bord class definition
 * @author girarda.92@gmail.com (Alexandre Girard)
 */

/**
 * Menu class.
 * @param {Board} The board on which the menu is displayed.
 * @constructor
 */
function Menu(board) {
    /**
     * The board on which the menu is displayed.
     * @type {Board}
     * @private
     */
    this.board = board;

    /**
     * The play button
     * @type {Button}
     * @private
     */
    this.btnPlay = new Button(248, 502, 221, 351);
}

/**
 * Draw the menu on the board.
 */
Menu.prototype.draw = function() {
    this.board.getCtx().drawImage(ASSET_MANAGER.getAsset('images/menu.png'), 0, 0);
}

/**
 * Check if the play button is pressed.
 * return {boolean} True if the play button is pressed.
 */
Menu.prototype.checkPlay = function() {
    return this.btnPlay.checkClicked();
}

/**
 * Button class.
 * @param {number xL} the left x-axis position.
 * @param {number rL} the right x-axis position.
 * @param {number yT} the top y-axis position.
 * @param {number yB} the bottom y-axis position.
 * @constructor
 */
function Button(xL, xR, yT, yB) {
    /**
     * The left x-axis position
     * @type {number}
     * @private
     */
    this.xLeft = xL;

    /**
     * The right x-axis position
     * @type {number}
     * @private
     */
    this.xRight = xR;

    /**
     * The top y-axis position
     * @type {number}
     * @private
     */
    this.yTop = yT;

    /**
     * The bottom y-axis position
     * @type {number}
     * @private
     */
    this.yBottom = yB;
}

/**
 * Check if the button is pressed.
 * @return {boolean} true if the button is pressed.
 */
Button.prototype.checkClicked = function() {
    if (this.xLeft <= menu.mouseX && menu.mouseX <= this.xRight && this.yTop <= menu.mouseY && menu.mouseY <= this.yBottom) {
        return true
    }
};


