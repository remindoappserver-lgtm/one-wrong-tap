/* =========================================================
   ONE WRONG TAP
   Version 1.0
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const scoreEl =
    document.getElementById("score");

const bestEl =
    document.getElementById("best");

const levelEl =
    document.getElementById("level");


const startScreen =
    document.getElementById("startScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const gameArea =
    document.getElementById("gameArea");

const countdownEl =
    document.getElementById("countdown");

const flashEl =
    document.getElementById("flash");


const startBtn =
    document.getElementById("startBtn");

const restartBtn =
    document.getElementById("restartBtn");

const continueBtn =
    document.getElementById("continueBtn");

const soundBtn =
    document.getElementById("soundBtn");


const finalScoreEl =
    document.getElementById("finalScore");

const recordTextEl =
    document.getElementById("recordText");

const resultBadgeEl =
    document.getElementById("resultBadge");


/* =========================================================
   STORAGE
========================================================= */

const BEST_KEY =
    "oneWrongTapBestV1";

const SOUND_KEY =
    "oneWrongTapSoundV1";


/* =========================================================
   GAME VARIABLES
========================================================= */

let score = 0;

let level = 1;

let gameRunning = false;

let continued = false;

let soundOn =
    localStorage.getItem(SOUND_KEY) !== "off";

let audioContext = null;


let boardRows = 4;

let boardCols = 4;

let dangerIndex = -1;


let best =
    Number(
        localStorage.getItem(BEST_KEY) || 0
    );


/* =========================================================
   INITIAL DISPLAY
========================================================= */

bestEl.textContent =
    best;

updateSoundButton();

updateStats();


/* =========================================================
   AUDIO
========================================================= */

function ensureAudio() {

    if (!soundOn) {
        return;
    }


    if (!audioContext) {

        const AudioCtx =
            window.AudioContext ||
            window.webkitAudioContext;


        if (AudioCtx) {

            audioContext =
                new AudioCtx();

        }

    }


    if (
        audioContext &&
        audioContext.state === "suspended"
    ) {

        audioContext.resume();

    }

}


/* =========================================================
   BEEP
========================================================= */

function beep(
    frequency,
    duration,
    type = "sine",
    volume = 0.035
) {

    if (!soundOn) {
        return;
    }


    ensureAudio();


    if (!audioContext) {
        return;
    }


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type =
        type;

    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime +
        duration
    );

}


/* =========================================================
   SOUND BUTTON
========================================================= */

function updateSoundButton() {

    soundBtn.textContent =
        soundOn
            ? "🔊"
            : "🔇";


    soundBtn.setAttribute(
        "aria-label",
        soundOn
            ? "Mute sound"
            : "Turn sound on"
    );

}


soundBtn.addEventListener(
    "click",
    () => {

        soundOn =
            !soundOn;


        localStorage.setItem(
            SOUND_KEY,
            soundOn
                ? "on"
                : "off"
        );


        updateSoundButton();


        if (soundOn) {

            beep(
                620,
                .08
            );

        }

    }
);


/* =========================================================
   START BUTTON
========================================================= */

startBtn.addEventListener(
    "click",
    () => {

        ensureAudio();

        startGame();

    }
);


/* =========================================================
   RESTART BUTTON
========================================================= */

restartBtn.addEventListener(
    "click",
    () => {

        ensureAudio();

        startGame();

    }
);


/* =========================================================
   CONTINUE BUTTON
========================================================= */

continueBtn.addEventListener(
    "click",
    () => {

        /*
         =====================================================
         VERSION 1.0

         This simulates a rewarded advertisement.

         Later we can connect a real ad network such as
         Google AdMob when the game becomes a mobile app.
         =====================================================
        */


        continueBtn.disabled =
            true;


        continueBtn.textContent =
            "CONTINUING...";


        setTimeout(
            () => {

                continueBtn.disabled =
                    false;


                continueBtn.textContent =
                    "WATCH AD & CONTINUE";


                continued =
                    true;


                gameOverScreen.classList.add(
                    "hidden"
                );


                beginCountdown(
                    () => {

                        gameRunning =
                            true;


                        buildBoard();

                    }
                );

            },
            650
        );

    }
);


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    score =
        0;


    level =
        1;


    continued =
        false;


    updateStats();


    startScreen.classList.add(
        "hidden"
    );


    gameOverScreen.classList.add(
        "hidden"
    );


    gameArea.classList.remove(
        "hidden"
    );


    beginCountdown(
        () => {

            gameRunning =
                true;


            buildBoard();

        }
    );

}


/* =========================================================
   COUNTDOWN
========================================================= */

function beginCountdown(done) {

    countdownEl.classList.remove(
        "hidden"
    );


    let n =
        3;


    countdownEl.textContent =
        n;


    beep(
        440,
        .08
    );


    const timer =
        setInterval(
            () => {

                n--;


                if (n > 0) {

                    countdownEl.textContent =
                        n;


                    beep(
                        440 +
                        (3 - n) * 70,
                        .08
                    );

                }


                else {

                    countdownEl.textContent =
                        "GO!";


                    beep(
                        800,
                        .12,
                        "square",
                        .025
                    );


                    setTimeout(
                        () => {

                            countdownEl.classList.add(
                                "hidden"
                            );


                            done();

                        },
                        350
                    );


                    clearInterval(
                        timer
                    );

                }

            },
            700
        );

}


