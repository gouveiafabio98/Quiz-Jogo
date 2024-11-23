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
    } else if (playStage >= 2) {
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
    if (playStage == 0 && loadPercentage == 1) newGame();
    else if (playStage == 2 && rouletteBlock &&
        dist(mouseX, mouseY, content.spinButton.x - offsetX, content.spinButton.y - offsetY) < content.spinButton.d.width / 2 * currentZoom) {
        rouletteRotation();
        rouletteBlock = false;
    } else if (playStage == 3) answerSelection();
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

    if (playStage == 3) drawQuestion();

    drawScore();
    drawTimer();
}

function newGame() {
    nRolls = 0;
    rouletteBlock = true;
    missingOptions = [...quizTopics];
    playStage = 2;
    rightAnswers = 0;
    wrongAnswers = 0;
    currentZoom = bootZoom;
    targetZoom = inZoom;
    currentPanSpeed = bootSpeed;
}

function windowResized() {
    targetX = targetX + width / 2;
    targetY = targetY + height / 2;

    resizeCanvas(windowWidth, windowHeight);

    scaleResize(windowWidth, windowHeight);

    targetX = targetX - windowWidth / 2;
    targetY = targetY - windowHeight / 2;

    if (playStage == 3) updateQuestion();
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
    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    push();
    translate(score.translateX, score.translateY);

    noStroke();
    fill("#589359");
    rect(0, 0, score.w, score.h, score.radius);

    fill(255);
    text(score.text, 0, score.y);

    pop();
}

function drawTimer() {
    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    textSize(startTime.textSize);
    textLeading(startTime.textLeading);

    let elapsed = millis() - startTime.start;
    let remainingTime = countdownTime - floor(elapsed / 1000);
    let minutes = max(0, floor(remainingTime / 60));
    let seconds = max(0, remainingTime % 60);

    let displayMinutes = nf(minutes, 2);
    let displaySeconds = nf(seconds, 2);

    let timerText = displayMinutes + ":" + displaySeconds;

    push();
    translate(startTime.translateX, startTime.translateY);

    noStroke();
    fill("#589359");
    rect(0, 0, startTime.w, startTime.h, startTime.radius);

    fill(255);
    text(timerText, 0, startTime.y);

    pop();
}

function updateElements() {
    // Timer
    startTime.textSize = max(min(50, (width / 1920) * 50), 25);
    startTime.radius = max(min(50, (width / 1920) * 50), 25);
    startTime.marginW = max(min(20, (width / 1920) * 20), 15);
    startTime.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(startTime.textSize);
    startTime.w = textWidth("88:88") + startTime.marginW * 2;
    startTime.h = startTime.textSize + startTime.marginH * 2;
    startTime.y = -startTime.h / 10;

    startTime.translateX = width - startTime.marginW - startTime.w / 2;
    startTime.translateY = startTime.marginW + startTime.h / 2;

    // Score
    updateScore();
}

function updateScore() {
    score.text = "Pontuação: " + score.right + "/" + score.total;

    score.textSize = max(min(50, (width / 1920) * 50), 25);
    score.radius = max(min(50, (width / 1920) * 50), 25);
    score.marginW = max(min(20, (width / 1920) * 20), 15);
    score.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(score.textSize);
    score.w = textWidth(score.text) + score.marginW * 2;
    score.h = score.textSize + score.marginH * 2;
    score.y = -score.h / 10;

    score.translateX = score.marginW + score.w/2;
    score.translateY = score.marginW + score.h/2;
}