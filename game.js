/* =========================================================
   ONE WRONG TAP
   VERSION 2.0

   Monetization-ready edition
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

const coinsEl =
    document.getElementById("coins");

const streakEl =
    document.getElementById("streak");

const challengeTextEl =
    document.getElementById("challengeText");

const challengeProgressEl =
    document.getElementById("challengeProgress");


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

const earnedCoinsEl =
    document.getElementById("earnedCoins");


const shopBtn =
    document.getElementById("shopBtn");

const achievementsBtn =
    document.getElementById("achievementsBtn");

const statsBtn =
    document.getElementById("statsBtn");


const modal =
    document.getElementById("modal");

const modalContent =
    document.getElementById("modalContent");

const closeModalBtn =
    document.getElementById("closeModalBtn");


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEY =
    "oneWrongTapV2";


/* =========================================================
   GAME DATA
========================================================= */

let data =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEY
        ) ||
        "null"
    );


/* =========================================================
   DEFAULT DATA
========================================================= */

if (!data) {

    data = {

        coins: 0,

        best: 0,

        totalGames: 0,

        totalTaps: 0,

        totalWins: 0,

        totalCoinsEarned: 0,

        streak: 0,

        lastPlayedDate: "",

        dailyChallengeDate: "",

        dailyChallengeTarget: 50,

        dailyChallengeBest: 0,

        dailyChallengeComplete: false,

        ownedThemes: [
            "classic"
        ],

        activeTheme: "classic",

        achievements: {},

        soundOn: true

    };

}


/* =========================================================
   SAVE
========================================================= */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* =========================================================
   GAME VARIABLES
========================================================= */

let score = 0;

let level = 1;

let gameRunning = false;

let continued = false;

let continueUsed = false;

let boardRows = 4;

let boardCols = 4;

let dangerIndex = -1;

let currentGameCoins = 0;

let audioContext = null;


/* =========================================================
   THEMES
========================================================= */

const themes = {

    classic: {

        name:
            "Classic",

        price:
            0,

        safe:
            "#ededed",

        danger:
            "#e53935",

        background:
            "#090909"

    },


    gold: {

        name:
            "Gold",

        price:
            250,

        safe:
            "#f6d365",

        danger:
            "#e53935",

        background:
            "#17120a"

    },


    neon: {

        name:
            "Neon",

        price:
            500,

        safe:
            "#00e5ff",

        danger:
            "#ff1744",

        background:
            "#050014"

    },


    ice: {

        name:
            "Ice",

        price:
            750,

        safe:
            "#d8f3ff",

        danger:
            "#ff4567",

        background:
            "#07121a"

    },


    fire: {

        name:
            "Fire",

        price:
            1000,

        safe:
            "#ffb300",

        danger:
            "#ff1744",

        background:
            "#170600"

    }

};


/* =========================================================
   ACHIEVEMENTS
========================================================= */

const achievements = [

    {
        id:
            "first_game",

        icon:
            "🎮",

        name:
            "First Game",

        description:
            "Play your first game.",

        reward:
            25,

        check:
            () =>
                data.totalGames >= 1

    },


    {
        id:
            "score_10",

        icon:
            "⭐",

        name:
            "Getting Started",

        description:
            "Reach 10 points.",

        reward:
            25,

        check:
            () =>
                data.best >= 10

    },


    {
        id:
            "score_50",

        icon:
            "🔥",

        name:
            "On Fire",

        description:
            "Reach 50 points.",

        reward:
            75,

        check:
            () =>
                data.best >= 50

    },


    {
        id:
            "score_100",

        icon:
            "💯",

        name:
            "Century",

        description:
            "Reach 100 points.",

        reward:
            150,

        check:
            () =>
                data.best >= 100

    },


    {
        id:
            "score_250",

        icon:
            "👑",

        name:
            "Elite",

        description:
            "Reach 250 points.",

        reward:
            500,

        check:
            () =>
                data.best >= 250

    },


    {
        id:
            "games_10",

        icon:
            "🎯",

        name:
            "Dedicated",

        description:
            "Play 10 games.",

        reward:
            100,

        check:
            () =>
                data.totalGames >= 10

    },


    {
        id:
            "streak_3",

        icon:
            "🔥",

        name:
            "Three Day Fire",

        description:
            "Reach a 3 day streak.",

        reward:
            100,

        check:
            () =>
                data.streak >= 3

    },


    {
        id:
            "streak_7",

        icon:
            "🏆",

        name:
            "Weekly Warrior",

        description:
            "Reach a 7 day streak.",

        reward:
            300,

        check:
            () =>
                data.streak >= 7

    }

];


