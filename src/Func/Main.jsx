// import Phaser from "phaser";

// export class MainGame extends Phaser.Scene {
//     constructor() {
//         super("MainGame");
//     }

//     preload() {
//         this.load.image("starfield", "/assets/space.jpg");
//         this.load.image("ship", "/assets/ship.gif");
//         this.load.image("meteor", "/assets/meteor.png");
//         this.load.audio("bgMusic", "/assets/music.mp3");
//     }

//     create() {
//         this.backgroundBox = this.add.graphics();
//         this.backgroundBox.fillStyle(0x000000, 0.5);
//         this.backgroundBox.fillRoundedRect(400, 200, 400, 200, 20);
//         this.backgroundBox.setVisible(false);
//         this.backgroundBox.setDepth(1);

//         this.bg = this.add.tileSprite(0, 0, 1200, 600, "starfield").setOrigin(0, 0);
//         this.bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.5 });
//         this.bgMusic.play();

//         this.ship = this.physics.add.image(200, this.sys.game.config.height / 2, "ship");
//         this.ship.setScale(0.3);
//         this.ship.body.setSize(this.ship.width * 0.3, this.ship.height * 0.2, true);
//         this.ship.setCollideWorldBounds(true);

//         this.controls = this.input.keyboard.createCursorKeys();
//         this.obstacles = this.physics.add.group();
//         this.score = 0;

//         for (let i = 0; i < 8; i++) {
//             this.spawnMeteor();
//         }

//         this.scoreText = this.add.text(16, 16, "Score🚀: 0", {
//             fill: "#fff", fontSize: '40px', fontFamily: 'Pixelify Sans, sans-serif', stroke: '#ff0000', strokeThickness: 6
//         });

//         this.scoreTimer = this.time.addEvent({
//             delay: 100,
//             callback: () => {
//                 this.score++;
//                 this.scoreText.setText(`Score🚀: ${this.score}`);
//             },
//             loop: true
//         });

//         this.gameOverText = this.add.text(600, 250, 'Game Over', {
//             fontSize: '60px', fill: '#fff', fontFamily: 'Pixelify Sans, sans-serif'
//         }).setOrigin(0.5).setVisible(false).setDepth(2);

//         this.tryAgainButton = this.add.text(600, 320, 'Try Again', {
//             fontSize: '32px', fill: '#ff0000', fontFamily: 'Pixelify Sans, sans-serif'
//         }).setOrigin(0.5).setInteractive().setVisible(false).setDepth(2);

//         this.tryAgainButton.on('pointerover', () => {
//             this.tryAgainButton.setScale(1.1);
//             this.tryAgainButton.setStyle({ fill: '#ff5555' });
//         });

//         this.tryAgainButton.on('pointerdown', () => {
//             this.bgMusic.stop();
//             this.score = 0;
//             this.scene.restart();
//         });

//         this.tryAgainButton.on('pointerout', () => {
//             this.tryAgainButton.setScale(1);
//             this.tryAgainButton.setStyle({ fill: '#ff0000' });
//         });

//         this.physics.add.collider(this.ship, this.obstacles, () => {
//             this.gameOver();
//             this.scoreTimer.remove();
//         });
//     }

//     spawnMeteor() {
//         let meteor = this.obstacles.create(Phaser.Math.Between(800, 1800), Phaser.Math.Between(0, 600), "meteor");
//         meteor.setScale(0.1);
//         meteor.setVelocityX(-600);
//         meteor.body.setSize(meteor.width * 0.3, meteor.height * 0.3, true);
//         this.time.addEvent({
//             delay: 8000,
//             callback: () => {
//                 meteor.setVelocityX(meteor.body.velocity.x - 2);
//             },
//             loop: true
//         });
//     }

//     update() {
//         this.bg.tilePositionX += 6;
//         if (!this.ship || !this.controls) return;

//         if (this.controls.up.isDown) {
//             this.ship.setVelocityY(-500);
//         } else if (this.controls.down.isDown) {
//             this.ship.setVelocityY(500);
//         } else {
//             this.ship.setVelocityY(0);
//         }

//         if (this.obstacles) {
//             this.obstacles.children.iterate((meteor) => {
//                 if (meteor.x < -50) {
//                     meteor.x = Phaser.Math.Between(1000, 1400);
//                     meteor.y = Phaser.Math.Between(0, 600);
//                     meteor.setVelocityX(meteor.body.velocity.x - 2);
//                 }
//                 this.time.addEvent({
//                     delay: 8000,
//                     callback: () => {
//                         meteor.setVelocityX(meteor.body.velocity.x - 2);
//                     },
//                     loop: true
//                 });
//             });
//         }
//     }

//     gameOver() {
//         this.backgroundBox.setVisible(true);
//         this.gameOverText.setVisible(true);
//         this.tryAgainButton.setVisible(true);
//         this.physics.pause();
//         console.log("Game over triggered!");
//     }
// }
