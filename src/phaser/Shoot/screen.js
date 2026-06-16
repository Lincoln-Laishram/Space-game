import Phaser from "phaser";
//
let tank_x = window.innerWidth / 2;
let tank_y = window.innerHeight / 2;
const width = window.innerWidth;
const height = window.innerHeight;

const enemy_dimension = [
  { x: width - 50, y: height - 50 }, // bottom-right
  { x: width / 2, y: height - 50 }, // bottom-center
  { x: width - 50, y: height / 4 }, // right-middle
  { x: width / 4, y: height / 4 }, // upper-left
];
class screen extends Phaser.Scene {
  constructor() {
    super("screen");
  }
  //Spawn Enemies
  SpawnEnemies() {
    enemy_dimension.forEach((item, index) => {
      const enemy = this.add.rectangle(item.x, item.y, 40, 40, 0xff0000);
      this.enemies.push(enemy);
      console.log(enemy);
    });
  }
  //Shooting
  ShootBulletMechanism() {
    this.input.on("pointerdown", (pointer) => {
      this.targetX = pointer.x;
      this.targetY = pointer.y;
      this.dx = this.targetX - this.bullet.x;
      this.dy = this.targetY - this.bullet.y;
      this.length = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      this.dirX = this.dx / this.length;
      this.dirY = this.dy / this.length;
      this.shouldMove = true;
    });
  }
  //Stopping
  StopBulletMechanism() {
    if (!this.shouldMove) {
      return;
    }
    // Distance from tank -> target
    const dx = this.targetX - this.bullet.x;
    const dy = this.targetY - this.bullet.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    // Stop when close enough
    if (length < 5) {
      this.shouldMove = false;
      this.bullet.x = this.tank.x;
      this.bullet.y = this.tank.y;
      return;
    }
    // Normalize
    const dirX = dx / length;
    const dirY = dy / length;
    this.bullet.x += this.dirX * this.speed;
    this.bullet.y += this.dirY * this.speed;
  }
  //Collision
  CheckCollision(bullet, enemy) {
    return Phaser.Geom.Intersects.RectangleToRectangle(
      bullet.getBounds(),
      enemy.getBounds(),
    );
  }
  BulletHits(bullet) {
    this.enemies.forEach((enemy) => {
      if (this.CheckCollision(bullet, enemy)) {
        enemy.fillColor = 0xffff00;
        // enemy.destroy();
        // return false;
      } else {
        enemy.fillColor = 0xff0000;
      }
    });
  }
  //methods ---
  create() {
    this.targetX;
    this.targetY;
    this.dx;
    this.dy;
    this.dirX;
    this.dirY;
    this.speed = 10;
    this.length;
    this.shouldMove = false;
    //Enemies
    this.enemies = [];
    this.ShootBulletMechanism();
    this.SpawnEnemies();
    //Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    //Tank --player
    this.tank = this.add.rectangle(tank_x, tank_y, 40, 40, 0x00ff00);
    //Bullet --bullet
    this.bullet = this.add.circle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      12,
      0xffff00,
    );
  }
  update() {
    this.StopBulletMechanism();
    this.BulletHits(this.bullet);
    if (this.cursors.left.isDown) {
      this.tank.x -= 4;
      this.bullet.x -= 4;
    } else if (this.cursors.up.isDown) {
      this.tank.y -= 4;
      this.bullet.y -= 4;
    } else if (this.cursors.right.isDown) {
      this.tank.x += 4;
      this.bullet.x += 4;
    } else if (this.cursors.down.isDown) {
      this.tank.y += 4;
      this.bullet.y += 4;
    }
  }
}
export default screen;
