```javascript
// ============================================================
// ONE WRONG TAP
// Version 1.0
// ============================================================


// ============================================================
// ELEMENTS
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


// ============================================================
// GAME VARIABLES
// ============================================================

let score = 0;
let timeLeft = 30;

let gameRunning = false;
let timerInterval = null;


// ============================================================
// START GAME
// ============================================================

function startGame() {

    // Stop any previous timer
    clearInterval(timerInterval);

    score = 0;
    timeLeft = 30;
    gameRunning = true;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    positionTarget();

    timerInterval = setInterval(function () {

        if (!gameRunning) {
            return;
        }

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
// TARGET POSITION
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

    const maxX =
        areaWidth - targetWidth - padding;

    const maxY =
        areaHeight - targetHeight - padding;

    const x =
        padding +
        Math.random() * Math.max(0, maxX);

    const y =
        padding +
        Math.random() * Math.max(0, maxY);

    target.style.position = "absolute";

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
}


// ============================================================
// TARGET TAP
// ============================================================
//
// IMPORTANT:
// We use pointerdown instead of click.
//
// pointerdown works with:
// - Android touch
// - iPhone touch
// - Mouse
// - Stylus
//
// This means the game does NOT depend on mouse clicks.
// ============================================================

target.addEventListener("pointerdown", function (event) {

    event.preventDefault();
    event.stopPropagation();

    if (!gameRunning) {
        return;
    }

    score++;

    scoreDisplay.textContent = score;

    positionTarget();

});


// ============================================================
// START BUTTON
// ============================================================

startButton.addEventListener("pointerdown", function (event) {

    event.preventDefault();

    startGame();

});


// ============================================================
// RESTART BUTTON
// ============================================================

restartButton.addEventListener("pointerdown", function (event) {

    event.preventDefault();

    startGame();

});


// ============================================================
// PREVENT ACCIDENTAL TOUCH BEHAVIOR
// ============================================================

tapArea.addEventListener("touchstart", function (event) {

    event.preventDefault();

}, { passive: false });


// ============================================================
// PREVENT CONTEXT MENU
// ============================================================

document.addEventListener("contextmenu", function (event) {

    event.preventDefault();

});


// ============================================================
// HANDLE SCREEN SIZE CHANGES
// ============================================================

window.addEventListener("resize", function () {

    if (gameRunning) {
        positionTarget();
    }

});


// ============================================================
// INITIAL STATE
// ============================================================

startScreen.classList.remove("hidden");
gameScreen.classList.add("hidden");
gameOverScreen.classList.add("hidden");
```