/* =========================================================
   INITIALIZE
========================================================= */

prepareDailyChallenge();

applyTheme();

updateUI();

checkAchievements();


/* =========================================================
   DATE
========================================================= */

function todayString() {

    const date =
        new Date();

    return (
        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            date.getDate()
        ).padStart(2, "0")
    );

}


/* =========================================================
   PREPARE DAILY CHALLENGE
========================================================= */

function prepareDailyChallenge() {

    const today =
        todayString();


    if (
        data.dailyChallengeDate !==
        today
    ) {

        data.dailyChallengeDate =
            today;


        data.dailyChallengeTarget =
            50 +
            Math.floor(
                Math.random() *
                3
            ) *
            25;


        data.dailyChallengeBest =
            0;


        data.dailyChallengeComplete =
            false;


        saveData();

    }


    updateDailyUI();

}


/* =========================================================
   DAILY STREAK
========================================================= */

function updateStreak() {

    const today =
        todayString();


    if (
        data.lastPlayedDate ===
        today
    ) {

        return;

    }


    if (
        !data.lastPlayedDate
    ) {

        data.streak =
            1;

    }

    else {

        const previous =
            new Date(
                data.lastPlayedDate
            );


        const current =
            new Date(
                today
            );


        const difference =
            Math.round(
                (
                    current -
                    previous
                ) /
                86400000
            );


        if (
            difference === 1
        ) {

            data.streak++;

        }

        else {

            data.streak =
                1;

        }

    }


    data.lastPlayedDate =
        today;


    saveData();

}


/* =========================================================
   DAILY UI
========================================================= */

function updateDailyUI() {

    streakEl.textContent =
        `${data.streak} DAY${
            data.streak === 1
                ? ""
                : "S"
        }`;


    challengeTextEl.textContent =
        `Reach ${data.dailyChallengeTarget} points`;


    const progress =
        Math.min(
            data.dailyChallengeBest,
            data.dailyChallengeTarget
        );


    challengeProgressEl.textContent =
        `${progress} / ${data.dailyChallengeTarget}`;


    if (
        data.dailyChallengeComplete
    ) {

        challengeProgressEl.textContent =
            "✓ COMPLETE";

    }

}


/* =========================================================
   SOUND
========================================================= */

function ensureAudio() {

    if (
        !data.soundOn
    ) {

        return;

    }


    if (
        !audioContext
    ) {

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
        audioContext.state ===
            "suspended"
    ) {

        audioContext.resume();

    }

}


