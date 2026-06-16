import Phaser from "phaser";
const roadWidth = 300;
const roadHeight = 600;
const enemy_path_x = [100, 200, 300];
const enemy_path_y = [-150, -250, -350];
const coin_path_x = [100, 200, 300];
const coin_path_y = [-250, -350, -450];
class screen extends Phaser.Scene {
  constructor() {
    super("screen");
  }
  checkCollision(rect1, rect2) {
    return (
      rect1.x - rect1.width / 2 < rect2.x + rect2.width / 2 &&
      rect1.x + rect1.width / 2 > rect2.x - rect2.width / 2 &&
      rect1.y - rect1.height / 2 < rect2.y + rect2.height / 2 &&
      rect1.y + rect1.height / 2 > rect2.y - rect2.height / 2
    );
  }
  //Score collision
  scoreCollision(player, coin) {
    return Phaser.Geom.Intersects.RectangleToRectangle(
      player.getBounds(),
      coin.getBounds(),
    );
  }
  create() {
    this.enemy_speed = 5;
    this.score = 0;
    this.time.addEvent({
      delay: 8000,
      callback: () => {
        this.enemy_speed += 1;
      },
      loop: true,
    });
    //Score
    this.scoreText = this.add.text(150, 20, `Score: ${this.score}`, {
      fontSize: "30px",
      color: "#ffffff",
    });
    this.scoreText.setDepth(999);
    //Controller -- mObile and Tablet
    this.leftButton = this.add.rectangle(40, 550, 80, 80, 0x555555);
    this.leftButton.setStrokeStyle(2, 0xffffff);
    this.leftButton.setInteractive();

    this.rightButton = this.add.rectangle(360, 550, 80, 80, 0x555555);
    this.rightButton.setStrokeStyle(2, 0xffffff);
    this.rightButton.setInteractive();

    this.leftButton.on("pointerdown", () => {
      this.currentLane -= 1;
    });
    this.rightButton.on("pointerdown", () => {
      this.currentLane += 1;
    });
    // Road
    this.road = this.add.rectangle(200, 300, roadWidth, roadHeight, 0x333333);
    this.road.setStrokeStyle(2, 0xffffff);
    //Score Coin
    this.coin1 = this.add.circle(
      coin_path_x[Math.floor(Math.random() * coin_path_x.length)],
      coin_path_y[Math.floor(Math.random() * coin_path_y.length)],
      15,
      0xffff00,
    );
    this.coin2 = this.add.circle(
      coin_path_x[Math.floor(Math.random() * coin_path_x.length)],
      coin_path_y[Math.floor(Math.random() * coin_path_y.length)],
      15,
      0xffff00,
    );
    this.coin3 = this.add.circle(
      coin_path_x[Math.floor(Math.random() * coin_path_x.length)],
      coin_path_y[Math.floor(Math.random() * coin_path_y.length)],
      15,
      0xffff00,
    );
    //Enemy
    this.enemy1 = this.add.rectangle(
      enemy_path_x[Math.floor(Math.random() * enemy_path_x.length)],
      enemy_path_y[Math.floor(Math.random() * enemy_path_y.length)],
      40,
      40, 
      0xff0000,
    );
    this.enemy1.setStrokeStyle(2, 0xffffff);
    this.enemy2 = this.add.rectangle(
      enemy_path_x[Math.floor(Math.random() * enemy_path_x.length)],
      enemy_path_y[Math.floor(Math.random() * enemy_path_y.length)],
      40,
      40,
      0xff0000,
    );
    this.enemy2.setStrokeStyle(2, 0xffffff);

    // Player
    this.player = this.add.rectangle(200, 450, 40, 60, 0x00ff00);
    this.player.setStrokeStyle(2, 0xffffff);
    this.lanes = [100, 200, 300];
    this.currentLane = 1;
    // Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();

    // Road boundaries
    const roadLeft = 200 - roadWidth / 2;
    const roadRight = 200 + roadWidth / 2;

    this.leftBoundary = roadLeft + this.player.width / 2;
    this.rightBoundary = roadRight - this.player.width / 2;

    //Game Over
    this.gameOverPanel = this.add.rectangle(200, 350, 300, 120, 0x000000);
    this.gameOverPanel.setStrokeStyle(2, 0xffffff);
    this.gameOverPanel.setVisible(false);
    this.gameOverPanel.setInteractive();
    this.isGameOver = false;
    this.gameOverText = this.add.text(200, 300, "GAME OVER", {
      fontSize: "40px",
      color: "#ffffff",
    });
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.setVisible(false);
    this.instruction = this.add.text(
      200,
      350,
      "\n\n\nPress Space to Continue\nOr \nPress to continue",
      {
        fontSize: "20px",
        color: "#ffffff",
      },
    );
    this.instruction.setOrigin(0.5);
    this.instruction.setVisible(false);
    this.gameOverPanel.on("pointerdown", () => {
      this.scene.restart();
    });
  }

