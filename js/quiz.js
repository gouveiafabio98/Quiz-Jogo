/* Quiz Data */
let quizTopics;

let questionBox = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    radius: 0,
    marginTop: 0,
    margin: 0,
    color: null,
    translateX: 0,
    translateY: 0
};

let questionText = {
    text: "",
    breakText: "",
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    textSize: 0,
    textLeading: 0,
    color: null,
    image: {
        name: null,
        display: true,
        w: 0,
        h: 0,
        mask: null,
        maskIcon: null,
        maskW: 0,
        maskH: 0,
        maskX: 0,
        maskY: 0,
        mobile: false,
        hide: true,
        maskIconX: 0,
        maskIconY: 0,
        maskIconW: 0,
        maskIconH: 0
    }
};

let topicText = {
    text: "",
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    color: null,
    textSize: 0,
    textLeading: 0
};

let topicBox = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    radius: 0,
    marginW: 0,
    marginH: 0,
    color: null
};

let answerBox = {
    w: 0,
    h: 0,
    x: [0, 0, 0, 0],
    y: [0, 0, 0, 0],
    colorActive: null,
    colorWrong: null,
    colorDisable: null,
    margin: 0,
    radius: 0,
    wTopic: 0
};

let quizImages = {
    img1: {
        src: 'data/img-1.jpg',
        type: 'JPG',
        d: null
    }
}

let answerTopicText = {
    text: ["A", "B", "C", "D"],
    w: 0,
    h: 0,
    x: [0, 0, 0, 0],
    y: [0, 0, 0, 0],
    color: null,
    colorActive: null,
    colorWrong: null,
    colorDisable: null,
    colorTopic: null,
    textSize: 0,
    textLeading: 0
};

let answerText = {
    text: ["", "", "", ""],
    answer: [false, false, false, false],
    w: null,
    h: null,
    x: null,
    y: null,
    color: null,
    textSize: 0
};

let selectedAnswer = null;

let startTime = {
    start: 0,
    textSize: 0,
    textLeading: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    marginW: 0,
    marginH: 0,
    radius: 0
};

let score = {
    text: "PERGUNTA: 0/12",
    textSize: 0,
    textLeading: 0,
    right: 0,
    wrong: 0,
    total: 12,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    marginW: 0,
    marginH: 0,
}

let countdownTime = 30;

