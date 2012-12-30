function Menu() {
    this.btnPlay = new Button(248, 502, 221, 351);
    this.mouseX = null;
    this.mouseX = null;
}

Menu.prototype.draw = function() {
    ctx.drawImage(ASSET_MANAGER.getAsset('images/menu.png'), 0, 0);
}

function Button(xL, xR, yT, yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

Button.prototype.checkClicked = function() {
    if (this.xLeft <= menu.mouseX && menu.mouseX <= this.xRight && this.yTop <= menu.mouseY && menu.mouseY <= this.yBottom) {
        return true
    }
};

function mouseClicked(e) {
    menu.mouseX = e.pageX - canvas.offsetLeft;
    menu.mouseY = e.pageY - canvas.offsetTop;
    if (menu.btnPlay.checkClicked()) {
        //TODO Refactor this
        playGame();
    }
}