function beep(
    frequency,
    duration,
    type = "sine",
    volume = 0.035
) {

    if (
        !data.soundOn
    ) {

        return;

    }


    ensureAudio();


    if (
        !audioContext
    ) {

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
        audioContext.currentTime +
        duration
    );


    oscillator.connect(
        gain
    );


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

soundBtn.addEventListener(
    "click",
    () => {

        data.soundOn =
            !data.soundOn;


        saveData();


        updateUI();


        if (
            data.soundOn
        ) {

            beep(
                620,
                .08
            );

        }

    }
);


/* =========================================================
   UPDATE UI
========================================================= */

function updateUI() {

    coinsEl.textContent =
        data.coins;


    bestEl.textContent =
        data.best;


    scoreEl.textContent =
        score;


    levelEl.textContent =
        level;


    soundBtn.textContent =
        data.soundOn
            ? "🔊"
            : "🔇";


    updateDailyUI();

}


/* =========================================================
   START GAME
========================================================= */

startBtn.addEventListener(
    "click",
    () => {

        ensureAudio();

        startGame();

    }
);


restartBtn.addEventListener(
    "click",
    () => {

        ensureAudio();

        startGame();

    }
);


function startGame() {

    updateStreak();


    score =
        0;


    level =
        1;


    currentGameCoins =
        0;


    continueUsed =
        false;


    continued =
        false;


    data.totalGames++;


    saveData();


    updateUI();


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


                if (
                    n > 0
                ) {

                    countdownEl.textContent =
                        n;


                    beep(
                        440 +
                        (3 - n) *
                        70,
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

    if (
        score < 10
    ) {

        return [4, 4];

    }


    if (
        score < 25
    ) {

        return [4, 5];

    }


    if (
        score < 50
    ) {

        return [5, 5];

    }


    if (
        score < 90
    ) {

        return [5, 6];

    }


    if (
        score < 150
    ) {

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

    if (
        !gameRunning
    ) {

        return;

    }


    [
        boardRows,
        boardCols
    ] =
        getBoardSize();


    level =
        getLevel();


    updateUI();


    gameArea.style.gridTemplateColumns =
        `repeat(
            ${boardCols},
            1fr
        )`;


    gameArea.style.gridTemplateRows =
        `repeat(
            ${boardRows},
            1fr
        )`;


    gameArea.innerHTML =
        "";


    const total =
        boardRows *
        boardCols;


    dangerIndex =
        Math.floor(
            Math.random() *
            total
        );


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


    applyTheme();

}


/* =========================================================
   HANDLE TILE
========================================================= */

function handleTile(
    tile,
    index
) {

    if (
        !gameRunning
    ) {

        return;

    }


    data.totalTaps++;


    /*
     =====================================================
     RED TILE
     =====================================================
    */

    if (
        index ===
        dangerIndex
    ) {

        saveData();

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


    /*
     =====================================================
     COINS

     Every safe tap earns 1 coin.
     Bonus coins are added at game end.
     =====================================================
    */

    currentGameCoins++;


    /*
     =====================================================
     DAILY CHALLENGE
     =====================================================
    */

    if (
        score >
        data.dailyChallengeBest
    ) {

        data.dailyChallengeBest =
            score;

    }


    if (
        data.dailyChallengeBest >=
        data.dailyChallengeTarget
    ) {

        if (
            !data.dailyChallengeComplete
        ) {

            data.dailyChallengeComplete =
                true;


            data.coins +=
                100;


            data.totalCoinsEarned +=
                100;

        }

    }


    saveData();


    updateUI();


    /*
     =====================================================
     FLASH
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
        Math.min(
            score,
            80
        ) *
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
     COINS
     =====================================================
    */

    const gameBonus =
        Math.floor(
            score / 10
        );


    const earned =
        currentGameCoins +
        gameBonus;


    data.coins +=
        earned;


    data.totalCoinsEarned +=
        earned;


    earnedCoinsEl.textContent =
        `+${earned}`;


    /*
     =====================================================
     HIGH SCORE
     =====================================================
    */

    const newRecord =
        score >
        data.best;


    if (
        newRecord
    ) {

        data.best =
            score;

    }


    /*
     =====================================================
     DAILY CHALLENGE
     =====================================================
    */

    if (
        score >
        data.dailyChallengeBest
    ) {

        data.dailyChallengeBest =
            score;

    }


    if (
        data.dailyChallengeBest >=
        data.dailyChallengeTarget
    ) {

        data.dailyChallengeComplete =
            true;

    }


    saveData();


    checkAchievements();


    updateUI();


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
     FLASH
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
     RESULT
     =====================================================
    */

    finalScoreEl.textContent =
        score;


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
                data.best -
                score
            );


        recordTextEl.textContent =
            difference === 0
                ? "That is your best score!"
                : `${difference} point${
                    difference === 1
                        ? ""
                        : "s"
                  } away from your record.`;

    }


    /*
     =====================================================
     CONTINUE

     Only one continue per game.
     =====================================================
    */

    if (
        continueUsed
    ) {

        continueBtn.classList.add(
            "hidden"
        );

    }

    else {

        continueBtn.classList.remove(
            "hidden"
        );

    }


    gameOverScreen.classList.remove(
        "hidden"
    );


    /*
     =====================================================
     INTERSTITIAL AD HOOK

     We don't interrupt every game.

     =====================================================
    */

    if (
        data.totalGames % 4 ===
        0
    ) {

        showInterstitialAd();

    }

}


/* =========================================================
   REWARDED AD
========================================================= */

continueBtn.addEventListener(
    "click",
    () => {

        if (
            continueUsed
        ) {

            return;

        }


        continueBtn.disabled =
            true;


        continueBtn.textContent =
            "LOADING AD...";


        /*
         =====================================================
         REAL AD CONNECTION POINT

         When H5 Games Ads / another ad provider is connected,
         the ad should be shown here.

         The player should only receive the reward after
         the provider confirms the rewarded ad was completed.
         =====================================================
        */

        showRewardedAd(
            () => {

                continueUsed =
                    true;


                continueBtn.disabled =
                    false;


                continueBtn.classList.add(
                    "hidden"
                );


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

            }
        );

    }
);


/* =========================================================
   REWARDED AD FUNCTION
========================================================= */

function showRewardedAd(
    rewardCallback
) {

    /*
     =====================================================
     DEMO MODE

     There is currently no advertising SDK connected.

     We simulate the ad so the game can be tested.

     Later this function will contain the real ad provider.
     =====================================================
    */

    setTimeout(
        () => {

            rewardCallback();

        },
        1000
    );

}


/* =========================================================
   INTERSTITIAL AD
========================================================= */

function showInterstitialAd() {

    /*
     =====================================================
     DEMO PLACEHOLDER

     Real H5 Games Ads can be connected here.

     We deliberately do NOT show an ad during gameplay.
     =====================================================
    */

    console.log(
        "Interstitial ad opportunity."
    );

}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function checkAchievements() {

    achievements.forEach(
        achievement => {

            if (
                data.achievements[
                    achievement.id
                ]
            ) {

                return;

            }


            if (
                achievement.check()
            ) {

                data.achievements[
                    achievement.id
                ] =
                    true;


                data.coins +=
                    achievement.reward;


                data.totalCoinsEarned +=
                    achievement.reward;

            }

        }
    );


    saveData();

}


/* =========================================================
   SHOP
========================================================= */

shopBtn.addEventListener(
    "click",
    openShop
);


function openShop() {

    let html = `

        <h2 class="modal-title">
            🎨 THEMES
        </h2>

        <p style="color:#888;font-size:11px;margin-top:-10px;">
            Use your coins to unlock new looks.
        </p>

    `;


    Object.keys(themes).forEach(
        id => {

            const theme =
                themes[id];


            const owned =
                data.ownedThemes.includes(
                    id
                );


            const active =
                data.activeTheme ===
                id;


            html += `

                <div class="shop-item">

                    <div class="shop-info">

                        <div
                            class="theme-preview"
                            style="
                                background:
                                ${theme.safe};
                                border:
                                4px solid
                                ${theme.danger};
                            "
                        ></div>


                        <div>

                            <div class="theme-name">
                                ${theme.name}
                            </div>

                            <div class="theme-price">
                                ${
                                    owned
                                        ? "UNLOCKED"
                                        : `🪙 ${theme.price}`
                                }
                            </div>

                        </div>

                    </div>


                    <button
                        class="shop-action ${
                            active ||
                            owned
                                ? "owned"
                                : ""
                        }"
                        onclick="
                            shopAction('${id}')
                        "
                    >

                        ${
                            active
                                ? "ACTIVE"
                                : owned
                                    ? "USE"
                                    : "BUY"
                        }

                    </button>

                </div>

            `;

        }
    );


    html += `

        <div
            style="
                margin-top:18px;
                padding:14px;
                background:#181818;
                border-radius:12px;
                text-align:center;
            "
        >

            <strong>
                🪙 ${data.coins} COINS
            </strong>

            <p
                style="
                    color:#777;
                    font-size:10px;
                    margin-bottom:0;
                "
            >
                Earn coins by playing.
            </p>

        </div>

    `;


    openModal(
        html
    );

}


/* =========================================================
   SHOP ACTION
========================================================= */

window.shopAction =
    function(id) {

        const theme =
            themes[id];


        if (
            data.ownedThemes.includes(
                id
            )
        ) {

            data.activeTheme =
                id;


            applyTheme();


            saveData();


            openShop();


            return;

        }


        if (
            data.coins <
            theme.price
        ) {

            alert(
                "You don't have enough coins yet."
            );


            return;

        }


        data.coins -=
            theme.price;


        data.ownedThemes.push(
            id
        );


        data.activeTheme =
            id;


        saveData();


        applyTheme();


        updateUI();


        openShop();

    };


/* =========================================================
   APPLY THEME
========================================================= */

function applyTheme() {

    const theme =
        themes[
            data.activeTheme
        ] ||
        themes.classic;


    document.documentElement.style.setProperty(
        "--safe",
        theme.safe
    );


    document.documentElement.style.setProperty(
        "--red",
        theme.danger
    );


    const card =
        document.querySelector(
            ".game-card"
        );


    if (card) {

        card.style.background =
            theme.background;

    }

}


/* =========================================================
   ACHIEVEMENTS MENU
========================================================= */

achievementsBtn.addEventListener(
    "click",
    openAchievements
);


function openAchievements() {

    let html = `

        <h2 class="modal-title">
            🏆 ACHIEVEMENTS
        </h2>

    `;


    achievements.forEach(
        achievement => {

            const unlocked =
                !!data.achievements[
                    achievement.id
                ];


            html += `

                <div
                    class="achievement ${
                        unlocked
                            ? ""
                            : "locked"
                    }"
                >

                    <div class="achievement-icon">
                        ${achievement.icon}
                    </div>


                    <div>

                        <strong>
                            ${achievement.name}
                        </strong>

                        <small>
                            ${achievement.description}
                        </small>

                        <small>
                            Reward: 🪙
                            ${achievement.reward}
                        </small>

                    </div>

                </div>

            `;

        }
    );


    openModal(
        html
    );

}


/* =========================================================
   STATS
========================================================= */

statsBtn.addEventListener(
    "click",
    openStats
);


function openStats() {

    const html = `

        <h2 class="modal-title">
            📊 YOUR STATS
        </h2>


        <div class="stat-row">

            <span>
                Best Score
            </span>

            <strong>
                ${data.best}
            </strong>

        </div>


        <div class="stat-row">

            <span>
                Games Played
            </span>

            <strong>
                ${data.totalGames}
            </strong>

        </div>


        <div class="stat-row">

            <span>
                Safe Taps
            </span>

            <strong>
                ${data.totalTaps}
            </strong>

        </div>


        <div class="stat-row">

            <span>
                Current Streak
            </span>

            <strong>
                ${data.streak} days
            </strong>

        </div>


        <div class="stat-row">

            <span>
                Total Coins Earned
            </span>

            <strong>
                🪙 ${data.totalCoinsEarned}
            </strong>

        </div>


        <div class="stat-row">

            <span>
                Themes Unlocked
            </span>

            <strong>
                ${data.ownedThemes.length}
                / ${Object.keys(themes).length}
            </strong>

        </div>

    `;


    openModal(
        html
    );

}


/* =========================================================
   MODAL
========================================================= */

function openModal(
    html
) {

    modalContent.innerHTML =
        html;


    modal.classList.remove(
        "hidden"
    );

}


function closeModal() {

    modal.classList.add(
        "hidden"
    );

}


closeModalBtn.addEventListener(
    "click",
    closeModal
);


modal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modal
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   MOBILE TOUCH PROTECTION
========================================================= */

gameArea.addEventListener(
    "touchstart",
    event => {

        if (
            gameRunning
        ) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);


gameArea.addEventListener(
    "touchmove",
    event => {

        if (
            gameRunning
        ) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);


/* =========================================================
   FINAL SAVE
========================================================= */

saveData();

updateUI();

applyTheme();
