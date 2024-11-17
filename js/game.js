/* Game Logic */
let nRolls = 0;
let totalRolls = 12;
let missingOptions;
let playStage = 0;

function draw() {
    if (loadPercentage != 1) {
        loadScreen();
    } else {
        background(255);
        updateMapMovement();
        updateRoulette();

        drawContent(); // Draw all map and assets content
    }
}

function keyPressed() {
    if (key === ' ') {
        goToObject(content.roulette);
    }
}

function mousePressed() {
    if (loadPercentage == 1 && dist(mouseX, mouseY, content.spinButton.x - offsetX, content.spinButton.y - offsetY) < content.spinButton.d.width / 2 * currentZoom) {
        rouletteRotation();
    }
}

function drawContent() { // Draw all map and assets content
    push();
    translate(width / 2, height / 2);
    scale(currentZoom);
    translate(-width / 2, -height / 2);
    drawMap();
    pop();

    drawObject(content.mill);
    drawRoulette();
    drawObject(content.spinButton);

    imageMode(CENTER);
    image(content.infoButton.d,
        width - content.infoButton.d.width,
        height - content.infoButton.d.height,
    );
}

function newGame() {
    nRolls = 0;
    missingOptions = [...quizTopics];
}

function windowResized() {
    targetX = targetX + width / 2;
    targetY = targetY + height / 2;
    resizeCanvas(windowWidth, windowHeight);

    if (windowWidth < windowHeight) {
        inZoom = min(1, windowWidth / 1920);
        outZoom = min(0.5, windowWidth * 0.5 / 1920);
    } else {
        inZoom = min(1, windowHeight / 1080);
        outZoom = min(0.5, windowHeight * 0.5 / 1080);
    }
    targetZoom = inZoom;
    targetX = targetX - windowWidth / 2;
    targetY = targetY - windowHeight / 2;
}