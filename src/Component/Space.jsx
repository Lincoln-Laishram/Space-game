import { useEffect } from "react";
import Phaser from "phaser";

export const Space = () => {
    useEffect(() => {
        let ship, bg, controls, obstacles, score = 0, scoreText, bgMusic, gameOverText, tryAgainButton, scoreTimer, backgroundBox;

        const config = {
            type: Phaser.AUTO,
            width: 1000,
            height: 400,
            parent: "phaser-game",
            physics: {
                default: "arcade",
                arcade: { debug: false },
            },
            scene: { preload, create, update },
        };

        const game = new Phaser.Game(config);

        function preload() {
            this.load.image("starfield", "/assets/space.jpg");
            this.load.image("ship", "/assets/ship.gif");
            this.load.image("meteor", "/assets/meteor.png");
            this.load.audio("bgMusic", "/assets/music.mp3");
        }

        function create() {
            backgroundBox = this.add.graphics();
            backgroundBox.fillStyle(0x000000, 0.5);
            backgroundBox.fillRoundedRect(300, 100, 400, 200, 20);
            backgroundBox.setVisible(false);
            console.log("Background box created:", backgroundBox);
            backgroundBox.setDepth(1);


            bg = this.add.tileSprite(0, 0, 1000, 400, "starfield").setOrigin(0, 0);
            bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.5 });
            bgMusic.play();

            ship = this.physics.add.image(200, this.sys.game.config.height / 2, "ship");
            ship.setScale(0.2);
            ship.body.setSize(ship.width * 0.3, ship.height * 0.3, true);
            ship.setCollideWorldBounds(true);

            controls = this.input.keyboard.createCursorKeys();
            obstacles = this.physics.add.group();

            for (let i = 0; i < 6; i++) {
                spawnMeteor(this);
            }

            scoreText = this.add.text(16, 16, "Score🚀: 0", {
                fill: "#fff", fontSize: '32px', fontFamily: 'Pixelify Sans, sans-serif', stroke: '#ff0000', strokeThickeness: 6
            });

            scoreTimer = this.time.addEvent({
                delay: 100,
                callback: () => {
                    score++;
                    scoreText.setText(`Score🚀: ${score}`);
                },
                loop: true
            });

            gameOverText = this.add.text(500, 150, 'Game Over', {
                fontSize: '60px', fill: '#fff', fontFamily: 'Pixelify Sans, sans-serif'
            }).setOrigin(0.5).setVisible(false).setDepth(2);

            tryAgainButton = this.add.text(500,230, 'Try Again', {
                fontSize: '32px', fill: '#ff0000', fontFamily: 'Pixelify Sans, sans-serif'
            }).setOrigin(0.5).setInteractive().setVisible(false).setDepth(2);

            tryAgainButton.on('pointerover', () => {
                tryAgainButton.setScale(1.1);
                tryAgainButton.setStyle({ fill: '#ff5555' });
            });

            tryAgainButton.on('pointerdown', () => {
                bgMusic.stop();
                score = 0;
                this.scene.restart();
            });

            tryAgainButton.on('pointerout', () => {
                tryAgainButton.setScale(1);
                tryAgainButton.setStyle({ fill: '#ff0000' });
            });

            this.physics.add.collider(ship, obstacles, () => {
                gameOver(this);
                scoreTimer.remove();
            });
        }

        function spawnMeteor(scene) {
            let meteor = obstacles.create(Phaser.Math.Between(800, 1800), Phaser.Math.Between(1, 400), "meteor");
            meteor.setScale(0.1);
            meteor.setVelocityX(-600);
            meteor.body.setSize(meteor.width * 0.2, meteor.height * 0.2, true);
            scene.time.addEvent({
                delay: 8000,
                callback: () => {
                    meteor.setVelocityX(meteor.body.velocity.x - 2);
                },
                loop: true
            });
        }

        function update() {
            bg.tilePositionX += 6;
            if (!ship || !controls) return;

            if (controls.up.isDown) {
                ship.setVelocityY(-500);
            } else if (controls.down.isDown) {
                ship.setVelocityY(500);
            } else {
                ship.setVelocityY(0);
            }

            obstacles.children.iterate((meteor) => {
                if (meteor.x < -50) {
                    meteor.x = Phaser.Math.Between(1000, 1400);
                    meteor.y = Phaser.Math.Between(1, 400);
                    meteor.setVelocityX(meteor.body.velocity.x - 2);
                    this.time.addEvent({
                        delay: 8000,
                        callback: () => {
                            meteor.setVelocityX(meteor.body.velocity.x - 2);
                        },
                        loop: true
                    });
                }
            });
        }

        function gameOver(scene) {
            backgroundBox.setVisible(true);
            gameOverText.setVisible(true);
            tryAgainButton.setVisible(true);
            scene.physics.pause();
            console.log("Game over triggered!");
        }

        return () => game.destroy(true);
    }, []);

    return (
        <>
            <center>
                <div id="phaser-game">
                </div>
            </center>
        </>
    );
};
