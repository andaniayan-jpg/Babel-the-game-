var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var scoreText = document.getElementById("scoreText");
var livesText = document.getElementById("livesText");
var levelText = document.getElementById("levelText");
var message = document.getElementById("message");

var keys = {};

var score = 0;
var lives = 3;
var level = 1;

var ship = {
    X: 330,
    y: 420,
    width: 40,
    height: 45,
    speed: 5
};

var stars = [];

for (var i = 0; i <50; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1 + Math.random() * 2

    });
}

document.addEventListener("keydown", function(event) {
  keys[event.code] = true;
});

document.addEventListener("keyup", function(event) {
  keys[event.code] = false;
});

function updateText() {
    scoreText.innerText = score;
    livesText.innerText = lives;
    levelText.innerText = level;
}

function moveShip() {
    if (keys["ArrowLeft"] && ship.x >0 ) {
        ship.x = ship.x - ship.speed;
    }

    if (keys["ArrowRight"] && ship.x + ship.width < canvas.width) {
    ship.x = ship.x + ship.speed;
    }

    if (keys["ArrowUp"] && ship.y > 0) {
        ship.y = ship.y - ship.speed;
    }

    if (keys["ArrowDown"] && ship.y + ship.height < canvas.height) {
        ship.y = ship.y + ship.speed;
    }

}


function drawBackground() {
    ctx.fillStyle = "#05051a";
    ctx.fillReact(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    for (var i = 0; i < stars.length; i++) {
        ctx.fillReact(stars[i].x + stars[i].y, 2, 2);
       
        stars[i].y = stars[i].y + stars[i].speed;

        if (stars[i].y > canvas.height) {
            stars[i].y = 0;
            stars[i].x = Math.random() * canvas.width;
        }

    }
}

function drawShip() {
    ctx.fillStyle = "lightblue";

    ctx.beginPath();
    ctx.moveTo(ship.x + ship.width / 2, ship.y);
    ctx.lineTo(ship.x, ship.y + ship.height);
    ctx.lineTo(ship.x + ship.width, ship.y +ship.height);
    ctx.fill();

    ctx.fillStyle = "blue";
    ctx.fillReact(ship.x + 14, ship.y + 25, 12, 15);



}

function gameLoop() {
    drawBackground();
    moveShip();
    drawShip();
    updateText();

    requestAnimationFrame(gameLoop);

}

message.innerText = "Use arrow keys to move the shippp!!.";
gameLoop();

