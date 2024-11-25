/* Game Logic */
let nRolls = 0;
let totalRolls = 12;
let missingOptions;
let playStage = 0;
let playStageChange = false;
let difficulty = 0; // 0 - Clássico; 1 - Desafio;
let classsicDifficulty = {
    text: "CLÁSSICO",
    textSize: 0,
    textLeading: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    marginW: 0,
    marginH: 0,
    radius: 0,
    color: 255
};

let challengeDifficulty = {
    text: "DESAFIO",
    textSize: 0,
    textLeading: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    marginW: 0,
    marginH: 0,
    radius: 0,
    color: 255
};
// 0 - Boot; 1 - Difficulty; 2 - Roulette; 3 - Question;

let menuPosition = {
    x: 6890,
    y: 4850
};

let cursorPointer = false;

let timerText;

function draw() {
    cursorPointer = false;
    if (playStage == 0) {
        loadScreen();
    } else if (playStage == 1) {
        mainMenu();
    } else if (playStage >= 2) {
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

function mousePressed() {
    if (playStage == 0 && loadPercentage == 1 &&
        mouseX > startButton.translateX - startButton.w / 2 &&
        mouseX < startButton.translateX + startButton.w / 2 &&
        mouseY > startButton.translateY - startButton.h / 2 &&
        mouseY < startButton.translateY + startButton.h / 2) {
        playStage = 1;
        content.clickSound.d.play();
    } else if (playStage == 1) {
        // Dificulty
        if (mouseX > classsicDifficulty.translateX - classsicDifficulty.w / 2 &&
            mouseX < classsicDifficulty.translateX + classsicDifficulty.w / 2 &&
            mouseY > classsicDifficulty.translateY - classsicDifficulty.h / 2 &&
            mouseY < classsicDifficulty.translateY + classsicDifficulty.h / 2) {
            newGame(0);
            content.clickSound.d.play();
        } else if (mouseX > challengeDifficulty.translateX - challengeDifficulty.w / 2 &&
            mouseX < challengeDifficulty.translateX + challengeDifficulty.w / 2 &&
            mouseY > challengeDifficulty.translateY - challengeDifficulty.h / 2 &&
            mouseY < challengeDifficulty.translateY + challengeDifficulty.h / 2) {
            newGame(1);
            content.clickSound.d.play();
        }
    } else if (playStage == 2 && rouletteBlock &&
        // Spin Roulette
        dist(mouseX, mouseY, content.spinButton.x - offsetX, content.spinButton.y - offsetY) < content.spinButton.d.width / 2 * currentZoom) {
        rouletteRotation();
        rouletteBlock = false;
    } else if (playStage == 3) answerSelection();

    if (playStage >= 2 &&
        mouseX > content.backButton.x - content.backButton.w / 2 &&
        mouseX < content.backButton.x + content.backButton.w / 2 &&
        mouseY > content.backButton.y - content.backButton.h / 2 &&
        mouseY < content.backButton.y + content.backButton.h / 2) {
        goBack();
        content.clickSound.d.play();
    }
}

function touchStarted() {
    mousePressed();
    return false;
}

function touchMoved() {
    mousePressed();
    return false;
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

    imageMode(CENTER);
    drawObject(content.pointer);
    drawObject(content.spinButton, rouletteBlock);
    if (playStage == 3) {
        drawQuestion();
        // Timer
        if (difficulty == 1) drawTimer();
    }
    // Score
    textFont(content.HabitasBold.d);
    drawButton(score.text, score.y, score.w, score.h, score.radius, score.translateX, score.translateY, score.textSize);
    // Info
    drawIcon(content.infoButton.d,
        content.infoButton.w, content.infoButton.h,
        content.infoButton.x, content.infoButton.y,
        "#589359", true);
    // Back
    drawIcon(content.backButton.d,
        content.backButton.w, content.backButton.h,
        content.backButton.x, content.backButton.y,
        "#589359", true);
}

function newGame(dif) {
    difficulty = dif;
    nRolls = 0;
    rouletteBlock = true;
    missingOptions = [...quizTopics];
    playStage = 2;
    score.right = 0;
    score.wrong = 0;

    bootZoom = max(width / (tileSize * (mapCols - 1)),
        height / (tileSize * (mapRows - 1)));

    currentZoom = bootZoom;
    targetZoom = bootZoom;
    currentPanSpeed = bootSpeed;

    targetX = (tileSize * mapCols) / 2;
    offsetX = targetX;
    targetY = (tileSize * mapRows) / 2;
    offsetY = targetY;

    setTimeout(function () {
        targetX = content.roulette.x - width / 2;
        targetY = content.roulette.y - height / 2;
        targetZoom = inZoom;
    }, 1500);
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
        outZoom = min(0.2, windowHeight * 0.2 / 1500);
    }
    targetZoom = inZoom;
}

function drawButton(txt, y, w, h, radius, tX, tY, txtSize, color = "#589359", interact = false) {
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    textSize(txtSize);

    push();
    translate(tX, tY);

    if (interact &&
        mouseX > tX - w / 2 && mouseX < tX + w / 2 &&
        mouseY > tY - h / 2 && mouseY < tY + h / 2) {
        cursorPointer = true;
        scale(1.05);
    }

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

    if (!playStageChange) timerText = displayMinutes + ":" + displaySeconds;

    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    textSize(startTime.textSize);
    textLeading(startTime.textLeading);

    let txtColor;
    if (remainingTime % 60 > 10) txtColor = "#589359";
    else txtColor = "#B25757";

    drawButton(timerText, startTime.y, startTime.w, startTime.h, startTime.radius, startTime.translateX, startTime.translateY, startTime.textSize, txtColor)

    if (remainingTime < 0 && !playStageChange) setScore(false, -1);
}

function drawIcon(img, w, h, x, y, color, interact = false) {
    imageMode(CENTER);
    rectMode(CENTER);
    noStroke();
    fill(color);

    push();
    translate(x, y);
    if (interact &&
        mouseX > x - w / 2 && mouseX < x + w / 2 &&
        mouseY > y - h / 2 && mouseY < y + h / 2) {
        cursorPointer = true;
        scale(1.05);
    }

    ellipse(0, 0, w, h);
    image(img, 0, 0, w, h);
    pop();
}

function updateElements() {
    // Timer
    updateTimer();
    // Score
    updateScore();
    // Buttons
    updateButtons();
    // Difficulty
    updateDifficultyButtons();
}

function updateTimer() {
    // Timer
    startTime.textSize = max(min(35, (width / 1920) * 35), 20);
    startTime.radius = max(min(50, (width / 1920) * 50), 25);
    startTime.marginW = max(min(30, (width / 1920) * 30), 20);
    startTime.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(startTime.textSize);
    startTime.w = textWidth("88:88") + startTime.marginW * 2;
    startTime.h = startTime.textSize + startTime.marginH * 2;
    startTime.y = -startTime.textSize / 8;

    startTime.translateX = width - startTime.marginW - startTime.w / 2;
    startTime.translateY = startTime.marginW + startTime.h / 2;
}

function updateScore() {
    textFont(content.HabitasBold.d);
    // Score
    score.text = "PONTUAÇÃO: " + score.right + "/" + score.total;

    score.textSize = max(min(35, (width / 1920) * 35), 20);
    score.radius = max(min(50, (width / 1920) * 50), 25);
    score.marginW = max(min(30, (width / 1920) * 30), 20);
    score.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(score.textSize);
    score.w = textWidth(score.text) + score.marginW * 2;
    score.h = score.textSize + score.marginH * 2;
    score.y = -score.textSize / 8;

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

function updateDifficultyButtons() {
    textFont(content.HabitasBold.d);
    // Classic
    classsicDifficulty.textSize = max(min(50, (width / 1920) * 50), 35);
    classsicDifficulty.radius = max(min(50, (width / 1920) * 50), 25);
    classsicDifficulty.marginW = max(min(30, (width / 1920) * 30), 20);
    classsicDifficulty.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(classsicDifficulty.textSize);
    classsicDifficulty.w = textWidth(classsicDifficulty.text) + classsicDifficulty.marginW * 2;
    classsicDifficulty.h = classsicDifficulty.textSize + classsicDifficulty.marginH * 2;
    classsicDifficulty.y = -classsicDifficulty.h / 10;

    if (width > height) {
        classsicDifficulty.translateX = max(classsicDifficulty.marginW + classsicDifficulty.w / 2,
            width / 2 - classsicDifficulty.marginW * 3 - classsicDifficulty.w / 2);
        classsicDifficulty.translateY = height / 2;
    } else {
        classsicDifficulty.translateX = width / 2;
        classsicDifficulty.translateY = height / 2 - classsicDifficulty.h / 2 - classsicDifficulty.marginW;
    }

    //Challenge
    challengeDifficulty.textSize = max(min(50, (width / 1920) * 50), 35);
    challengeDifficulty.radius = max(min(50, (width / 1920) * 50), 25);
    challengeDifficulty.marginW = max(min(20, (width / 1920) * 20), 15);
    challengeDifficulty.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(challengeDifficulty.textSize);
    challengeDifficulty.w = textWidth(challengeDifficulty.text) + challengeDifficulty.marginW * 2;
    challengeDifficulty.h = challengeDifficulty.textSize + challengeDifficulty.marginH * 2;
    challengeDifficulty.y = -challengeDifficulty.h / 10;

    if (width > height) {
        challengeDifficulty.translateX = min(width - challengeDifficulty.w / 2 - challengeDifficulty.marginW,
            width / 2 + challengeDifficulty.marginW * 3 + challengeDifficulty.w / 2);
        challengeDifficulty.translateY = height / 2;
    } else {
        challengeDifficulty.translateX = width / 2;
        challengeDifficulty.translateY = height / 2 + classsicDifficulty.h / 2 + classsicDifficulty.marginW;
    }
}

function goBack() {
    if (playStage >= 2) {
        playStage = 1;
        goToObject(menuPosition, false, bootZoom);
        isSpinning = false;
        rouletteAngle = rouletteAngle % TWO_PI;
    }
}

function mainMenu() {
    menuWheelRot += 0.01;
    menuScreen();
    textFont(content.HabitasBold.d);
    drawButton(classsicDifficulty.text, classsicDifficulty.y,
        classsicDifficulty.w, classsicDifficulty.h,
        classsicDifficulty.radius, classsicDifficulty.translateX, classsicDifficulty.translateY,
        classsicDifficulty.textSize, "#4DA0C1", true);
    drawButton(challengeDifficulty.text, challengeDifficulty.y,
        challengeDifficulty.w, challengeDifficulty.h,
        challengeDifficulty.radius, challengeDifficulty.translateX, challengeDifficulty.translateY,
        challengeDifficulty.textSize, "#B25757", true);
}