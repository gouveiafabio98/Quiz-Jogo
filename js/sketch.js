

/* P5 Functions */
function preload() {
    quizData = loadJSON('data/topics.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    setData();
}

function draw() {
    background(200);
    fill(255);
    rect(10, 10, width - 20, height - 20);
    drawRolette();
}

function mousePressed() {
    if (!isSpinning) {
        isSpinning = true;
        spinSpeed = random(0.2, 0.5);
    }
    console.log(spinSpeed);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}