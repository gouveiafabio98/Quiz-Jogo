let rouletteGraphic;

/* Roulette Data */
let anglePerSection;
let numSections;

/* Roulette Rotations */
let rouletteAngle = 0;
let minRotation = 2;
let maxRotation = 4;
let spinSpeed = 0.01;
let isSpinning = false;
let finalAngle;

function drawRoulette() {
    let pX = content.roulette.x - offsetX;
    let pY = content.roulette.y - offsetY;

    push();
    translate(width / 2, height / 2);
    scale(currentZoom);
    translate(-width / 2, -height / 2);

    translate(pX, pY);
    rotate(rouletteAngle);
    translate(-pX, -pY);

    image(rouletteGraphic, pX, pY);
    pop();
}

function setRoulette() {
    let w = content.roulette.d.width;
    let h = content.roulette.d.height;
    content.roulette.w = w;
    content.roulette.h = h;

    rouletteGraphic = createGraphics(w, h);
    rouletteGraphic.image(content.roulette.d, 0, 0);

    rouletteGraphic.fill(255);
    rouletteGraphic.textFont(mainFont);
    rouletteGraphic.textAlign(CENTER, BASELINE);
    rouletteGraphic.textSize(16 * (w / 300));
    rouletteGraphic.textLeading(rouletteGraphic.textSize() * 0.8);

    for (let i = 0; i < numSections; i++) {
        // Calculate the angle for each section
        let angleText = (i * anglePerSection) + anglePerSection / 2 + HALF_PI;
        
        rouletteGraphic.push();
        rouletteGraphic.translate(w / 2, h / 2); // Translate to the center of the graphic
        rouletteGraphic.rotate(angleText); // Rotate to the correct angle for each section
        rouletteGraphic.translate(-w / 8, -w / 3.8 - rouletteGraphic.textSize()); // Translate to the text position
        rouletteGraphic.text(quizTopics[i].toUpperCase(), 0, 0, w / 4, 100);
        rouletteGraphic.pop();
    }
}

function updateRoulette() {
    if (isSpinning) {
        rouletteAngle = lerp(rouletteAngle, finalAngle, spinSpeed);
        if (finalAngle - rouletteAngle < 0.01) {
            isSpinning = false;
            rouletteAngle = rouletteAngle % TWO_PI;

            // Section Obtained
            let degrees = (rouletteAngle * 180 / PI + 90) % 360;
            let arcd = (anglePerSection * 180 / PI);
            currentTopic = Math.floor((360 - degrees) / arcd) % numSections;

            if (missingOptions.includes(quizTopics[currentTopic])) {
                missingOptions.splice(missingOptions.indexOf(quizTopics[currentTopic]), 1);
            }

            goToCity(quizTopics[currentTopic]);

            nRolls++;
            //nextStage();
        }
    }
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