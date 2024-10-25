/* Quiz Data */
let quizData;
let quizTopics;

/* Roulette Data */
let anglePerSection;
let numSections;
let spinSpeed = 0;
let currentAngle = 0;
let isSpinning = false;

let rouletteSize = 300;

/* Game Functions */
function setData() {
    quizTopics = quizData.topics.map(topic => topic.topicName);

    numSections = quizTopics.length;
    anglePerSection = TWO_PI / numSections;
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
        currentAngle += spinSpeed;
        spinSpeed *= 0.99; // Gradually decrease speed
        if (spinSpeed < 0.01) {
            isSpinning = false; // Stop the roulette when speed is sufficiently low
            // Normalize the angle
            currentAngle = currentAngle % TWO_PI;
            // Adjust calculation to align the angle with the top (12 o'clock position)
            let degrees = (currentAngle * 180 / Math.PI + 90) % 360; // Adjust to 12 o'clock position
            let arcd = (anglePerSection * 180 / Math.PI); // Size of each section in degrees
            // Calculate which section is at the top
            let chosenTopicIndex = Math.floor((360 - degrees) / arcd) % numSections;

            // Add the chosen section to the set
            selectedSections.add(chosenTopicIndex);
            
            // Reset the spinner if all spins are used up
            if (spinsRemaining === 0) {
                selectedSections.clear();
                spinsRemaining = 12;
            }

            // Log chosen topic
            console.log("Chosen Topic:", quizTopics[chosenTopicIndex], chosenTopicIndex, selectedSections);

            goToLocation(quizTopics[chosenTopicIndex]);
        }
    }
}