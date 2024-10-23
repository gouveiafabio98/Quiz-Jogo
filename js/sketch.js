/* Quiz Data */
let quizData;
let quizTopics;

/* Roulette Data */
let anglePerSection;
let numSections;
let spinSpeed = 0;
let currentAngle = 0;
let isSpinning = false;

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

/* Game Functions */

function setData() {
    quizTopics = quizData.topics.map(topic => topic.topicName);

    numSections = quizTopics.length;
    anglePerSection = TWO_PI / numSections;
}

function drawRolette() {
    push();
    translate(width / 2, height / 2);
    push();
    rotate(currentAngle);

    for (let i = 0; i < numSections; i++) {
        let startAngle = i * anglePerSection;
        // Alternar cores entre as seções
        if (i % 2 === 0) {
            fill(100, 150, 255);
        } else {
            fill(255, 150, 100);
        }

        // Desenhar cada seção da roleta
        arc(0, 0, 500, 500, startAngle, startAngle + anglePerSection, PIE);

        // Desenhar o texto do tópico na seção
        fill(0);
        textSize(16);
        let angleText = startAngle + anglePerSection / 2;
        push();
        rotate(angleText);
        translate(100, 8);
        text(quizTopics[i], 0, 0);
        pop();
    }
    pop();

    // Desenhar a seta no topo da roleta
    drawPointer();
    pop();

    // Gerenciar a rotação da roleta
    if (isSpinning) {
        currentAngle += spinSpeed;
        spinSpeed *= 0.99; // Diminuir a velocidade gradualmente
    
        if (spinSpeed < 0.01) {
            isSpinning = false; // Parar a roleta quando a velocidade for suficientemente baixa
    
            // Normalizar o ângulo
            currentAngle = currentAngle % TWO_PI;
    
            // Ajustar o cálculo para alinhar o ângulo com a seta no topo (posição 12 horas)
            let degrees = (currentAngle * 180 / Math.PI + 90) % 360; // Ajuste para a posição de 12 horas
            let arcd = (anglePerSection * 180 / Math.PI); // O tamanho de cada seção em graus
    
            // Calcular qual seção está no topo
            let chosenTopicIndex = Math.floor((360 - degrees) / arcd) % numSections;
    
            console.log("Tópico escolhido:", quizTopics[chosenTopicIndex]);
        }
    }
    
}

function drawPointer() {
    // Desenhar uma seta no topo da roleta
    fill(0);
    triangle(-20, -260, 20, -260, 0, -230); // Pequena seta na posição "12 horas"
}