  update() {
    if (this.isGameOver) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
        this.scene.restart();
      }
      return;
    }
    //Movement --coins
    this.coin1.y += this.enemy_speed;
    if (this.coin1.y > 600) {
      this.coin1.y =
        coin_path_y[Math.floor(Math.random() * coin_path_y.length)];
      this.coin1.x =
        coin_path_x[Math.floor(Math.random() * coin_path_x.length)];
    }
    this.coin2.y += this.enemy_speed;
    if (this.coin2.y > 600) {
      this.coin2.y =
        coin_path_y[Math.floor(Math.random() * coin_path_y.length)];
      this.coin2.x =
        coin_path_x[Math.floor(Math.random() * coin_path_x.length)];
    }
    this.coin3.y += this.enemy_speed;
    if (this.coin3.y > 600) {
      this.coin3.y =
        coin_path_y[Math.floor(Math.random() * coin_path_y.length)];
      this.coin3.x =
        coin_path_x[Math.floor(Math.random() * coin_path_x.length)];
    }

    //Movement --enemies
    this.enemy1.y += this.enemy_speed;
    if (this.enemy1.y > 550) {
      this.enemy1.y =
        enemy_path_y[Math.floor(Math.random() * enemy_path_y.length)];
      this.enemy1.x =
        enemy_path_x[Math.floor(Math.random() * enemy_path_x.length)];
    }
    this.enemy2.y += this.enemy_speed;
    if (this.enemy2.y > 550) {
      this.enemy2.y =
        enemy_path_y[Math.floor(Math.random() * enemy_path_y.length)];
      this.enemy2.x =
        enemy_path_x[Math.floor(Math.random() * enemy_path_x.length)];
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.currentLane--;
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.currentLane++;
    }
    if (this.currentLane < 0) {
      this.currentLane = 0;
    }

    if (this.currentLane > this.lanes.length - 1) {
      this.currentLane = this.lanes.length - 1;
    }
    // Collision
    //1. Enemy
    if (this.checkCollision(this.player, this.enemy1)) {
      this.player.fillColor = 0xffff00;
      this.isGameOver = true;
      this.gameOverText.setVisible(true);
      this.gameOverPanel.setVisible(true);
      this.instruction.setVisible(true);
    } else if (this.checkCollision(this.player, this.enemy2)) {
      this.player.fillColor = 0xffff00;
      this.isGameOver = true;
      this.gameOverText.setVisible(true);
      this.gameOverPanel.setVisible(true);
      this.instruction.setVisible(true);
    } else {
      this.player.fillColor = 0x00ff00;
      this.isGameOver = false;
      this.gameOverText.setVisible(false);
      this.gameOverPanel.setVisible(false);
      this.instruction.setVisible(false);
    }
    //2. Score
    if (this.scoreCollision(this.player, this.coin1)) {
      this.score += 1;
      this.coin1.y = -200;
      this.scoreText.setText(`Score: ${this.score}`);
    } else if (this.scoreCollision(this.player, this.coin2)) {
      this.score += 1;
      this.coin2.y = -200;
      this.scoreText.setText(`Score: ${this.score}`);
    } else if (this.scoreCollision(this.player, this.coin3)) {
      this.score += 1;
      this.coin3.y = -200;
      this.scoreText.setText(`Score: ${this.score}`);
    }
    //Game Restart
    if (this.isGameOver && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.scene.restart();
    }

    this.player.x = this.lanes[this.currentLane];
  }
}

export default screen;
