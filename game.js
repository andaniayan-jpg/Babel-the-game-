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
