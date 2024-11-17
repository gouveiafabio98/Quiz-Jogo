/* Quiz Data */
let quizTopics;

/*
function scaleResize(windowWidth, windowHeight) {
    if (windowWidth > windowHeight) {
        inZoom = min(1, windowWidth / 1920);
        outZoom = min(0.5, windowWidth * 0.5 / 1920);
    } else {
        inZoom = min(1, windowHeight / 1500);
        outZoom = min(0.5, windowHeight * 0.5 / 1500);
    }

    targetZoom = inZoom;
}*/

function drawQuestion() {
    // Text Settings
    textFont(mainFont);
    textAlign(LEFT, BASELINE);
    textSize(50);
    textLeading(textSize() * 0.8);

    // Set Sizes
    let boxWidth = width / 2;
    let questionBox = {
        x: -boxWidth / 2,
        y: 0,
        w: boxWidth,
        h: 0,
        radius: 50,
        marginTop: boxWidth * 0.1,
        margin: boxWidth * 0.075,
        color: color("#F7EDDC")
    };

    let questionText = {
        text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elitt?",
        x: 0,
        y: 0,
        w: questionBox.w - questionBox.margin * 2,
        h: null,
        textSize: 50,
        textLeading: textLeading(),
        color: color("#6DB671")
    };
    questionText.h = getTextHeight(questionText.text, questionText.w);
    questionText.x = -questionText.w / 2;

    let topicText = {
        text: "Cantanhede".toUpperCase(),
        x: null,
        y: null,
        w: null,
        h: textLeading(),
        color: color("#F7EDDC")
    }
    topicText.w = textWidth(topicText.text);

    let topicBox = {
        x: null,
        y: null,
        w: null,
        h: null,
        radius: 50,
        margin: 25,
        color: color("#B25757")
    }

    topicBox.w = topicText.w + topicBox.margin * 2;
    topicBox.h = topicText.h + topicBox.margin * 2;

    questionBox.h = questionText.h + questionBox.marginTop + questionBox.margin;
    questionBox.y = -questionText.y - questionText.textLeading - questionBox.marginTop;

    topicBox.x = questionBox.x;
    topicBox.y = questionBox.y - topicBox.h + topicBox.margin;

    topicText.x = topicBox.x + topicBox.margin;
    topicText.y = topicBox.y + topicBox.margin + topicText.h;

    // Draw Question
    push();
    noStroke();
    translate(width / 2, height / 2);

    //Question Box
    fill(questionBox.color);
    rect(questionBox.x, questionBox.y, questionBox.w, questionBox.h, topicBox.radius);

    // Topic Box
    fill(topicBox.color);
    rect(topicBox.x, topicBox.y, topicBox.w, topicBox.h, topicBox.radius);

    // Question Text
    fill(questionText.color);
    text(questionText.text, questionText.x, questionText.y, questionText.w);

    // Topic Text
    fill(topicText.color);
    text(topicText.text, topicText.x, topicText.y, topicText.w);

    pop();
}

function getTextHeight(txt, w) {
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
    let textHeight = lineCount * textLeading();
    return textHeight;
}
