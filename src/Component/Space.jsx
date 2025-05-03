import { useEffect } from "react";
import Phaser from "phaser";

export const Space = () => {
    useEffect(() => {
        let ship, bg, controls, obstacles, score = 0, scoreText, bgMusic, gameOverText, tryAgainButton, scoreTimer, backgroundBox;

        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: "phaser-game",
            physics: {
                default: "arcade",
                arcade: { debug: false },
            },
            scene: { preload, create, update },
        };

        const game = new Phaser.Game(config);

        const handleResize = () => {
            game.scale.resize(window.innerWidth, window.innerHeight);
        };

        // ✅ attach listener ONCE
        window.addEventListener('resize', handleResize);


        function preload() {
            this.load.image("starfield", "/assets/space.jpg");
            this.load.image("ship", "/assets/ship.gif");
            this.load.image("meteor", "/assets/meteor.png");
            this.load.audio("bgMusic", "/assets/music.mp3");
        }

        function create() {
            //CREATING MY GAME OVER DIALOG BOX
            backgroundBox = this.add.graphics();
            backgroundBox.fillStyle(0x000000, 0.5); //BG-color opacity
            backgroundBox.fillRoundedRect(300, 100, 400, 200, 20); //x,y width, height, border-radius
            backgroundBox.setVisible(false);
            console.log("Background box created:", backgroundBox);
            backgroundBox.setDepth(1);//z-index

            //SCROLL BG IN X-AXIS
            bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "starfield").setOrigin(0, 0);

            //PLAYS BG MUSIC
            bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.5 });
            bgMusic.play();

            //ADD PLAYER SHIP SPRITE WITH PHYSICS
            ship = this.physics.add.image(200, this.sys.game.config.height / 2, "ship");
            ship.setScale(0.2);//scale down the size of the ship
            ship.body.setSize(ship.width * 0.3, ship.height * 0.3, true);//Shrink the hitbox
            ship.setCollideWorldBounds(true); //fill collision between the ship and the game canvas

            //CAPTURES KEYBOARD ARROW KEY INPUT
            controls = this.input.keyboard.createCursorKeys();

            //CREATES A GROUP OF METEORS(OBSTACLES)
            obstacles = this.physics.add.group();
            for (let i = 0; i < 6; i++) {
                spawnMeteor(this);
            }
            //DISPLAYS SCORE
            scoreText = this.add.text(16, 16, `Score🚀: ${score}`, {
                fill: "#fff", fontSize: '32px', fontFamily: 'Pixelify Sans, sans-serif', stroke: '#ff0000', strokeThickeness: 6
            });
            // SCORE TIMER
            scoreTimer = this.time.addEvent({
                delay: 100,
                callback: () => {
                    score++;
                    scoreText.setText(`Score🚀: ${score}`);
                },
                loop: true
            });

            //GAME OVER AND TRY AGAIN LOGIC
            gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Game Over', {
                fontSize: '60px', fill: '#fff', fontFamily: 'Pixelify Sans, sans-serif'
            }).setOrigin(0.5, 0.5).setVisible(false).setDepth(2);

            tryAgainButton = this.add.text(500, 230, 'Try Again', {
                fontSize: '32px', fill: '#ff0000', fontFamily: 'Pixelify Sans, sans-serif'
            }).setOrigin(0.5, 0.5).setInteractive().setVisible(false).setDepth(2);

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

            // Sets up collision detection between ship and meteors
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
            bg.tilePositionX += 6; //value in px
            if (!ship || !controls) return;
            //HANDLE CONTROLS
            if (controls.up.isDown) {
                ship.setVelocityY(-500);
            } else if (controls.down.isDown) {
                ship.setVelocityY(500);
            } else {
                ship.setVelocityY(0);
            }
            //LOOPING METEORS
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

        return () => {
            game.destroy(true);
            window.removeEventListener('resize', handleResize);  
        }
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
