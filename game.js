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
                                                speed: speed  });
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
                                                                                                                                                                                                height: ship.height  };

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
                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                          }
                                                                                                                                                                                                                              }
                                                                                                                                                                                                        }
                                                                                                                                                                                                  }
                                                                                                                                                                              }
                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                        }
                                                                                                                                                }
                                                                                                                                              }
                                                                                                                                        }
                                                                                                                                                        }
                                                                                                              }
                                                                                                    }
                                                                                              }
                                                                                        }
                                                                                          }
                                                                                      }
                                                                                }
                                                                                          }
                                                                    }
                                                          }
                                                        }
                                                      }
                                            }
                                                    }
                                          }
                                    }
                                        }
                                      }
                                    }
                                  }
                            }
                              }
                          }
                          })
                }
                    })
                  }
            }
            }
            }
            })
              }
            }
    })
      })
}
}
})
}