/* Game Logic */
let nRolls = 0;
let totalRolls = 12;
let missingOptions;
let playStage = 0;
let playStageChange = false;
let difficulty = 1; // 0 - Clássico; 1 - Desafio;
// 0 - Boot; 1 - Difficulty; 2 - Roulette; 3 - Question;

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

    if (playStage == 3) {
        drawQuestion();
        // Timer
        if (difficulty == 1) drawTimer();
    }
    // Score
    drawButton(score.text, score.y, score.w, score.h, score.radius, score.translateX, score.translateY);
    // Info
    drawIcon(content.infoButton.d,
        content.infoButton.w, content.infoButton.h,
        content.infoButton.x, content.infoButton.y,
        "#589359");
    // Back
    drawIcon(content.backButton.d,
        content.backButton.w, content.backButton.h,
        content.backButton.x, content.backButton.y,
        "#589359");
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

    if (playStage == 0) updateLoading();
    if (playStage == 3) updateQuestion();

    updateElements();
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

function drawButton(txt, y, w, h, radius, tX, tY, color = "#589359") {
    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    push();
    translate(tX, tY);

    noStroke();
    fill(color);
    rect(0, 0, w, h, radius);

    fill(255);
    text(txt, 0, y);

    pop();
}

function drawTimer() {

    let elapsed = millis() - startTime.start;
    let remainingTime = countdownTime - floor(elapsed / 1000);
    let minutes = max(0, floor(remainingTime / 60));
    let seconds = max(0, remainingTime % 60);

    let displayMinutes = nf(minutes, 2);
    let displaySeconds = nf(seconds, 2);

    let timerText = displayMinutes + ":" + displaySeconds;
    
    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    textSize(startTime.textSize);
    textLeading(startTime.textLeading);

    drawButton(timerText, startTime.y, startTime.w, startTime.h, startTime.radius, startTime.translateX, startTime.translateY, color = "#589359")

    if (remainingTime < 0 && !playStageChange) setScore(false, -1);
}

function drawIcon(img, w, h, x, y, color) {
    imageMode(CENTER);
    rectMode(CENTER);
    noStroke();
    fill(color);
    ellipse(x, y, w, h);
    image(img, x, y, w, h);
}

function updateElements() {
    // Timer
    updateTimer();
    // Score
    updateScore();
    // Buttons
    updateButtons();
}

function updateTimer() {
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
}

function updateScore() {
    // Score
    score.text = "Pontuação: " + score.right + "/" + score.total;

    score.textSize = max(min(50, (width / 1920) * 50), 25);
    score.radius = max(min(50, (width / 1920) * 50), 25);
    score.marginW = max(min(20, (width / 1920) * 20), 15);
    score.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(score.textSize);
    score.w = textWidth(score.text) + score.marginW * 2;
    score.h = score.textSize + score.marginH * 2;
    score.y = -score.h / 10;

    score.translateX = score.marginW + score.w / 2;
    score.translateY = score.marginW + score.h / 2;
}

function updateButtons() {
    // Info Button
    content.infoButton.margin = max(min(20, (width / 1920) * 20), 15);
    content.infoButton.w = max(min(50, (width / 1920) * 50), 25) + content.infoButton.margin;
    content.infoButton.h = content.infoButton.w;
    content.infoButton.x = width - content.infoButton.w / 2 - content.infoButton.margin;
    content.infoButton.y = height - content.infoButton.h / 2 - content.infoButton.margin;

    // Back Button
    content.backButton.margin = max(min(20, (width / 1920) * 20), 15);
    content.backButton.w = max(min(50, (width / 1920) * 50), 25) + content.backButton.margin;
    content.backButton.h = content.backButton.w;
    content.backButton.x = content.backButton.w / 2 + content.backButton.margin;
    content.backButton.y = height - content.backButton.h / 2 - content.backButton.margin;
}