/* Game Logic */
let nRolls = 0;
let totalRolls = 12;
let missingOptions;
let playStage = 0;

let cursorPointer = false;

function draw() {
    cursorPointer = false;
    if (loadPercentage != 1) {
        loadScreen();
    } else {
        background(255);
        updateMapMovement();
        updateRoulette();

        drawContent(); // Draw all map and assets content
    }
    if (cursorPointer) {
        cursor('pointer');
    } else {
        cursor('default');
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
    
    answerSelection();
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
        width - content.infoButton.d.width * inZoom,
        height - content.infoButton.d.height * inZoom,
        content.infoButton.w * inZoom,
        content.infoButton.h * inZoom
    );

    drawQuestion();
}

function newGame() {
    nRolls = 0;
    missingOptions = [...quizTopics];
}

function windowResized() {
    targetX = targetX + width / 2;
    targetY = targetY + height / 2;

    resizeCanvas(windowWidth, windowHeight);

    scaleResize(windowWidth, windowHeight);

    targetX = targetX - windowWidth / 2;
    targetY = targetY - windowHeight / 2;

    updateQuestion();
}

function scaleResize(windowWidth, windowHeight) {
    if (windowWidth > windowHeight) {
        inZoom = min(1, windowWidth / 1920);
        outZoom = min(0.5, windowWidth * 0.5 / 1920);
    } else {
        inZoom = min(1, windowHeight / 1500);
        outZoom = min(0.5, windowHeight * 0.5 / 1500);
    }

    targetZoom = inZoom;
}