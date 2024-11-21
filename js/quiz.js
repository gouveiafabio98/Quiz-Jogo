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
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    textSize: 0,
    textLeading: 0,
    color: null,
    image: {
        display: true,
        name: false,
        w: 0,
        h: 0,
        mask: null,
        maskW: 0,
        maskH: 0,
        maskX: 0,
        maskY: 0,
        mobile: false,
        hide: true,
        buttonX: 0,
        buttonY: 0,
        buttonW: 0,
        buttonH: 0
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
    margin: 0,
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
    quizData: {
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
let startTime = 0;
let countdownTime = 30;

function drawQuestion() {
    // Text Settings
    textFont(mainFont);
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
    fill(questionText.color);
    textSize(questionText.textSize);
    textLeading(questionText.textLeading);
    text(questionText.text, questionText.x, questionText.y, questionText.w);

    // Topic Text
    fill(topicText.color);
    textSize(topicText.textSize);
    textLeading(topicText.textLeading);
    textAlign(CENTER, CENTER);
    text(topicText.text, topicText.x, topicText.y, topicBox.w, topicBox.h - topicText.textLeading / 2);

    // Answer Box
    for (let i = 0; i < 4; i++) {
        push();
        translate(answerBox.x[i], answerBox.y[i]);
        translate(answerBox.w / 2, answerBox.h / 2);
        if (((!questionText.image.mobile && questionText.image.hide) || questionText.image.mobile) && 
            mouseX > questionBox.translateX + answerBox.x[i] &&
            mouseX < questionBox.translateX + answerBox.x[i] + answerBox.w &&
            mouseY > questionBox.translateY + answerBox.y[i] &&
            mouseY < questionBox.translateY + answerBox.y[i] + answerBox.h && !selectedAnswer) {
            cursorPointer = true;
            scale(1.05);
        }
        translate(-answerBox.w / 2, -answerBox.h / 2);


        if (selectedAnswer != null) {
            if (selectedAnswer == i)
                if (answerText.answer[i]) fill(answerBox.colorActive);
                else fill(answerBox.colorWrong);
            else
                fill(answerBox.colorDisable);
        } else {
            fill(answerBox.colorActive);
        }
        rect(0, 0, answerBox.w, answerBox.h, answerBox.radius);

        if (selectedAnswer != null) {
            if (selectedAnswer == i)
                if (answerText.answer[i]) fill(answerTopicText.colorActive);
                else fill(answerTopicText.colorWrong);
            else
                fill(answerTopicText.colorDisable);
        } else {
            fill(answerTopicText.colorActive);
        }
        rect(0, 0, answerBox.h, answerBox.h, answerBox.radius);

        // Answer Topic Text
        fill(answerTopicText.color);
        textAlign(CENTER, CENTER);
        textSize(answerTopicText.textSize);
        textLeading(answerTopicText.textLeading);
        text(answerTopicText.text[i], 0, 0,
            answerTopicText.w, answerTopicText.h - textSize() / 2
        );

        // Answer Text
        fill(answerText.color);
        textAlign(LEFT, CENTER);
        textSize(answerText.textSize);
        textLeading(answerText.textLeading);
        text(answerText.text[i], answerText.x, 0,
            answerText.w, answerText.h - textSize() / 2
        );

        pop();
    }

    fill(questionBox.color);
    if (questionText.image.display) {
        if (questionText.image.mobile)
            rect(questionBox.x + questionBox.w, questionBox.y, questionText.image.w, questionText.image.h, 0, topicBox.radius, topicBox.radius, 0);
        else {
            imageMode(CORNER);
            image(content.imgButton.d,
                questionText.image.buttonX, questionText.image.buttonY,
                questionText.image.buttonW, questionText.image.buttonH);
        }
        if (questionText.image.mobile || !questionText.image.hide) {
            imageMode(CENTER);
            image(questionText.image.mask, questionText.image.maskX, questionText.image.maskY, questionText.image.maskW, questionText.image.maskH);
        }
    }

    pop();
}

function updateQuestion() {
    let imageQuestion = questionText.image.display;
    questionText.image.mobile = (width > height);

    // Set Sizes
    let boxWidth;
    if (width > height)
        boxWidth = width - (width / 4 * inZoom) * 2;
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
        if(questionText.image.w < 200) questionText.image.mobile = false;
    }

    // Question Text
    questionText.color = color("#6DB671");
    questionText.w = questionBox.w - questionBox.margin * 4;
    questionText.textSize = max(min(50, (width / 1920) * 50), 25);
    questionText.textLeading = questionText.textSize * 1;
    questionText.h = getTextHeight(questionText);

    // Topic Text
    topicText.color = color("#F7EDDC");
    topicText.textSize = max(min(50, (width / 1920) * 50), 25);
    topicText.textLeading = topicText.textSize * 1;
    textSize(topicText.textSize);
    textLeading(topicText.textLeading);
    topicText.w = textWidth(topicText.text);
    topicText.h = questionText.textLeading;

    // Topic Box
    //topicBox.color = color("#B25757");
    topicBox.radius = max(min(50, (width / 1920) * 50), 25);
    topicBox.margin = max(min(25, (width / 1920) * 25), 15);
    topicBox.w = topicText.w + topicBox.margin * 2;
    topicBox.h = topicText.h + topicBox.margin * 2;

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
    topicBox.y = questionBox.y - topicBox.h + topicBox.margin;

    // Topic Text
    topicText.x = topicBox.x;
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
    textSize(answerTopicText.textSize);
    textLeading(answerTopicText.textLeading);
    answerTopicText.w = answerBox.h;
    answerTopicText.h = answerBox.h;
    // -- X
    answerTopicText.x = 0;
    // -- Y
    answerTopicText.y = answerBox.y;

    // Answer Text
    answerText.color = color("#F7EDDC");
    answerText.textSize = max(min(25, (width / 1920) * 25), 15);
    answerText.textLeading = answerText.textSize * 1;
    answerText.w = answerBox.h;
    // -- X
    answerText.x = answerTopicText.w + answerBox.margin;
    // -- Y
    answerText.y = answerTopicText.y;
    answerText.h = answerBox.h;

    questionBox.translateX = width / 2;
    questionBox.translateY = height / 2 - questionBox.y - questionBox.h / 2;

    questionText.image.h = questionBox.h;

    // Button Display Image
    questionText.image.buttonX = questionBox.w / 2 - topicBox.h;
    questionText.image.buttonY = topicBox.y;
    questionText.image.buttonW = topicBox.h;
    questionText.image.buttonH = topicBox.h;

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
        let imgW = quizImages.quizData.d.width;
        let imgH = quizImages.quizData.d.height;
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

        questionText.image.mask = quizImages.quizData.d.get(imgX, imgY, newW, newH);
        questionText.image.mask.mask(maskedImage);
    }
}

