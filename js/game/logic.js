/* Game Logic */
let nRolls = 0;
let totalRolls = 12;
let missingOptions;
let playStage = 0; // Roll, Question

/* Load Content */
let font;
let content = {
    mapImage: {
        src: 'data/map_crop.png',
        type: 'PNG',
        d: null
    },
    rouletteImage: {
        src: 'data/assets/wheel_asset.png',
        type: 'PNG',
        d: null
    },
    millImage: {
        src: 'data/assets/mill_asset.png',
        type: 'PNG',
        d: null
    },
    quizData: {
        src: 'data/topics.json',
        type: 'JSON',
        d: null
    }
};
let loadPercentage = 0;
let boot_background, bootWidth, bootHeight;


let progress = 0, loadCount = 0, totalAssets;

/* Interaction Logic */

function mousePressed() {
    if (playStage == 0)
        rouletteRotation();
}

function keyPressed() {
    if (key === ' ') {
        goToObject("Roulette");
        nextStage();
    }
}

/* Handle window resizing */

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/* New Game */

function newGame() {
    missingOptions = [...quizTopics];
}

function nextStage() {
    // 0 - ROLL
    // 1 - QUESTION
    if (playStage == 0) {
        currentQuestion = selectQuestion(quizTopics[currentTopic]);
        playStage = 1;
    } else if (playStage == 1) {
        playStage = 0;
    }
}

/* Setup Logic */

function preload() {
    font = loadFont('data/fonts/HubotSans_Condensed-ExtraBold.ttf');
    bootBackground = loadImage('data/assets/boot_background.png');
    /*mapImage = loadImage('data/map_crop.png');
    rouletteImage = loadImage('data/assets/wheel_asset.png');
    quizData = loadJSON('data/topics.json');*/
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    loadContent();
    textFont(font);

    bootWidth = width;
    bootHeight = bootBackground.height * bootWidth / bootBackground.width;
}

function draw() {
    if (loadPercentage != 1) {
        noStroke();
        background(255, 0, 0);
        imageMode(CENTER);
        image(bootBackground, width / 2, height / 2, bootWidth, bootHeight);

        if (loadPercentage < 1 - 0.01)
            loadPercentage = lerp(loadPercentage, progress, loadCount * 0.005);
        else
            loadPercentage = 1;

        fill('#f3edb8');
        rect(width / 2 - width / 3 / 2, 100, width / 3, 50, 50);
        fill('#bcdfe1');
        rect(width / 2 - width / 3 / 2, 100, width / 3 * loadPercentage, 50, 50);
    } else {
        // Camera Movement
        updateMapMovement();
        offsetX = constrain(offsetX, 0, scaledWidth - width);
        offsetY = constrain(offsetY, 0, scaledHeight - height);

        imageMode(CORNERS);
        // Display the map
        image(graphicsBuffer, 0, 0, width, height,
            offsetX + (width * (1 - currentZoom) / 2), offsetY + (height * (1 - currentZoom) / 2),
            width * currentZoom, height * currentZoom);

        if (playStage == 1) { // QUESTION
            displayQuestion();
        }

        // Display the Roulette
        updateRoulette();
        drawGraphicsBuffer();

        textAlign(CENTER);
        textSize(30);
    }

}


function loadContent() {
    totalAssets = Object.keys(content).length;
    for (let key in content) {
        if (content[key].type === 'PNG' || content[key].type === 'JPG') {
            content[key].d = loadImage(content[key].src, assetLoaded);
        } else if (content[key].type === 'JSON') {
            content[key].d = loadJSON(content[key].src, assetLoaded);
        }
    }
}

function finishLoad() {
    setData();
}

function assetLoaded() {
    loadCount++;
    progress = loadCount / totalAssets;
    //console.log(progress, loadCount, totalAssets);
    if (loadCount === totalAssets) {
        finishLoad();
        loadMap();
        rouletteX = objectData["Roulette"].x;
        rouletteY = objectData["Roulette"].y;
        initMap(rouletteX, rouletteY);
        newGame();
        progress = 1;
    }
}