/* Game Logic */
let nRolls = 0;
let totalRolls = 12;
let missingOptions;
let playStage = 0;
// 0 - Boot; 1 - Difficulty; 2 - Roulette; 3 - Question;
let rightAnswers = 0, wrongAnswers = 0;

let cursorPointer = false;

function draw() {
    cursorPointer = false;
    if (playStage == 0) {
        loadScreen();
    } else if(playStage >= 2) {
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
    if(playStage == 0 && loadPercentage == 1) newGame();
    else if (playStage == 2 && rouletteBlock &&
        dist(mouseX, mouseY, content.spinButton.x - offsetX, content.spinButton.y - offsetY) < content.spinButton.d.width / 2 * currentZoom) {
        rouletteRotation();
        rouletteBlock = false;
    } else if(playStage == 3) answerSelection();
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
    drawObject(content.pointer);
    drawObject(content.spinButton, rouletteBlock);

    imageMode(CENTER);
    image(content.infoButton.d,
        width - content.infoButton.d.width * inZoom,
        height - content.infoButton.d.height * inZoom,
        content.infoButton.w * inZoom,
        content.infoButton.h * inZoom
    );

    if(playStage == 3) drawQuestion();

    drawScore();
}

function newGame() {
    nRolls = 0;
    rouletteBlock = true;
    missingOptions = [...quizTopics];
    playStage = 2;
    rightAnswers = 0;
    wrongAnswers = 0;
}

function windowResized() {
    targetX = targetX + width / 2;
    targetY = targetY + height / 2;

    resizeCanvas(windowWidth, windowHeight);

    scaleResize(windowWidth, windowHeight);

    targetX = targetX - windowWidth / 2;
    targetY = targetY - windowHeight / 2;
    
    if(playStage == 3) updateQuestion();
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

function drawScore() {
    textAlign(RIGHT, TOP);
    fill(0);
    text("Pontuação: " + rightAnswers + "/" + totalRolls, width-50, 50);
}