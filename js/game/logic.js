/* Game Logic */
let nRolls = 0;
let totalRolls = 12;
let missingOptions;
let playStage = 0; // Roll, Question

/* Interaction Logic */

function mousePressed() {
    if(playStage == 0)
        rouletteRotation();
}

function keyPressed() {
    if (key === ' ') {
        goToObject("Roulette");
    }
}

/* Handle window resizing */

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/* New Game */

function newGame() {
    missingOptions = [...quizTopics];
    console.log(missingOptions);
}

/* Setup Logic */

function preload() {
    mapImage = loadImage('data/map.webp');
    quizData = loadJSON('data/topics.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    setData();

    loadMap();

    rouletteX = objectData["Roulette"].x;
    rouletteY = objectData["Roulette"].y;
    initMap(rouletteX, rouletteY);

    newGame();
}

function draw() {
    background(200);

    // Camera Movement
    updateMapMovement();
    offsetX = constrain(offsetX, 0, scaledWidth - width);
    offsetY = constrain(offsetY, 0, scaledHeight - height);

    // Display the map
    image(graphicsBuffer, 0, 0, width, height,
        offsetX + (width * (1 - currentZoom) / 2), offsetY + (height * (1 - currentZoom) / 2),
        width * currentZoom, height * currentZoom);


    // Display the Roulette
    updateRoulette();
    drawGraphicsBuffer();
}