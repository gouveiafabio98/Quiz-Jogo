/* Quiz Data */
let quizData;
let quizTopics;
/* Roulette Data */
let anglePerSection;
let numSections;
let rouletteScale = 0.2;
let wheelWidth, wheelHeight;
let millWidth, millHeight;
/* Roulette Rotations */
let currentAngle = 0;
let minRotation = 2;
let maxRotation = 4;
let spinSpeed = 0.01;
let isSpinning = false;
let finalAngle;
let spinButton; // Button Class

let rouletteImage;
let rouletteBuffer;

/* Game Functions */
function setData() {
    quizTopics = content.quizData.d.topics.map(topic => topic.topicName);

    numSections = quizTopics.length;
    anglePerSection = TWO_PI / numSections;
    /* Wheel Image */
    wheelWidth = content.rouletteImage.d.width * rouletteScale;
    wheelHeight = content.rouletteImage.d.height * rouletteScale;
    /* Mill Image */
    millWidth = content.millImage.d.width * rouletteScale;
    millHeight = content.millImage.d.height * rouletteScale;
}

function rouletteRotation() {
    if (!isSpinning && nRolls < totalRolls) {
        if (missingOptions.length >= totalRolls - nRolls) {
            // ---- Forced Rotation
            // Select a random index
            let randomOption = missingOptions[int(random(missingOptions.length))];
            let forcedIndex = quizTopics.indexOf(randomOption);
            // Calculate the Angle of the Desire Section
            let desiredAngle = (HALF_PI * 3 - forcedIndex * anglePerSection - anglePerSection / 2 + TWO_PI) % TWO_PI;
            finalAngle = TWO_PI * int(random(minRotation, maxRotation)) + desiredAngle + random(-anglePerSection / 2 + 0.01, anglePerSection / 2 - 0.01);
        } else {
            // ---- Random Rotation
            finalAngle = TWO_PI * int(random(minRotation, maxRotation)) + random(TWO_PI);
        }
        isSpinning = true;
    }
}

function drawRoulette(map) {
    map.noStroke();

    map.push();
    map.translate(rouletteX, rouletteY);
    map.push();
    map.rotate(currentAngle);
    map.translate(-wheelWidth / 2, -wheelHeight / 2);
    map.image(content.rouletteImage.d, 0, 0, wheelWidth, wheelHeight);
    map.push();
    map.translate(wheelWidth / 2, wheelHeight / 2);

    map.textFont(font);
    map.textAlign(CENTER, BASELINE);
    map.textSize(16 * (wheelWidth / 300));
    map.textLeading(map.textSize()*.8);
    map.fill(0);

    for (let i = 0; i < numSections; i++) {
        // Desenhar o texto do tópico na seção
        let angleText = (i * anglePerSection) + anglePerSection / 2 + HALF_PI;
        map.push();
        map.rotate(angleText);
        map.translate(-wheelWidth/8, -wheelWidth/3.8 - map.textSize());
        map.text(quizTopics[i].toUpperCase(), 0, 0, wheelWidth/4, 100);
        map.pop();
    }

    map.pop();
    map.pop();

    // Desenhar a seta no topo da roleta
    map.stroke(0);
    map.fill('#fed690');
    map.triangle(-10, -10 - wheelWidth / 2.2,
        10, -10 - wheelWidth / 2.2,
        0, 10 - wheelWidth / 2.2); // Draw a downward-pointing triangle


    map.pop();
}

function updateRoulette() {
    if (isSpinning) {
        currentAngle = lerp(currentAngle, finalAngle, spinSpeed);
        if (finalAngle - currentAngle < 0.01) {
            isSpinning = false;
            currentAngle = currentAngle % TWO_PI;

            // Section Obtained
            let degrees = (currentAngle * 180 / PI + 90) % 360;
            let arcd = (anglePerSection * 180 / PI);
            currentTopic = Math.floor((360 - degrees) / arcd) % numSections;

            if (missingOptions.includes(quizTopics[currentTopic])) {
                missingOptions.splice(missingOptions.indexOf(quizTopics[currentTopic]), 1);
            }

            goToCity(quizTopics[currentTopic]);

            nRolls++;
            nextStage();
        }
    }
}