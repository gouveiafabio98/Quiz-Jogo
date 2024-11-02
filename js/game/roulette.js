/* Quiz Data */
let quizData;
let quizTopics;

/* Roulette Data */
let anglePerSection;
let numSections;
let rouletteSize = 300;

/* Roulette Rotations */
let currentAngle = 0;
let minRotation = 2;
let maxRotation = 5;
let isSpinning = false;
let finalAngle;

/* Game Functions */
function setData() {
    quizTopics = quizData.topics.map(topic => topic.topicName);

    numSections = quizTopics.length;
    anglePerSection = TWO_PI / numSections;
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
    map.push();
    map.translate(rouletteX, rouletteY);
    map.push();
    map.rotate(currentAngle);
    for (let i = 0; i < numSections; i++) {
        let startAngle = i * anglePerSection;
        // Alternar cores entre as seções
        if (i % 2 === 0) {
            map.fill(100, 150, 255);
        } else {
            map.fill(255, 150, 100);
        }
        // Desenhar cada seção da roleta
        map.arc(0, 0, rouletteSize, rouletteSize, startAngle, startAngle + anglePerSection, PIE);
        // Desenhar o texto do tópico na seção
        map.fill(0);
        map.textSize(16 * (rouletteSize / 500)); // Adjust text size based on roulette size
        let angleText = startAngle + anglePerSection / 2;
        map.push();
        map.rotate(angleText);
        map.translate(rouletteSize / 5, 8 * (rouletteSize / 500)); // Adjust text position based on roulette size
        map.text(quizTopics[i], 0, 0);
        map.pop();
    }
    map.pop();
    // Desenhar a seta no topo da roleta
    map.fill(0);
    map.triangle(-10, -10 - rouletteSize / 2,
        10, -10 - rouletteSize / 2,
        0, 10 - rouletteSize / 2); // Draw a downward-pointing triangle


    map.pop();
}

function updateRoulette() {
    // Manage the rotation of the roulette
    if (isSpinning) {
        currentAngle = lerp(currentAngle, finalAngle, 0.015);
        if (finalAngle - currentAngle < 0.01) {
            isSpinning = false;
            currentAngle = currentAngle % TWO_PI;

            // Section Obtained
            let degrees = (currentAngle * 180 / PI + 90) % 360;
            let arcd = (anglePerSection * 180 / PI);
            let chosenTopicIndex = Math.floor((360 - degrees) / arcd) % numSections;

            if (missingOptions.includes(quizTopics[chosenTopicIndex])) {
                missingOptions.splice(missingOptions.indexOf(quizTopics[chosenTopicIndex]), 1);
            }

            console.log(quizTopics[chosenTopicIndex]);
            console.log(missingOptions);

            goToCity(quizTopics[chosenTopicIndex]);

            nRolls++;

            console.log("PLAY: " + nRolls + "/" + totalRolls);
        }
    }
}