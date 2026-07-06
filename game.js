var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var scoreText = document.getElementById("scoreText");
var livesText = document.getElementById("livesText");
var levelText = document.getElementById("levelText");
var message = document.getElementById("message");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", function () {
  resizeCanvas();
});

var keys = {};

var score = 0;
var lives = 5;
var level = 1;

var isPlaying = true;
var gameOver = false;

var ship = {
  x: canvas.width / 2,
  y: canvas.height - 120,
  width: 48,
  height: 48,
  speed: 6
};

var shots = [];
var aliens = [];
var stars = [];

var alienTimer = 0;
var killsInThisLevel = 0;
var neededKills = 8;

var bigEnemy = null;

for (var i = 0; i < 90; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 1 + Math.random() * 2
  });
}

document.addEventListener("keydown", function (event) {
  keys[event.code] = true;

  if (event.code === "Space") {
    makeShot();
  }

  if (event.code === "Enter" && gameOver) {
    restartGame();
  }
});

document.addEventListener("keyup", function (event) {
  keys[event.code] = false;
});



























function updateText() {
  scoreText.innerText = score;
  livesText.innerText = lives;
  levelText.innerText = level;
}


























function restartGame() {
  score = 0;
  lives = 5;
  level = 1;
  shots = [];
  aliens = [];
  bigEnemy = null;
  killsInThisLevel = 0;
  neededKills = 8;
  isPlaying = true;
  gameOver = false;
  ship.x = canvas.width / 2;
  ship.y = canvas.height - 120;
  message.innerText = "Use arrow keys to move. Press space to shoot.";
}

















function makeShot() {
  if (!isPlaying || gameOver) {
    return;
  }

  shots.push({
    x: ship.x - 3,
    y: ship.y - 25,
    width: 6,
    height: 18,
    speed: 9
  });
}         
















function createAlien() {
  var size = 46;
  var speed = 1.5 + level * 0.25;

  aliens.push({
    x: Math.random() * (canvas.width - size),
    y: -60,
    width: size,
    height: size,
    speed: speed
  });
}

function createBigEnemy() {
  bigEnemy = {
    x: canvas.width / 2 - 90,
    y: 90,
    width: 180,
    height: 110,
    speed: 3,
    direction: 1,
    health: 15 + level * 3
  };

  message.innerText = "Big alien arrived!";
}

function moveShip() {
  if (keys["ArrowLeft"] && ship.x - ship.width / 2 > 0) {
    ship.x = ship.x - ship.speed;
  }

  if (keys["ArrowRight"] && ship.x + ship.width / 2 < canvas.width) {
    ship.x = ship.x + ship.speed;
  }

  if (keys["ArrowUp"] && ship.y - ship.height / 2 > 90) {
    ship.y = ship.y - ship.speed;
  }

  if (keys["ArrowDown"] && ship.y + ship.height / 2 < canvas.height) {
    ship.y = ship.y + ship.speed;
  }
}

function moveShots() {
  for (var i = shots.length - 1; i >= 0; i--) {
    shots[i].y = shots[i].y - shots[i].speed;

    if (shots[i].y < -30) {
      shots.splice(i, 1);
    }
  }
}










function moveAliens() {
        alienTimer++;

  var limit = 65 - level * 2;

  if (limit < 22) {
    limit = 22;
  }

  if (alienTimer > limit) {
    createAlien();
    alienTimer = 0;
  }

  for (var i = aliens.length - 1; i >= 0; i--) {
    aliens[i].y = aliens[i].y + aliens[i].speed;

    if (aliens[i].y > canvas.height + 50) {
      aliens.splice(i, 1);
      lives--;

      if (lives <= 0) {
        endGame();
      }
    }
  }
}

function moveBigEnemy() {
    if (bigEnemy === null) {
    return;
  }

  bigEnemy.x = bigEnemy.x + bigEnemy.speed * bigEnemy.direction;

  if (bigEnemy.x < 20 || bigEnemy.x + bigEnemy.width > canvas.width - 20) {
    bigEnemy.direction = bigEnemy.direction * -1;
  }
}

