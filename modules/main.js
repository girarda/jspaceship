var canvas = document.getElementById('surface');
var ctx = canvas.getContext('2d');
var board = new Board(ctx);
var game = null;
var ASSET_MANAGER = new AssetManager();
var menu = null;

ASSET_MANAGER.queueDownload('images/menu.png');
ASSET_MANAGER.queueDownload('images/alien.png');
ASSET_MANAGER.queueDownload('images/spaceship.png');
ASSET_MANAGER.queueDownload('images/bullet.png');
ASSET_MANAGER.downloadAll(function() {
    init();
});

function init() {
    document.addEventListener('click', mouseClicked, false);
    document.removeEventListener('keydown', checkKeyDown, false);
    document.removeEventListener('keyup', checkKeyUp, false);

    game = new JSpaceship(ASSET_MANAGER);
    menu = new Menu();
    menu.draw();
}

function playGame() {
    document.addEventListener('keydown', checkKeyDown, false);
    document.addEventListener('keyup', checkKeyUp, false);
    document.removeEventListener('click', mouseClicked, false);
    game.init(board, 5);
    game.start();
}

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
