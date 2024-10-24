let paddle;
let ball;
let bricks = [];
let rows = 5;
let cols = 10;
let brickWidth;
let brickHeight = 20;

function setup() {
  createCanvas(800, 600);
  
  // パドルの設定
  paddle = new Paddle();
  
  // ボールの設定
  ball = new Ball();
  
  // ブロックの設定
  brickWidth = width / cols;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      bricks.push(new Brick(j * brickWidth, i * brickHeight));
    }
  }
}

function draw() {
  background(0);
  
  // パドルとボールの描画
  paddle.display();
  paddle.move();
  
  ball.display();
  ball.move();
  
  // パドルとボールの衝突判定
  if (ball.hitsPaddle(paddle)) {
    ball.reverse();
  }
  
  // ブロックの描画と破壊判定
  for (let i = bricks.length - 1; i >= 0; i--) {
    bricks[i].display();
    if (ball.hitsBrick(bricks[i])) {
      ball.reverse();
      bricks.splice(i, 1);  // ブロックを削除
    }
  }
  
  // ボールが下に落ちた場合のリセット
  if (ball.offScreen()) {
    ball.reset();
  }
}

// パドルクラス
class Paddle {
  constructor() {
    this.w = 120;
    this.h = 20;
    this.x = width / 2 - this.w / 2;
    this.y = height - this.h - 10;
    this.speed = 6;
  }
  
  display() {
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }
  
  move() {
    if (keyIsDown(LEFT_ARROW) && this.x > 0) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) && this.x + this.w < width) {
      this.x += this.speed;
    }
  }
}

// ボールクラス
class Ball {
  constructor() {
    this.r = 12;
    this.reset();
  }
  
  display() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }
  
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    
    // 壁との衝突判定
    if (this.x < 0 || this.x > width) {
      this.xSpeed *= -1;
    }
    if (this.y < 0) {
      this.ySpeed *= -1;
    }
  }
  
  hitsPaddle(paddle) {
    return (this.y + this.r > paddle.y &&
            this.x > paddle.x &&
            this.x < paddle.x + paddle.w);
  }
  
  hitsBrick(brick) {
    return (this.x > brick.x &&
            this.x < brick.x + brick.w &&
            this.y - this.r < brick.y + brick.h &&
            this.y + this.r > brick.y);
  }
  
  reverse() {
    this.ySpeed *= -1;
  }
  
  offScreen() {
    return this.y > height;
  }
  
  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xSpeed = random(-3, 3);
    this.ySpeed = 5;
  }
}

// ブロッククラス
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = brickWidth;
    this.h = brickHeight;
  }
  
  display() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.w, this.h);
  }
}
