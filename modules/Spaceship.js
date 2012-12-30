function Spaceship(game) {
    //TODO change 400,500 too x,y
    Entity.call(this, game, 400, 500);

    this.sprite = this.game.getAssetManager().getAsset('images/spaceship.png');

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
        this.bullets.push(new Bullet(game));
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
