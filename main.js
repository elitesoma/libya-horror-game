class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    // Courage (health)
    this.courage = 3;
    this.gameOverFlag = false;

    // Player (Ahmad)
    this.ahmad = this.add.rectangle(320, 200, 32, 32, 0x00ffcc).setOrigin(0.5, 0.5);
    this.physics.add.existing(this.ahmad);
    this.ahmad.body.setCollideWorldBounds(true);

    // Ghost (enemy)
    this.ghost = this.add.circle(100, 100, 18, 0xffffff, 0.7);
    this.physics.add.existing(this.ghost);

    // Tea (collectible)
    this.tea = this.add.rectangle(500, 300, 20, 20, 0xFFD700);
    this.physics.add.existing(this.tea);
    this.tea.body.setImmovable(true);

    // Controls: Arrow keys + WASD
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // UI
    this.courageText = this.add.text(12, 10, 'Courage: 💚💚💚', { fontSize: '20px', fill: '#fff' }).setScrollFactor(0);

    // Overlaps
    this.physics.add.overlap(this.ahmad, this.ghost, this.hitGhost, null, this);
    this.physics.add.overlap(this.ahmad, this.tea, this.collectTea, null, this);

    // Funny dialogue
    this.dialogueBox = this.add.text(60, 350, "", {
      fontSize: '16px',
      fill: '#ffd',
      backgroundColor: '#222a',
      padding: { x: 8, y: 6 }
    }).setScrollFactor(0);

    this.dialogues = [
      "Ahmad: 'Why is it so quiet... except for my stomach?'",
      "A haunted sheep runs by, screaming 'BAAA!'.",
      "Did that tea just move on its own?",
      "A vendor yells: 'Amulet for your courage? Only 99 dinar!'",
      "You hear whispers: 'Welcome... to Libya...'",
      "A ghost grandma floats by, mumbling about lost slippers."
    ];
    this.dialogueIndex = 0;
    this.time.addEvent({
      delay: 8000,
      callback: () => this.showDialogue(),
      loop: true
    });
  }

  update() {
    if (this.gameOverFlag) return;

    // Movement (WASD or Arrow keys)
    let speed = 140;
    let vx = 0, vy = 0;
    if (this.cursors.left.isDown || this.aKey.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.dKey.isDown) vx = speed;

    if (this.cursors.up.isDown || this.wKey.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.sKey.isDown) vy = speed;

    this.ahmad.body.setVelocity(vx, vy);

    // Ghost follows Ahmad
    this.physics.moveToObject(this.ghost, this.ahmad, 60);
  }

  hitGhost(ahmad, ghost) {
    if (this.gameOverFlag) return;
    this.courage--;
    this.updateCourageUI();

    // "Jump scare" ghost teleport
    ghost.x = Phaser.Math.Between(40, 600);
    ghost.y = Phaser.Math.Between(40, 360);

    if (this.courage <= 0) {
      this.gameOver();
    }
  }

  collectTea(ahmad, tea) {
    if (this.courage < 3) this.courage++;
    this.updateCourageUI();
    // Move tea to a new spot
    tea.x = Phaser.Math.Between(40, 600);
    tea.y = Phaser.Math.Between(40, 360);
    this.showDialogue("Ahmad: 'Alhamdulillah, fresh tea!'");
  }

  updateCourageUI() {
    let hearts = '💚'.repeat(this.courage) + '🤍'.repeat(3 - this.courage);
    this.courageText.setText('Courage: ' + hearts);
  }

  showDialogue(msg) {
    if (!msg) {
      msg = this.dialogues[this.dialogueIndex % this.dialogues.length];
      this.dialogueIndex++;
    }
    this.dialogueBox.setText(msg);
    this.time.delayedCall(3400, () => {
      this.dialogueBox.setText('');
    });
  }

  gameOver() {
    this.gameOverFlag = true;
    this.ahmad.body.setVelocity(0, 0);
    this.add.rectangle(320, 200, 400, 140, 0x000000, 0.85).setOrigin(0.5);
    this.add.text(220, 170, "GAME OVER", { fontSize: '32px', fill: '#fa4' });
    this.add.text(180, 210, "Ahmad’s courage failed him in spooky Libya!", { fontSize: '18px', fill: '#fff' });
    this.add.text(220, 250, "Refresh to try again!", { fontSize: '18px', fill: '#fff' });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 400,
  parent: 'game-container',
  backgroundColor: '#222',
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [MainScene]
};

new Phaser.Game(config);
