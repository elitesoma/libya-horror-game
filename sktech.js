let player, cheeseSprays, jinns, bgImg, cheeseImg, jinnImg, playerImg;

function preload() {
    bgImg = loadImage('assets/background.png');
    cheeseImg = loadImage('assets/cheese.png');
    jinnImg = loadImage('assets/jinn.png');
    playerImg = loadImage('assets/player.png');
}

function setup() {
    createCanvas(800, 600);
    player = new Player(width / 2, height / 2);
    cheeseSprays = [];
    jinns = [];
    for (let i = 0; i < 5; i++) {
        jinns.push(new Jinn(random(width), random(height)));
    }
}

function draw() {
    image(bgImg, 0, 0, width, height);
    player.update();
    player.show();
    
    if (mouseIsPressed) {
        cheeseSprays.push(new CheeseSpray(player.x, player.y, mouseX, mouseY));
    }
    
    for (let i = cheeseSprays.length - 1; i >= 0; i--) {
        cheeseSprays[i].update();
        cheeseSprays[i].show();
        if (cheeseSprays[i].offscreen()) {
            cheeseSprays.splice(i, 1);
            continue;
        }
        for (let j = jinns.length - 1; j >= 0; j--) {
            if (cheeseSprays[i].hits(jinns[j])) {
                jinns.splice(j, 1);
                cheeseSprays.splice(i, 1);
                break;
            }
        }
    }
    
    for (let jinn of jinns) {
        jinn.update(player.x, player.y);
        jinn.show();
    }
    
    if (jinns.length < 5 && random(1) < 0.02) {
        jinns.push(new Jinn(random(width), random(height)));
    }
}

function keyPressed() {
    if (keyCode === 87) player.movingUp = true; // W
    if (keyCode === 83) player.movingDown = true; // S
    if (keyCode === 65) player.movingLeft = true; // A
    if (keyCode === 68) player.movingRight = true; // D
}

function keyReleased() {
    if (keyCode === 87) player.movingUp = false;
    if (keyCode === 83) player.movingDown = false;
    if (keyCode === 65) player.movingLeft = false;
    if (keyCode === 68) player.movingRight = false;
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.movingUp = false;
        this.movingDown = false;
        this.movingLeft = false;
        this.movingRight = false;
    }
    
    update() {
        if (this.movingUp && this.y > 0) this.y -= this.speed;
        if (this.movingDown && this.y < height) this.y += this.speed;
        if (this.movingLeft && this.x > 0) this.x -= this.speed;
        if (this.movingRight && this.x < width) this.x += this.speed;
    }
    
    show() {
        image(playerImg, this.x - 25, this.y - 25, 50, 50);
    }
}

class CheeseSpray {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        let angle = atan2(targetY - y, targetX - x);
        this.vx = cos(angle) * 10;
        this.vy = sin(angle) * 10;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
    
    show() {
        image(cheeseImg, this.x - 15, this.y - 15, 30, 30);
    }
    
    offscreen() {
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
    }
    
    hits(jinn) {
        let d = dist(this.x, this.y, jinn.x, jinn.y);
        return d < 30;
    }
}

class Jinn {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 2;
    }
    
    update(playerX, playerY) {
        let angle = atan2(playerY - this.y, playerX - this.x);
        this.x += cos(angle) * this.speed;
        this.y += sin(angle) * this.speed;
    }
    
    show() {
        image(jinnImg, this.x - 25, this.y - 25, 50, 50);
    }
}