function getTextHeight(data) {
    let txt = data.text;
    let w = data.w;

    textFont(mainFont);
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

function answerSelection() {
    for (let i = 0; i < 4; i++) {
        if (mouseX > questionBox.translateX + answerBox.x[i] &&
            mouseX < questionBox.translateX + answerBox.x[i] + answerBox.w &&
            mouseY > questionBox.translateY + answerBox.y[i] &&
            mouseY < questionBox.translateY + answerBox.y[i] + answerBox.h) {
            setScore(i);
        }
    }
    if (mouseX > questionBox.translateX +  questionText.image.buttonX &&
        mouseX < questionBox.translateX + questionText.image.buttonX + questionText.image.buttonW &&
        mouseY > questionBox.translateY + questionText.image.buttonY &&
        mouseY < questionBox.translateY + questionText.image.buttonY + questionText.image.buttonH) {
        questionText.image.hide = !questionText.image.hide;
    }
    console.log(mouseX > questionText.image.buttonX,
        mouseX < questionText.image.buttonX + questionText.image.buttonW,
        mouseY > questionText.image.buttonY,
        mouseY < questionText.image.buttonY + questionText.image.buttonH);
}

function setQuestion(topicId) {
    let topic = content.quizData.d.topics[topicId];
    topicText.text = topic.displayName.toUpperCase();
    topicBox.color = color(topic.fill);

    let question = topic.questions[int(random(topic.questions.length))];
    questionText.text = question.question;
    questionText.image.name = true;

    let answers = shuffleArray(question.answers);
    for (let i = 0; i < answers.length; i++) {
        answerText.text[i] = answers[i].text;
        answerText.answer[i] = answers[i].isCorrect;
    }

    updateQuestion();
    playStage = 3;
    startTime = millis();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setScore(i) {
    if (answerText.answer[i]) rightAnswers++;
    else wrongAnswers++;
    selectedAnswer = i;
    answerSound(answerText.answer[i]);

    setTimeout(() => {
        playStage = 2;
        goToObject(content.roulette);
        rouletteBlock = true;
        selectedAnswer = null;
    }, 2500);
}

function answerSound(answer) {
    if (answer) content.rightSong.d.play();
    else content.wrongSong.d.play();
}