function drawQuestion() {
    // Text Settings
    rectMode(CORNER);
    textAlign(LEFT, BASELINE);

    // Draw Question
    push();
    noStroke();
    translate(questionBox.translateX, questionBox.translateY);

    //Question Box
    fill(questionBox.color);
    if (questionText.image.display && questionText.image.mobile) {
        rect(questionBox.x, questionBox.y, questionBox.w, questionBox.h, topicBox.radius, 0, 0, topicBox.radius);
    } else {
        rect(questionBox.x, questionBox.y, questionBox.w, questionBox.h, topicBox.radius);
    }

    // Topic Box
    fill(topicBox.color);
    rect(topicBox.x, topicBox.y, topicBox.w, topicBox.h, topicBox.radius);

    // Question Text
    textFont(content.HabitasBold.d);
    fill(questionText.color);
    textSize(questionText.textSize);
    textLeading(questionText.textLeading);
    text(questionText.text, questionText.x, questionText.y, questionText.w);

    // Topic Text
    textFont(content.HabitasBold.d);
    fill(topicText.color);
    textSize(topicText.textSize);
    textLeading(topicText.textLeading);
    textAlign(LEFT, CENTER);
    text(topicText.text, topicText.x, topicText.y - topicText.textLeading / 6, topicText.w, topicBox.h);

    // Answer Box
    for (let i = 0; i < 4; i++) {
        push();
        translate(answerBox.x[i], answerBox.y[i]);
        translate(answerBox.w / 2, answerBox.h / 2);
        if (!isMobileDevice() &&
            ((!questionText.image.mobile && questionText.image.hide) || questionText.image.mobile) &&
            mouseX > questionBox.translateX + answerBox.x[i] &&
            mouseX < questionBox.translateX + answerBox.x[i] + answerBox.w &&
            mouseY > questionBox.translateY + answerBox.y[i] &&
            mouseY < questionBox.translateY + answerBox.y[i] + answerBox.h && selectedAnswer == null) {
            cursorPointer = true;
            scale(1.05);
        }
        translate(-answerBox.w / 2, -answerBox.h / 2);


        if (selectedAnswer != null) {
            //if (selectedAnswer == i || selectedAnswer == -1)
            if (answerText.answer[i]) fill(answerBox.colorActive);
            else fill(answerBox.colorWrong);
            //else
            //fill(answerBox.colorDisable);
        } else {
            fill(answerBox.colorActive);
        }
        rect(0, 0, answerBox.w, answerBox.h, answerBox.radius);

        if (selectedAnswer != null) {
            //if (selectedAnswer == i)
            if (answerText.answer[i]) fill(answerTopicText.colorActive);
            else fill(answerTopicText.colorWrong);
            //else
            //fill(answerTopicText.colorDisable);
        } else {
            fill(answerTopicText.colorActive);
        }
        rect(0, 0, answerBox.h, answerBox.h, answerBox.radius);

        // Answer Topic Text
        textFont(content.HabitasBold.d);
        fill(answerTopicText.color);
        textAlign(CENTER, CENTER);
        textSize(answerTopicText.textSize);
        textLeading(answerTopicText.textLeading);
        text(answerTopicText.text[i], 0, 0,
            answerTopicText.w, answerTopicText.h - answerTopicText.textLeading / 2
        );

        // Answer Text
        textFont(content.HabitasMedium.d);
        fill(answerText.color);
        textAlign(LEFT, CENTER);
        textSize(answerText.textSize);
        textLeading(answerText.textLeading);
        text(answerText.text[i], answerText.x, 0, answerText.w, answerText.h - answerText.textLeading / 2);

        pop();
    }

    fill(questionBox.color);
    if (questionText.image.display) {
        if (questionText.image.mobile)
            rect(questionBox.x + questionBox.w, questionBox.y, questionText.image.w, questionText.image.h, 0, topicBox.radius, topicBox.radius, 0);
        else {
            imageMode(CORNER);
            if (!questionText.image.hide) {
                tint(150);
            }
            image(questionText.image.maskIcon,
                questionText.image.maskIconX, questionText.image.maskIconY,
                questionText.image.maskIconW, questionText.image.maskIconH);
            tint(255);
            noFill();
            stroke(questionBox.color);
            strokeWeight(4);
            rect(questionText.image.maskIconX, questionText.image.maskIconY,
                questionText.image.maskIconW, questionText.image.maskIconH, topicBox.radius);
            noStroke();
            if (!questionText.image.hide) {
                textSize(topicText.textSize);
                textLeading(topicText.textLeading);
                textAlign(CENTER, CENTER);
                fill(questionBox.color);
                textFont(content.HabitasBold.d);
                text("X", questionText.image.maskIconX, questionText.image.maskIconY,
                    questionText.image.maskIconW, questionText.image.maskIconH - topicText.textLeading / 2);
            }
        }
        if (questionText.image.mobile || !questionText.image.hide) {
            imageMode(CENTER);
            image(questionText.image.mask, questionText.image.maskX, questionText.image.maskY, questionText.image.maskW, questionText.image.maskH);
        }
    }

    pop();
}