function checkShotAlienHits() {
  for (var s = shots.length - 1; s >= 0; s--) {
    for (var a = aliens.length - 1; a >= 0; a--) {
      if (isTouching(shots[s], aliens[a])) {
        shots.splice(s, 1);
        aliens.splice(a, 1);

        score = score + 10;
        killsInThisLevel++;

        if (killsInThisLevel >= neededKills && bigEnemy === null) {
          nextLevel();
        }

        updateText();
        break;
      }
    }
  }
}


















function checkShotBigEnemyHits() {
  if (bigEnemy === null) {
    return;
  }

  for (var i = shots.length - 1; i >= 0; i--) {
    if (isTouching(shots[i], bigEnemy)) {
      shots.splice(i, 1);
      bigEnemy.health--;
      score = score + 5;

      if (bigEnemy.health <= 0) {
        score = score + 100;
        bigEnemy = null;
        nextLevel();
      }

      updateText();
      break;
    }
  }
}

function checkShipAlienHits() {
  var shipBox = {
    x: ship.x - ship.width / 2,
    y: ship.y - ship.height / 2,
    width: ship.width,
    height: ship.height
  };

  for (var i = aliens.length - 1; i >= 0; i--) {
    if (isTouching(shipBox, aliens[i])) {
      aliens.splice(i, 1);
      lives--;

      if (lives <= 0) {
        endGame();
      }

      updateText();
    }
  }

  if (bigEnemy !== null && isTouching(shipBox, bigEnemy)) {
    lives = 0;
    endGame();
  }
}

function nextLevel() {
  level++;

  if (level > 20) {
    isPlaying = false;
    gameOver = true;
    message.innerText = "You won the game! Press ENTER to restart.";
    return;
  }

  shots = [];
  aliens = [];
  killsInThisLevel = 0;
  neededKills = 8 + level * 2;

  if (level % 5 === 0) {
    createBigEnemy();
  } else {
    message.innerText = "Level " + level;
  }

  updateText();
}

function endGame() {
  isPlaying = false;
  gameOver = true;
  message.innerText = "Game over. Press ENTER to restart.";
}

function isTouching(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function drawBackground() {
  ctx.fillStyle = "#05051a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  for (var i = 0; i < stars.length; i++) {
    ctx.fillRect(stars[i].x, stars[i].y, 2, 2);

    stars[i].y = stars[i].y + stars[i].speed;

    if (stars[i].y > canvas.height) {
      stars[i].y = 0;
      stars[i].x = Math.random() * canvas.width;
    }
  }
}

function block(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}

function drawShip() {
  var p = 6;
  var startX = ship.x - 5 * p;
  var startY = ship.y - 5 * p;




  block(startX + 5 * p, startY + 0 * p, p, "#3e03d2");
  block(startX + 5 * p, startY + 1 * p, p, "#3e03d2");
  block(startX + 5 * p, startY + 2 * p, p, "#3e03d2");

  block(startX + 5 * p, startY + 3 * p, p, "#f2f2f2");
  block(startX + 4 * p, startY + 4 * p, p, "#f2f2f2");
  block(startX + 5 * p, startY + 4 * p, p, "#f2f2f2");
  block(startX + 6 * p, startY + 4 * p, p, "#f2f2f2");

  block(startX + 3 * p, startY + 5 * p, p, "#f2f2f2");
  block(startX + 4 * p, startY + 5 * p, p, "#2f6bff");
  block(startX + 5 * p, startY + 5 * p, p, "#f2f2f2");
  block(startX + 6 * p, startY + 5 * p, p, "#2f6bff");
  block(startX + 7 * p, startY + 5 * p, p, "#f2f2f2");

  block(startX + 2 * p, startY + 6 * p, p, "#f7c948");
  block(startX + 3 * p, startY + 6 * p, p, "#f2f2f2");
  block(startX + 4 * p, startY + 6 * p, p, "#cccccc");
  block(startX + 5 * p, startY + 6 * p, p, "#f2f2f2");
  block(startX + 6 * p, startY + 6 * p, p, "#cccccc");
  block(startX + 7 * p, startY + 6 * p, p, "#f2f2f2");
  block(startX + 8 * p, startY + 6 * p, p, "#0000");

  block(startX + 1 * p, startY + 7 * p, p, "#f7c948");
  block(startX + 3 * p, startY + 7 * p, p, "#f2f2f2");
  block(startX + 5 * p, startY + 7 * p, p, "#2f6bff");
  block(startX + 7 * p, startY + 7 * p, p, "#f2f2f2");
  block(startX + 9 * p, startY + 7 * p, p, "#f7c948");

  block(startX + 4 * p, startY + 8 * p, p, "#ffb000");
  block(startX + 6 * p, startY + 8 * p, p, "#ffb000");
}

