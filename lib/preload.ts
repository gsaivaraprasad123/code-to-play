// lib/preload.ts

export const preloadedGames = {
  "Star Catcher": `
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    this.score = 0;
    this.gameOver = false;
  }

  preload() {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png');
    this.load.image('bomb', 'https://labs.phaser.io/assets/sprites/shinyball.png');
    this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.audio('collectSound', 'https://labs.phaser.io/assets/audio/SoundEffects/pickup.wav');
    this.load.audio('explosionSound', 'https://labs.phaser.io/assets/audio/SoundEffects/explosion.mp3');
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.collectSound = this.sound.add('collectSound');
    this.explosionSound = this.sound.add('explosionSound');

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.physics.add.collider(this.player, this.platforms);

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(child => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: '#fff'
    });

    this.gameOverText = this.add.text(400, 300, 'Game Over\\nPress R to restart', {
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    });
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update() {
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.scene.restart();
    }

    if (this.gameOver) {
      this.player.setVelocity(0, 0);
      this.player.anims.play('turn');
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.collectSound.play();
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(child => {
        child.enableBody(true, child.x, 0, true, true);
      });

      const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      const bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    this.explosionSound.play();
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.gameOver = true;
    this.gameOverText.visible = true;
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: GameScene
};

const game = new Phaser.Game(config);
`,

  "Ball Bounce": `/* Ball Bounce Game Code */
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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

const game = new Phaser.Game(config);

let ball, paddle, bricks;
let score = 0, scoreText;
let lives = 3, livesText;
let gameOver = false, gameOverText, restartButton;
let cursors;

function preload() {
  this.load.image('ball', 'https://labs.phaser.io/assets/sprites/shinyball.png');
  this.load.image('paddle', 'https://raw.githubusercontent.com/michael-g-ross/phaser-breakout-sample/main/assets/paddle.png');
  this.load.image('brick', 'https://raw.githubusercontent.com/michael-g-ross/phaser-breakout-sample/main/assets/brick.png');
}

function create() {
  this.physics.world.setBoundsCollision(true, true, true, false);

  ball = this.physics.add.image(400, 300, 'ball').setCollideWorldBounds(true).setBounce(1);
  ball.setData('onPaddle', true);

  paddle = this.physics.add.image(400, 550, 'paddle').setImmovable(true);
  paddle.body.allowGravity = false;
  paddle.setCollideWorldBounds(true);

  bricks = this.physics.add.group({ immovable: true, allowGravity: false });

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      let brick = bricks.create(100 + col * 75, 50 + row * 35, 'brick');
      brick.setOrigin(0.5, 0.5);
    }
  }

  this.physics.add.collider(ball, paddle, ballHitPaddle, null, this);
  this.physics.add.collider(ball, bricks, ballHitBrick, null, this);

  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });
  livesText = this.add.text(650, 16, 'Lives: 3', { fontSize: '20px', fill: '#fff' });

  gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5).setVisible(false);
  restartButton = this.add.text(400, 400, 'Restart', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setVisible(false).setInteractive();
  restartButton.on('pointerdown', restartGame, this);

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (gameOver) return;

  if (cursors.left.isDown) paddle.x -= 10;
  else if (cursors.right.isDown) paddle.x += 10;
  paddle.x = Phaser.Math.Clamp(paddle.x, 50, 750);

  if (ball.getData('onPaddle')) {
    ball.x = paddle.x;
    if (cursors.space.isDown) {
      ball.setVelocity(100, -300);
      ball.setData('onPaddle', false);
    }
  }

  if (ball.y > 600) loseLife();
}

function ballHitPaddle(ball, paddle) {
  let diff = ball.x - paddle.x;
  ball.setVelocityX(10 * diff);
}

function ballHitBrick(ball, brick) {
  brick.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);

  if (bricks.countActive(true) === 0) {
    gameOver = true;
    gameOverText.setText("You Win!");
    gameOverText.setVisible(true);
    restartButton.setVisible(true);
    ball.setVelocity(0, 0);
  }
}

function loseLife() {
  lives--;
  livesText.setText('Lives: ' + lives);

  if (lives === 0) {
    gameOver = true;
    gameOverText.setVisible(true);
    restartButton.setVisible(true);
    ball.setVelocity(0, 0);
  } else {
    ball.setVelocity(0, 0);
    ball.x = paddle.x;
    ball.y = 300;
    ball.setData('onPaddle', true);
  }
}

function restartGame() {
  gameOver = false;
  score = 0;
  lives = 3;
  scoreText.setText('Score: 0');
  livesText.setText('Lives: 3');
  gameOverText.setVisible(false);
  restartButton.setVisible(false);

  ball.setVelocity(0, 0);
  ball.x = paddle.x;
  ball.y = 300;
  ball.setData('onPaddle', true);

  bricks.children.iterate(child => {
    child.enableBody(true, child.x, child.y, true, true);
  });
}
`,

  "Space Shooter": `// Space Shooter Game Code
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, cursors, bullets, enemies;
let score = 0;
let scoreText, gameOverText;
let gameOver = false;

function preload() {
  this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');
  this.load.image('player', 'https://labs.phaser.io/assets/sprites/player.png');
  this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/space-baddie.png');
  this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullets/bullet7.png');
}

function create() {
  this.add.image(400, 300, 'background');

  player = this.physics.add.sprite(400, 500, 'player').setCollideWorldBounds(true);
  cursors = this.input.keyboard.createCursorKeys();
  bullets = this.physics.add.group();
  enemies = this.physics.add.group();

  this.input.keyboard.on('keydown-SPACE', () => {
    if (!gameOver) {
      const bullet = bullets.create(player.x, player.y, 'bullet');
      bullet.setVelocityY(-400);
    }
  });

  this.time.addEvent({
    delay: 1000,
    callback: () => {
      if (!gameOver) {
        const x = Phaser.Math.Between(50, 750);
        const enemy = enemies.create(x, 0, 'enemy');
        enemy.setVelocityY(100);
      }
    },
    loop: true
  });

  this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
  this.physics.add.overlap(player, enemies, playerHit, null, this);

  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
  gameOverText = this.add.text(400, 300, 'GAME OVER\\nPress R to Restart', {
    fontSize: '48px',
    fill: '#fff',
    align: 'center'
  });
  gameOverText.setOrigin(0.5);
  gameOverText.setVisible(false);

  this.input.keyboard.on('keydown-R', () => {
    if (gameOver) {
      score = 0;
      gameOver = false;
      this.scene.restart();
    }
  });
}

function update() {
  if (gameOver) {
    player.setVelocity(0);
    return;
  }

  player.setVelocityX(cursors.left.isDown ? -300 : cursors.right.isDown ? 300 : 0);
  player.setVelocityY(cursors.up.isDown ? -300 : cursors.down.isDown ? 300 : 0);

  bullets.getChildren().forEach(b => { if (b.y < 0) b.destroy(); });
  enemies.getChildren().forEach(e => { if (e.y > 600) e.destroy(); });
}

function hitEnemy(bullet, enemy) {
  bullet.destroy();
  enemy.destroy();
  score += 10;
  scoreText.setText('Score: ' + score);
}

function playerHit(player, enemy) {
  enemy.destroy();
  player.setTint(0xff0000);
  player.setVelocity(0);
  gameOver = true;
  gameOverText.setVisible(true);
}
`,
  "Snake Game": `
  const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    backgroundColor: '#000',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let snake;
let fruit;
let cursors;
let direction = 'RIGHT';
let newDirection = 'RIGHT';
let score = 0;
let scoreText;
let gameOverText;
let gameOver = false;
let restartKey;
let moveEvent;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('fruit', 'https://labs.phaser.io/assets/sprites/apple.png');
}

function create() {
    resetGame(this);

    cursors = this.input.keyboard.createCursorKeys();
    restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Move snake every 150ms
    moveEvent = this.time.addEvent({
        delay: 150,
        callback: () => moveSnake(this),
        loop: true
    });
}

function update() {
    if (gameOver) {
        if (Phaser.Input.Keyboard.JustDown(restartKey)) {
            this.scene.restart();
        }
        return;
    }

    if (cursors.left.isDown && direction !== 'RIGHT') newDirection = 'LEFT';
    if (cursors.right.isDown && direction !== 'LEFT') newDirection = 'RIGHT';
    if (cursors.up.isDown && direction !== 'DOWN') newDirection = 'UP';
    if (cursors.down.isDown && direction !== 'UP') newDirection = 'DOWN';
}

function moveSnake(scene) {
    if (gameOver) return;

    direction = newDirection;
    let head = { ...snake[0] };

    if (direction === 'LEFT') head.x -= 20;
    if (direction === 'RIGHT') head.x += 20;
    if (direction === 'UP') head.y -= 20;
    if (direction === 'DOWN') head.y += 20;

    // Screen wrap logic
    if (head.x >= 600) head.x = 0;
    if (head.x < 0) head.x = 580;
    if (head.y >= 400) head.y = 0;
    if (head.y < 0) head.y = 380;

    // Check self-collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        gameOverText.setText('Game Over! Press R to Restart');
        return;
    }

    snake.unshift(head);

    if (head.x === fruit.x && head.y === fruit.y) {
        score += 10;
        scoreText.setText('Score: ' + score);
        moveFruit();
    } else {
        snake.pop();
    }

    drawSnake(scene);
}

function drawSnake(scene) {
    scene.children.removeAll();
    scene.add.image(fruit.x, fruit.y, 'fruit').setScale(0.7);
    snake.forEach((segment, index) => {
        let color = index === 0 ? 0x00ff00 : 0xffffff;
        scene.add.rectangle(segment.x, segment.y, 18, 18, color).setOrigin(0);
    });

    // Draw UI elements
    scoreText = scene.add.text(10, 10, 'Score: ' + score, { fontSize: '20px', fill: '#fff' });
    if (gameOver) {
        gameOverText = scene.add.text(150, 180, 'Game Over! Press R to Restart', { fontSize: '20px', fill: '#fff' });
    }
}

function moveFruit() {
    fruit.x = Phaser.Math.Between(0, 29) * 20;
    fruit.y = Phaser.Math.Between(0, 19) * 20;
}

function resetGame(scene) {
    snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
    fruit = scene.add.image(300, 200, 'fruit').setScale(0.7);
    score = 0;
    scoreText = scene.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });
    gameOverText = scene.add.text(150, 180, '', { fontSize: '20px', fill: '#fff' });
    direction = 'RIGHT';
    newDirection = 'RIGHT';
    gameOver = false;
    drawSnake(scene);
}

    `,
};