async function updateQuestion() {
    let imageQuestion = questionText.image.display;
    questionText.image.mobile = (width > height);

    // Set Sizes
    let boxWidth;
    if (width > height)
        boxWidth = width - (width / 6 * inZoom) * 2;
    else
        boxWidth = width - (width / 10 * inZoom) * 2;

    boxWidth = min(boxWidth, 1080);

    // Question Box
    questionBox.color = color("#F7EDDC");
    questionBox.w = boxWidth;
    questionBox.marginTop = max(min(75, (width / 1920) * 75), 50);
    questionBox.margin = max(min(50, (width / 1920) * 50), 25);
    questionBox.radius = max(min(50, (width / 1920) * 50), 25);

    if (questionText.image.display && width - boxWidth > questionBox.margin * 2) {
        questionText.image.w = min(width - boxWidth - questionBox.margin * 2, 500);
        if (questionText.image.w < 200) questionText.image.mobile = false;
    }

    // Question Text
    textFont(content.HabitasBold.d);
    questionText.color = color("#6DB671");
    questionText.w = questionBox.w - questionBox.margin * 4;
    questionText.textSize = max(min(50, (width / 1920) * 50), 25);
    questionText.textLeading = questionText.textSize * 1;
    questionText.h = getTextHeight(questionText);

    // Topic Text
    textFont(content.HabitasBold.d);
    topicText.color = color("#F7EDDC");
    topicText.textSize = max(min(45, (width / 1920) * 40), 20);
    topicText.textLeading = topicText.textSize * 1;
    textSize(topicText.textSize);
    textLeading(topicText.textLeading);

    // Topic Box
    topicBox.radius = max(min(50, (width / 1920) * 50), 25);
    topicBox.marginW = max(min(35, (width / 1920) * 35), 25);
    topicBox.marginH = max(min(25, (width / 1920) * 25), 15);

    // *-*
    topicText.w = textWidth(topicText.text) + topicBox.marginW/2;
    if (topicText.w > questionBox.w - (topicText.textLeading + topicBox.marginH * 2) - topicBox.marginW * 2) {
        topicText.text = topicText.breakText;
        topicText.w = questionBox.w - (topicText.textLeading + topicBox.marginH * 2) - topicBox.marginW * 2;
        let data = getTextHeightAndMaxWidth(topicText);
        topicText.h = data.textHeight;
        topicText.w = data.maxWidth;
    } else {
        topicText.h = topicText.textLeading;
    }

    topicBox.w = topicText.w + topicBox.marginW * 2;
    topicBox.h = topicText.h + topicBox.marginH * 2;

    // Question Box
    questionBox.x = -questionBox.w / 2;
    questionBox.y = -questionText.y - questionText.textLeading - questionBox.marginTop;

    // Adjust Position for Image
    if (imageQuestion && questionText.image.mobile) {
        questionBox.x = questionBox.x - questionText.image.w / 2;
    }
    questionText.x = questionBox.x + questionBox.margin;

    // Topic Box
    topicBox.x = questionBox.x;
    topicBox.y = questionBox.y - topicBox.h + topicBox.marginW;

    // Topic Text
    topicText.x = topicBox.x + topicBox.marginW;
    topicText.y = topicBox.y;

    // Answer Topic Text
    answerTopicText.color = color("#F7EDDC");
    answerTopicText.colorActive = color("#589359");
    answerTopicText.colorWrong = color("#B25757");
    answerTopicText.colorDisable = color("#596770");
    answerTopicText.textSize = max(min(50, (width / 1920) * 50), 25);
    answerTopicText.textLeading = answerTopicText.textSize * 0.8;

    // Answer Box
    answerBox.colorActive = color("#6DB671");
    answerBox.colorWrong = color("#E27146");
    answerBox.colorDisable = color("#7A8E9E");
    answerBox.margin = max(min(25, (width / 1920) * 25), 15);
    answerBox.radius = max(min(50, (width / 1920) * 50), 25);
    answerBox.h = answerTopicText.textLeading + answerBox.margin * 2;

    if (width > height) { // Horizontal
        answerBox.w = (questionBox.w - questionBox.margin * 3) / 2;
        // -- X
        answerBox.x[0] = questionBox.x + questionBox.margin;
        answerBox.x[1] = answerBox.x[0];
        answerBox.x[2] = answerBox.x[0] + answerBox.w + questionBox.margin;
        answerBox.x[3] = answerBox.x[2];
        // -- Y
        answerBox.y[0] = questionText.y + questionText.h - questionText.textLeading + questionBox.margin;
        answerBox.y[2] = answerBox.y[0];
        answerBox.y[1] = answerBox.y[0] + answerBox.h + questionBox.margin / 2;
        answerBox.y[3] = answerBox.y[1];

        // Question Box
        questionBox.h = questionText.h + questionBox.marginTop + questionBox.margin +
            answerBox.h * 2 + questionBox.margin / 2 + questionBox.margin;

        if (imageQuestion) questionBox.h = max(questionBox.h, questionText.image.w * 3 / 4);
    } else { // Vertical
        answerBox.w = (questionBox.w - questionBox.margin * 2);
        // -- X
        answerBox.x[0] = questionBox.x + questionBox.margin;
        answerBox.x[1] = answerBox.x[0];
        answerBox.x[2] = answerBox.x[0];
        answerBox.x[3] = answerBox.x[0];
        // -- Y
        answerBox.y[0] = questionText.y + questionText.h - questionText.textLeading + questionBox.margin;
        answerBox.y[1] = answerBox.y[0] + answerBox.h + questionBox.margin / 2;
        answerBox.y[2] = answerBox.y[1] + answerBox.h + questionBox.margin / 2;
        answerBox.y[3] = answerBox.y[2] + answerBox.h + questionBox.margin / 2;

        // Question Box
        questionBox.h = questionText.h + questionBox.marginTop + questionBox.margin +
            answerBox.h * 4 + questionBox.margin / 2 * 3 + questionBox.margin;
    }

    // Answer Topic Text
    textFont(content.HabitasBold.d);
    textSize(answerTopicText.textSize);
    textLeading(answerTopicText.textLeading);
    answerTopicText.w = answerBox.h;
    answerTopicText.h = answerBox.h;
    // -- X
    answerTopicText.x = 0;
    // -- Y
    answerTopicText.y = answerBox.y;

    // Answer Text
    textFont(content.HabitasMedium.d);
    answerText.color = color("#F7EDDC");
    answerText.textSize = max(min(25, (width / 1920) * 25), 15);
    answerText.textLeading = answerText.textSize * 1;
    // -- X
    answerText.x = answerTopicText.w + answerBox.margin;
    // -- Y
    answerText.y = answerTopicText.y;

    answerText.w = answerBox.w - answerText.x;
    answerText.h = answerBox.h;

    questionBox.translateX = width / 2;
    questionBox.translateY = height / 2 - questionBox.y - questionBox.h / 2;

    questionText.image.h = questionBox.h;

    // Masked Image
    if (imageQuestion) {
        if (questionText.image.mobile) {
            questionText.image.maskW = questionText.image.w - questionBox.margin / 2;
            questionText.image.maskH = questionText.image.h - questionBox.margin;

            questionText.image.maskX = questionBox.x + questionBox.w + questionText.image.maskW / 2;
            questionText.image.maskY = questionBox.y + questionText.image.maskH / 2 + questionBox.margin / 2;
        } else {
            questionText.image.maskW = questionBox.w - questionBox.margin * 2;
            questionText.image.maskH = questionBox.h - questionBox.margin - questionBox.marginTop;

            questionText.image.maskX = questionBox.x + questionText.image.maskW / 2 + questionBox.margin;
            questionText.image.maskY = questionBox.y + questionText.image.maskH / 2 + questionBox.marginTop;
        }

        let maskedImage = createGraphics(questionText.image.maskW, questionText.image.maskH);
        maskedImage.noStroke();
        maskedImage.fill(255);
        maskedImage.rect(0, 0,
            questionText.image.maskW, questionText.image.maskH,
            topicBox.radius - questionBox.margin / 2
        );

        let maskRatio = questionText.image.maskW / questionText.image.maskH;
        let imgW = quizImages[questionText.image.name].d.width;
        let imgH = quizImages[questionText.image.name].d.height;
        let newW, newH;

        if (imgW / imgH > maskRatio) {
            newH = imgH;
            newW = imgH * maskRatio;
        } else {
            newW = imgW;
            newH = imgW / maskRatio;
        }

        let imgX = (imgW - newW) / 2;
        let imgY = (imgH - newH) / 2;

        questionText.image.mask = quizImages[questionText.image.name].d.get(imgX, imgY, newW, newH);
        questionText.image.mask.mask(maskedImage);


        // Icon Masked Image
        questionText.image.maskIconW = topicText.textLeading + topicBox.marginH * 2;
        questionText.image.maskIconH = questionText.image.maskIconW;
        questionText.image.maskIconX = questionBox.w / 2 - questionText.image.maskIconH;
        questionText.image.maskIconY = questionBox.y - questionText.image.maskIconH + topicBox.marginW;;

        maskedImage = createGraphics(questionText.image.maskIconW, questionText.image.maskIconH);
        maskedImage.noStroke();
        maskedImage.fill(255);
        maskedImage.rect(0, 0,
            questionText.image.maskIconW, questionText.image.maskIconH,
            topicBox.radius
        );

        maskRatio = questionText.image.maskIconW / questionText.image.maskIconH;

        if (imgW / imgH > maskRatio) {
            newH = imgH;
            newW = imgH;
        } else {
            newW = imgW;
            newH = imgW;
        }

        imgX = (imgW - newW) / 2;
        imgY = (imgH - newH) / 2;

        questionText.image.maskIcon = quizImages[questionText.image.name].d.get(imgX, imgY, newW, newH);
        questionText.image.maskIcon.mask(maskedImage);
    }
    updateElements();
}