function drawShots() {
  for (var i = 0; i < shots.length; i++) {
    ctx.fillStyle = "#ff3b78";
    ctx.fillRect(shots[i].x, shots[i].y, shots[i].width, shots[i].height);

    ctx.fillStyle = "#ffd6e3";
    ctx.fillRect(shots[i].x + 2, shots[i].y - 4, 2, 4);
  }
}

function drawAlienFace(x, y, size) {
  ctx.fillStyle = "#39d353";
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(x + size * 0.35, y + size * 0.38, size * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size * 0.65, y + size * 0.38, size * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(x + size * 0.25, y + size * 0.25);
  ctx.lineTo(x + size * 0.45, y + size * 0.33);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + size * 0.75, y + size * 0.25);
  ctx.lineTo(x + size * 0.55, y + size * 0.33);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + size * 0.32, y + size * 0.68);
  ctx.lineTo(x + size * 0.43, y + size * 0.58);
  ctx.lineTo(x + size * 0.54, y + size * 0.70);
  ctx.lineTo(x + size * 0.66, y + size * 0.58);
  ctx.stroke();
}

function drawAliens() {
  for (var i = 0; i < aliens.length; i++) {
    drawAlienFace(aliens[i].x, aliens[i].y, aliens[i].width);
  }
}

function drawBigEnemy() {
  if (bigEnemy === null) {
    return;
  }

  ctx.fillStyle = "#8a2be2";
  ctx.beginPath();
  ctx.arc(
    bigEnemy.x + bigEnemy.width / 2,
    bigEnemy.y + bigEnemy.height / 2,
    bigEnemy.width / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bigEnemy.x + 60, bigEnemy.y + 42, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(bigEnemy.x + 120, bigEnemy.y + 42, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 6;

  ctx.beginPath();
  ctx.moveTo(bigEnemy.x + 45, bigEnemy.y + 78);
  ctx.lineTo(bigEnemy.x + 70, bigEnemy.y + 65);
  ctx.lineTo(bigEnemy.x + 95, bigEnemy.y + 82);
  ctx.lineTo(bigEnemy.x + 120, bigEnemy.y + 65);
  ctx.lineTo(bigEnemy.x + 145, bigEnemy.y + 78);
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("HP: " + bigEnemy.health, bigEnemy.x + 65, bigEnemy.y - 12);
}

function gameLoop() {
  drawBackground();

  if (isPlaying && !gameOver) {
    moveShip();
    moveShots();

    if (bigEnemy === null) {
      moveAliens();
    }

    moveBigEnemy();

    checkShotAlienHits();
    checkShotBigEnemyHits();
    checkShipAlienHits();
  }

  drawShip();
  drawShots();
  drawAliens();
  drawBigEnemy();
  updateText();

  requestAnimationFrame(gameLoop);
}

message.innerText = "Use arrow keys to move. Press space to shoot.";
gameLoop();