/* =========================================================
   BOARD SIZE
========================================================= */

function getBoardSize() {

    /*
     =====================================================
     SCORE 0 - 9
     4 x 4

     SCORE 10 - 24
     4 x 5

     SCORE 25 - 49
     5 x 5

     SCORE 50 - 89
     5 x 6

     SCORE 90 - 149
     6 x 6

     SCORE 150+
     6 x 7
     =====================================================
    */


    if (score < 10) {

        return [4, 4];

    }


    if (score < 25) {

        return [4, 5];

    }


    if (score < 50) {

        return [5, 5];

    }


    if (score < 90) {

        return [5, 6];

    }


    if (score < 150) {

        return [6, 6];

    }


    return [6, 7];

}


/* =========================================================
   LEVEL
========================================================= */

function getLevel() {

    return (
        Math.floor(
            score / 10
        ) + 1
    );

}


/* =========================================================
   BUILD BOARD
========================================================= */

function buildBoard() {

    if (!gameRunning) {
        return;
    }


    [
        boardRows,
        boardCols
    ] =
        getBoardSize();


    level =
        getLevel();


    updateStats();


    gameArea.style.gridTemplateColumns =
        `repeat(${boardCols}, 1fr)`;


    gameArea.style.gridTemplateRows =
        `repeat(${boardRows}, 1fr)`;


    gameArea.innerHTML =
        "";


    const total =
        boardRows *
        boardCols;


    /*
     =====================================================
     RANDOM RED TILE
     =====================================================
    */

    dangerIndex =
        Math.floor(
            Math.random() *
            total
        );


    /*
     =====================================================
     CREATE TILES
     =====================================================
    */

    for (
        let i = 0;
        i < total;
        i++
    ) {

        const tile =
            document.createElement(
                "button"
            );


        tile.type =
            "button";


        tile.className =
            "tile";


        if (
            i ===
            dangerIndex
        ) {

            tile.classList.add(
                "danger"
            );

        }


        tile.addEventListener(
            "click",
            () => {

                handleTile(
                    tile,
                    i
                );

            },
            {
                once: true
            }
        );


        gameArea.appendChild(
            tile
        );

    }

}


/* =========================================================
   HANDLE TILE
========================================================= */

function handleTile(
    tile,
    index
) {

    if (!gameRunning) {
        return;
    }


    /*
     =====================================================
     PLAYER HIT RED
     =====================================================
    */

    if (
        index ===
        dangerIndex
    ) {

        endGame();

        return;

    }


    /*
     =====================================================
     SAFE TILE
     =====================================================
    */

    tile.classList.add(
        "safe-hit"
    );


    score++;


    level =
        getLevel();


    updateStats();


    /*
     =====================================================
     GOOD FLASH
     =====================================================
    */

    flashEl.className =
        "flash good";


    setTimeout(
        () => {

            flashEl.className =
                "flash";

        },
        120
    );


    /*
     =====================================================
     SOUND
     =====================================================
    */

    beep(
        420 +
        Math.min(score, 80) *
        4,
        .045,
        "sine",
        .025
    );


    /*
     =====================================================
     NEXT BOARD
     =====================================================
    */

    setTimeout(
        buildBoard,
        Math.max(
            70,
            170 -
            level * 5
        )
    );

}


/* =========================================================
   END GAME
========================================================= */

function endGame() {

    gameRunning =
        false;


    /*
     =====================================================
     GAME OVER SOUND
     =====================================================
    */

    beep(
        120,
        .25,
        "sawtooth",
        .045
    );


    /*
     =====================================================
     RED FLASH
     =====================================================
    */

    flashEl.className =
        "flash bad";


    setTimeout(
        () => {

            flashEl.className =
                "flash";

        },
        260
    );


    /*
     =====================================================
     CHECK HIGH SCORE
     =====================================================
    */

    const newRecord =
        score > best;


    if (newRecord) {

        best =
            score;


        localStorage.setItem(
            BEST_KEY,
            String(best)
        );

    }


    updateStats();


    finalScoreEl.textContent =
        score;


    /*
     =====================================================
     RESULT MESSAGE
     =====================================================
    */

    if (
        newRecord &&
        score > 0
    ) {

        resultBadgeEl.textContent =
            "NEW RECORD!";


        recordTextEl.textContent =
            "You beat your best score. 🏆";

    }

    else {

        resultBadgeEl.textContent =
            "GAME OVER";


        const difference =
            Math.max(
                0,
                best - score
            );


        if (
            difference === 0
        ) {

            recordTextEl.textContent =
                "That is your best score!";

        }

        else {

            recordTextEl.textContent =
                `${difference} point${
                    difference === 1
                        ? ""
                        : "s"
                } away from your record.`;

        }

    }


    /*
     =====================================================
     SHOW GAME OVER
     =====================================================
    */

    continueBtn.classList.remove(
        "hidden"
    );


    gameOverScreen.classList.remove(
        "hidden"
    );

}


/* =========================================================
   UPDATE STATS
========================================================= */

function updateStats() {

    scoreEl.textContent =
        score;


    bestEl.textContent =
        best;


    levelEl.textContent =
        level;

}


/* =========================================================
   PREVENT MOBILE SCROLLING
========================================================= */

gameArea.addEventListener(
    "touchstart",
    (event) => {

        if (gameRunning) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);


gameArea.addEventListener(
    "touchmove",
    (event) => {

        if (gameRunning) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

updateStats();