function getTextHeight(data) {
    let txt = data.text;
    let w = data.w;

    textAlign(LEFT, BASELINE);
    textSize(data.textSize);
    textLeading(data.textLeading);

    let words = txt.split(" ");
    let lineCount = 0;
    let currentLine = "";
    for (let word of words) {
        let testLine = currentLine + word + " ";
        if (textWidth(testLine) > w) {
            lineCount++;
            currentLine = word + " ";
        } else {
            currentLine = testLine;
        }
    }
    lineCount++;
    let textHeight = lineCount * data.textLeading;
    return textHeight;
}

function getTextHeightAndMaxWidth(data) {
    let txt = data.text;
    let w = data.w;

    textAlign(LEFT, BASELINE);
    textSize(data.textSize);
    textLeading(data.textLeading);

    let words = txt.split(" ");
    let lineCount = 0;
    let currentLine = "";
    let maxWidth = 0;

    for (let word of words) {
        let testLine = currentLine + word + " ";
        let testWidth = textWidth(testLine);
        if (testWidth > w) {
            lineCount++;
            currentLine = word + " ";
            maxWidth = Math.max(maxWidth, textWidth(currentLine));
        } else {
            currentLine = testLine;
            maxWidth = Math.max(maxWidth, testWidth);
        }
    }
    lineCount++;
    let textHeight = lineCount * data.textLeading;

    return {
        textHeight: textHeight,
        maxWidth: maxWidth
    };
}

