let gameStarted = false;
let gamePaused = false;
let lives = 3;
let timer = 120;
let score = 0;
let fps = 0;
let isLeftArrowPressed = false;
let isRightArrowPressed = false;

let intervalId;
let ballX, ballY, ballSpeedX, ballSpeedY;
let paddleX;

// Initialize bricks before starting the game
createBricks();

document.getElementById("start-button").addEventListener("click", startGame);
document
  .getElementById("restart-button")
  .addEventListener("click", restartGame);

const gameOverMessage = document.getElementById("game-over-message");
const youWinMessage = document.getElementById("you-win-message");
const gameStartMessage = document.getElementById("game-start-message");

document.addEventListener("keydown", function (event) {
  if (event.key === " " || event.key === "Spacebar") {
    gamePaused = !gamePaused;
  }
});

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    lives = 3;
    timer = 120;
    score = 0;
    gameStartMessage.style.display = "none";
    updateDisplay();
    initializeBall();
    intervalId = setInterval(updateGame, 1000 / 60);
    intervalId2 = setInterval(updateTimer, 1000);
    updateFPS();

    if (gamePaused) {
      !gamePaused;
    }
  }
}

function restartGame() {
  clearInterval(intervalId);
  clearInterval(intervalId2);
  document.querySelectorAll(".brick").forEach((brick) => brick.remove());
  createBricks(); // Recreate the bricks
  gameOverMessage.style.display = "none";
  youWinMessage.style.display = "none";
  gameStartMessage.style.display = "block";
  lives = 3;
  timer = 120;
  score = 0;
  updateDisplay();
  initializeBall();
  updateFPS();
}

function initializeBall() {
  ballX = 210;
  ballY = 360;
  ballSpeedX = -4;
  ballSpeedY = -4;
  paddleX = 145;
  document.getElementById("ball").style.left = ballX + "px";
  document.getElementById("ball").style.top = ballY + "px";
  document.getElementById("paddle").style.left = paddleX + "px";
}

function createBricks() {
  const gameContainer = document.getElementById("game-container");
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 5; j++) {
      const brick = document.createElement("div");
      brick.className = "brick";
      brick.style.left = i * 50 + "px";
      brick.style.top = j * 30 + "px";
      gameContainer.appendChild(brick);
    }
  }
}

function updateGame() {
  if (!gamePaused) {
    moveBall();
    checkCollision();
    updateDisplay();
  }
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  document.getElementById("ball").style.left = ballX + "px";
  document.getElementById("ball").style.top = ballY + "px";

  // Ball collision with walls
  if (ballX <= 0 || ballX >= 420) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballY <= 0) {
    ballSpeedY = -ballSpeedY;
  }

  // Ball out of bounds (bottom)
  if (ballY >= 390) {
    lives--;
    if (lives === 0) {
      gameOverMessage.style.display = "block";
      gameOverMessage.textContent = "Game Over";
      endGame();
    } else {
      initializeBall();
    }
  }
}

function checkCollision() {
  const bricks = document.querySelectorAll(".brick");

  // Ball collision with paddle
  if (
    ballX + 20 >= paddleX &&
    ballX <= paddleX + 150 &&
    ballY + 20 >= 390 &&
    ballY + 20 <= 400
  ) {
    ballSpeedY = -ballSpeedY;
  }

  // Ball collision with bricks
  bricks.forEach((brick) => {
    if (
      ballX + 20 >= brick.offsetLeft &&
      ballX <= brick.offsetLeft + 40 &&
      ballY + 20 >= brick.offsetTop &&
      ballY <= brick.offsetTop + 20
    ) {
      brick.remove();
      ballSpeedY = -ballSpeedY;
      score += 20;
    }
  });

  // Game end when no bricks left
  const remainingBricks = document.querySelectorAll(".brick");
  if (remainingBricks.length === 0) {
    endGame();
    youWinMessage.style.display = "block";
    youWinMessage.textContent = "You WIN!";
  }
}

function updateTimer() {
  if (!gamePaused) {
    if (timer > 0) {
      timer--;
    } else {
      gameOverMessage.style.display = "block";
      gameOverMessage.textContent = "Game Over";
      endGame();
    }
  }
}

function updateDisplay() {
  document.getElementById("lives").textContent = lives;
  document.getElementById("timer").textContent = timer;
  document.getElementById("score").textContent = score;
}

function endGame() {
  gameStarted = false;
  clearInterval(intervalId);
}

function updateFPS() {
  let frames = 0;
  setInterval(() => {
    document.getElementById("fps").textContent = frames;
    frames = 0;
  }, 1000);
  requestAnimationFrame(function loop() {
    frames++;
    requestAnimationFrame(loop);
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    isLeftArrowPressed = true;
  } else if (event.key === "ArrowRight") {
    isRightArrowPressed = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowLeft") {
    isLeftArrowPressed = false;
  } else if (event.key === "ArrowRight") {
    isRightArrowPressed = false;
  }
});

// Update the paddle's position continuously based on the key states
function updatePaddlePosition() {
  if (isLeftArrowPressed && paddleX > 0) {
    paddleX -= 5; // Paddle speed
  } else if (isRightArrowPressed && paddleX < 290) {
    paddleX += 5; // Paddle speed
  }
  document.getElementById("paddle").style.left = paddleX + "px";
}

// Call the function to update the paddle's position continuously
setInterval(updatePaddlePosition, 1000 / 60); // Adjust the interval for smoother or faster movement
