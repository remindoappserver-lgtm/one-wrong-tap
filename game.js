```javascript
// ============================================================
// ONE WRONG TAP - GAME.JS
// ============================================================

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const tapArea = document.getElementById("tapArea");
const target = document.getElementById("target");

const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("finalScore");

let score = 0;
let timeLeft = 30;
let gameRunning = false;
let timerInterval = null;


// ============================================================
// START GAME
// ============================================================

function startGame() {

    console.log("START GAME pressed");

    clearInterval(timerInterval);

    score = 0;
    timeLeft = 30;
    gameRunning = true;

    scoreDisplay.textContent = "0";
    timerDisplay.textContent = "30";

    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    positionTarget();

    timerInterval = setInterval(function () {

        timeLeft--;

        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }

    }, 1000);
}


// ============================================================
// END GAME
// ============================================================

function endGame() {

    gameRunning = false;

    clearInterval(timerInterval);

    finalScoreDisplay.textContent = score;

    gameScreen.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
}


// ============================================================
// MOVE TARGET
// ============================================================

function positionTarget() {

    if (!gameRunning) {
        return;
    }

    const areaWidth = tapArea.clientWidth;
    const areaHeight = tapArea.clientHeight;

    const targetWidth = target.offsetWidth;
    const targetHeight = target.offsetHeight;

    const padding = 20;

    const maxX = Math.max(
        0,
        areaWidth - targetWidth - padding * 2
    );

    const maxY = Math.max(
        0,
        areaHeight - targetHeight - padding * 2
    );

    const x =
        padding +
        Math.random() * maxX;

    const y =
        padding +
        Math.random() * maxY;

    target.style.position = "absolute";
    target.style.left = x + "px";
    target.style.top = y + "px";
}


// ============================================================
// TARGET TAP
// ============================================================

function tapTarget(event) {

    event.preventDefault();

    if (!gameRunning) {
        return;
    }

    score++;

    scoreDisplay.textContent = score;

    positionTarget();
}


// ============================================================
// START BUTTON
// ============================================================

// Pointer event - phone + mouse
startButton.addEventListener("pointerdown", function (event) {

    event.preventDefault();

    startGame();

});


// Click fallback
startButton.addEventListener("click", function (event) {

    event.preventDefault();

    if (!gameRunning) {
        startGame();
    }

});


// ============================================================
// RESTART BUTTON
// ============================================================

restartButton.addEventListener("pointerdown", function (event) {

    event.preventDefault();

    startGame();

});


// ============================================================
// TARGET - PHONE + MOUSE
// ============================================================

target.addEventListener("pointerdown", tapTarget);


// Click fallback for target
target.addEventListener("click", function (event) {

    if (gameRunning) {
        tapTarget(event);
    }

});


// ============================================================
// STOP PHONE SCROLLING
// ============================================================

tapArea.addEventListener(
    "touchstart",
    function (event) {
        event.preventDefault();
    },
    { passive: false }
);


// ============================================================
// STOP LONG-PRESS MENU
// ============================================================

document.addEventListener("contextmenu", function (event) {

    event.preventDefault();

});


// ============================================================
// KEEP TARGET INSIDE SCREEN
// ============================================================

window.addEventListener("resize", function () {

    if (gameRunning) {
        positionTarget();
    }

});


// ============================================================
// INITIAL SCREEN
// ============================================================

startScreen.classList.remove("hidden");
gameScreen.classList.add("hidden");
gameOverScreen.classList.add("hidden");

console.log("One Wrong Tap loaded successfully.");
```
