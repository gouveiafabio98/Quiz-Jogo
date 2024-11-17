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
    color: null
};

let questionText = {
    text: "",
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    textSize: 0,
    textLeading: 0,
    color: null
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
    color: null,
    margin: 0,
    radius: 0
};

let answerTopicText = {
    text: ["A", "B", "C", "D"],
    w: 0,
    h: 0,
    x: [0, 0, 0, 0],
    y: [0, 0, 0, 0],
    color: null,
    textSize: 0,
    textLeading: 0
};

let answerText = {
    text: ["", "", "", ""],
    w: null,
    h: null,
    x: [null, null, null, null],
    y: [null, null, null, null],
    color: null,
    textSize: 0
};

function drawQuestion() {
    // Text Settings
    textFont(mainFont);
    textAlign(LEFT, BASELINE);

    // Draw Question
    push();
    noStroke();
    translate(width / 2, height / 2 - questionBox.y - questionBox.h / 2);

    //Question Box
    fill(questionBox.color);
    rect(questionBox.x, questionBox.y, questionBox.w, questionBox.h, topicBox.radius);

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
    text(topicText.text, topicText.x, topicText.y, topicText.w);

    // Answer Box
    fill(answerBox.color);
    for (let i = 0; i < 4; i++) {
        rect(answerBox.x[i], answerBox.y[i], answerBox.w, answerBox.h, answerBox.radius);
    }

    // Answer Topic Text
    fill(answerTopicText.color);
    textAlign(LEFT, CENTER);
    textSize(answerTopicText.textSize);
    textLeading(answerTopicText.textLeading);
    for (let i = 0; i < 4; i++) {
        text(answerTopicText.text[i], answerTopicText.x[i], answerTopicText.y[i],
            answerTopicText.w, answerTopicText.h - textSize() / 2
        );
    }

    // Answer Text
    textAlign(LEFT, CENTER);
    textSize(answerText.textSize);
    textLeading(answerText.textLeading);
    fill(answerText.color);
    for (let i = 0; i < 4; i++) {
        text(answerText.text[i], answerText.x[i], answerText.y[i],
            answerText.w, answerText.h - textSize() / 2
        );
    }

    pop();
}

function updateQuestion() {
    // Set Sizes
    let boxWidth;
    if (width > height)
        boxWidth = width - (width / 4 * inZoom) * 2;
    else
        boxWidth = width - (width / 10 * inZoom) * 2;

    // Question Box
    questionBox.color = color("#F7EDDC");
    questionBox.w = boxWidth;
    questionBox.marginTop = max(min(75, (width / 1920) * 75), 50);
    questionBox.margin = max(min(50, (width / 1920) * 50), 25);
    questionBox.radius = max(min(50, (width / 1920) * 50), 25);

    // Question Text
    questionText.color = color("#6DB671");
    questionText.text = "Lorem ipsum dolor sit amet, consectetuer adipiscing elitt?";
    questionText.w = questionBox.w - questionBox.margin * 2;
    questionText.textSize = max(min(50, (width / 1920) * 50), 25);
    questionText.textLeading = questionText.textSize * 1;
    questionText.h = getTextHeight(questionText);
    questionText.x = -questionText.w / 2;

    // Topic Text
    topicText.color = color("#F7EDDC");
    topicText.text = "Cantanhede".toUpperCase();
    topicText.textSize = max(min(50, (width / 1920) * 50), 25);
    topicText.textLeading = topicText.textSize * 1;
    topicText.w = textWidth(topicText.text);
    topicText.h = questionText.textLeading;

    // Topic Box
    topicBox.color = color("#B25757");
    topicBox.radius = max(min(50, (width / 1920) * 50), 25);
    topicBox.margin = max(min(25, (width / 1920) * 25), 15);
    topicBox.w = topicText.w + topicBox.margin * 2;
    topicBox.h = topicText.h + topicBox.margin * 2;

    // Question Box
    questionBox.x = -questionBox.w / 2;
    questionBox.y = -questionText.y - questionText.textLeading - questionBox.marginTop;

    // Topic Box
    topicBox.x = questionBox.x;
    topicBox.y = questionBox.y - topicBox.h + topicBox.margin;

    // Topic Text
    topicText.x = topicBox.x + topicBox.margin;
    topicText.y = topicBox.y + topicBox.margin + topicText.h;

    // Answer Topic Text
    answerTopicText.color = color("#F7EDDC");
    answerTopicText.textSize = max(min(50, (width / 1920) * 50), 25);
    answerTopicText.textLeading = answerTopicText.textSize * 0.8;

    // Answer Box
    answerBox.color = color("#6DB671");
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
    for (let i = 0; i < 4; i++) {
        let tW = textWidth(answerTopicText.text[i]);
        if (answerTopicText.w < tW) answerTopicText.w = tW;
    }
    answerTopicText.h = answerBox.h;
    // -- X
    answerTopicText.x[0] = answerBox.x[0] + answerBox.margin;
    answerTopicText.x[1] = answerBox.x[1] + answerBox.margin;
    answerTopicText.x[2] = answerBox.x[2] + answerBox.margin;
    answerTopicText.x[3] = answerBox.x[3] + answerBox.margin;
    // -- Y
    answerTopicText.y = answerBox.y;

    // Answer Text
    answerText.color = color("#F7EDDC");
    answerText.text = ["Lorem ipsum dolor, Lorem ipsum dolor", "Lorem ipsum dolor", "Lorem ipsum dolor", "Lorem ipsum dolor"];
    answerText.textSize = max(min(25, (width / 1920) * 25), 15);
    answerText.textLeading = answerText.textSize * 1;
    answerText.w = answerBox.w - answerBox.margin * 3 - answerTopicText.w;
    // -- X
    answerText.x[0] = answerTopicText.x[0] + answerBox.margin + answerTopicText.w;
    answerText.x[1] = answerTopicText.x[1] + answerBox.margin + answerTopicText.w;
    answerText.x[2] = answerTopicText.x[2] + answerBox.margin + answerTopicText.w;
    answerText.x[3] = answerTopicText.x[3] + answerBox.margin + answerTopicText.w;
    // -- Y
    answerText.y = answerTopicText.y;
    answerText.h = answerBox.h;
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