function answerSelection() {
    for (let i = 0; i < 4; i++) {
        if (((!questionText.image.mobile && questionText.image.hide) || questionText.image.mobile) &&
            mouseX > questionBox.translateX + answerBox.x[i] &&
            mouseX < questionBox.translateX + answerBox.x[i] + answerBox.w &&
            mouseY > questionBox.translateY + answerBox.y[i] &&
            mouseY < questionBox.translateY + answerBox.y[i] + answerBox.h && selectedAnswer == null) {
            setScore(answerText.answer[i], i);
        }
    }
    if (mouseX > questionBox.translateX + questionText.image.maskIconX &&
        mouseX < questionBox.translateX + questionText.image.maskIconX + questionText.image.maskIconW &&
        mouseY > questionBox.translateY + questionText.image.maskIconY &&
        mouseY < questionBox.translateY + questionText.image.maskIconY + questionText.image.maskIconH) {
        questionText.image.hide = !questionText.image.hide;
    }
}

function setQuestion(topicId) {
    let topic = content.quizData.d.topics[topicId];
    topicText.text = topic.displayName.toUpperCase();
    topicText.breakText = topic.topicName.toUpperCase();
    topicBox.color = color(topic.fill);

    let question = topic.questions[int(random(topic.questions.length))];
    questionText.text = question.question;
    questionText.image.name = question.image;
    if (questionText.image.name != null) questionText.image.display = true;
    else questionText.image.display = false;

    let answers = shuffleArray(question.answers);
    for (let i = 0; i < answers.length; i++) {
        answerText.text[i] = answers[i].text;
        answerText.answer[i] = answers[i].isCorrect;
    }

    updateQuestion();
    playStage = 3;
    startTime.start = millis();

    questionText.image.hide = false;
    setTimeout(function () {
        questionText.image.hide = true;
    }, 1500);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setScore(result, id) {
    if (result) score.right++;
    else score.wrong++;
    selectedAnswer = id;
    answerSound(result);
    playStageChange = true;
    updateScore();

    setTimeout(() => {
        if (score.right + score.wrong >= score.total) {
            playStage = 1;
            mapPosition();
        } else {
            playStage = 2;
            goToObject(content.roulette);
        }
        playStageChange = false;
        rouletteBlock = true;
        selectedAnswer = null;
    }, 2500);
}

function answerSound(answer) {
    if (answer) content.rightSound.d.play();
    else content.wrongSound.d.play();
}