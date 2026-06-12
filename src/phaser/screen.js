import Phaser from "phaser";

const roadWidth = 300;
const roadHeight = 600;
const enemy_path_x = [100, 200, 300];
const enemy_path_y = [-150, -250, -350];
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
  create() {
    this.enemy_speed = 10;
    this.time.addEvent({
      delay: 6000,
      callback: () => {
        this.enemy_speed += 1;
      },
      loop: true,
    });
    //Controller -- mObile and Tablet
    this.leftButton = this.add.rectangle(40, 550, 80, 80, 0x555555);
    this.leftButton.setStrokeStyle(2, 0xffffff);
    this.leftButton.setInteractive();

    this.rightButton = this.add.rectangle(360, 550, 80, 80, 0x555555);
    this.rightButton.setStrokeStyle(2, 0xffffff);
    this.rightButton.setInteractive();

    this.leftButton.on("pointerdown", () => {
      this.currentLane--;
    });
    this.rightButton.on("pointerdown", () => {
      this.currentLane++;
    });

    this.rightButton.on("pointerdown", () => {
      this.currentLane++;
    });
    // Road
    this.road = this.add.rectangle(200, 300, roadWidth, roadHeight, 0x333333);
    this.road.setStrokeStyle(2, 0xffffff);
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
    //Collision
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
    //Game Restart
    if (this.isGameOver && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.scene.restart();
    }

    this.player.x = this.lanes[this.currentLane];
  }
}

export default screen;
