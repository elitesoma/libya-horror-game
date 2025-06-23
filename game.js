const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player, jinns, talismans, cursors, spaceKey, health = 100, healthText;
const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/images/background.jpg');
    this.load.image('player', 'assets/images/player.png');
    this.load.image('jinn', 'assets/images/jinn.png');
    this.load.image('talisman', 'assets/images/talisman.png');
}

function create() {
    this.add.image(800, 600, 'background').setOrigin(0.5);
    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setBounds(0, 0, 1600, 1200);

    player = this.physics.add.sprite(400, 300, 'player').setScale(0.5);
    player.setCollideWorldBounds(true);

    jinns = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
        let x = Phaser.Math.Between(100, 1500);
        let y = Phaser.Math.Between(100, 1100);
        let jinn = jinns.create(x, y, 'jinn').setScale(0.5);
        jinn.health = 50;
        jinn.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        jinn.setBounce(1);
        jinn.setCollideWorldBounds(true);
    }

    talismans = this.physics.add.group();
    for (let i = 0; i < 3; i++) {
        let x = Phaser.Math.Between(100, 1500);
        let y = Phaser.Math.Between(100, 1100);
        talismans.create(x, y, 'talisman').setScale(0.5);
    }

    cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.physics.add.overlap(player, jinns, playerHitJinn, null, this);
    this.physics.add.overlap(player, talismans, collectTalisman, null, this);

    healthText = this.add.text(10, 10, 'Health: 100', { font: '20px Arial', fill: '#fff' }).setScrollFactor(0);

    this.cameras.main.startFollow(player);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
    } else {
        player.setVelocityY(0);
    }

    if (spaceKey.isDown) {
        jinns.getChildren().forEach(jinn => {
            if (Phaser.Math.Distance.Between(player.x, player.y, jinn.x, jinn.y) < 100) {
                jinn.health -= 10;
                if (jinn.health <= 0) {
                    jinn.destroy();
                }
            }
        });
    }

    if (health <= 0) {
        this.add.text(400, 300, 'Game Over', { font: '40px Arial', fill: '#ff0000' }).setOrigin(0.5).setScrollFactor(0);
        this.physics.pause();
    }
}

function playerHitJinn(player, jinn) {
    health -= 10;
    healthText.setText('Health: ' + health);
    jinn.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
}

function collectTalisman(player, talisman) {
    talisman.destroy();
    health = Math.min(100, health + 20);
    healthText.setText('Health: ' + health);
}
