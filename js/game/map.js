/* Global Variables */
let mapImage;   // Stores the map image
let graphicsBuffer;  // Offscreen buffer for the large map
let offsetX, offsetY;  // Coordinate of the viewport
let isDragging = false;
let startX, startY;  // Mouse coordinates for dragging
let savedLocations = {};  // Dictionary to store saved positions
let panSpeed = 0.05;
let targetX, targetY;

let inZoom = 0.5, outZoom = 1;

let currentZoom = inZoom;
let targetZoom = inZoom;

let scaledWidth, scaledHeight;

const cityData = {
    "Cantanhede": {
        "x": 2475,
        "y": 1380
    },
    "Figueira da Foz": {
        "x": 2100,
        "y": 1640
    },
    "Mira": {
        "x": 2200,
        "y": 1065
    },
    "Montemor-o-Velho": {
        "x": 2390,
        "y": 1585
    },
    "Mealhada": {
        "x": 2855,
        "y": 1365
    },
    "Penacova": {
        "x": 3455,
        "y": 1478
    },
    "Roulette": {
        "x": 2855,
        "y": 1800
    }
};

let rouletteX = 2855, rouletteY = 1800;

// Preload the map image
function preload() {
    mapImage = loadImage('data/map.webp');
    quizData = loadJSON('data/topics.json');
}

// Setup the canvas and graphics buffer
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    setData();

    loadMap();
    initMap("Roulette");

    rouletteX = cityData["Roulette"].x;
    rouletteY = cityData["Roulette"].y;
}

function draw() {
    background(200);
    // Smooth panning
    updatePan();
    offsetX = constrain(offsetX, 0, scaledWidth - width);
    offsetY = constrain(offsetY, 0, scaledHeight - height);


    // Display the map
    image(graphicsBuffer, 0, 0, width, height,
        offsetX + (width * (1 - currentZoom) / 2), offsetY + (height * (1 - currentZoom) / 2),
        width * currentZoom, height * currentZoom);


    //drawRolette();
    updateRoulette();
    drawGraphicsBuffer();
}







/* Interactions */

let selectedSections = new Set();
let spinsRemaining = 12;
let lastChosenIndex = -1;

function mousePressed() {
    if (!isSpinning) {
        /*if (true) {
            console.log("CURRENT INITIAL ANGLE: ", degrees(currentAngle));
            let forcedIndex = 0;
            let desiredAngle = (HALF_PI * 3 - forcedIndex * anglePerSection - anglePerSection / 2 + TWO_PI) % TWO_PI
            console.log("DESIRE ANGLE: ", degrees(desiredAngle));
            console.log("CALC: ", degrees((desiredAngle - currentAngle + TWO_PI) % TWO_PI));
            //currentAngle = desiredAngle;
            spinSpeed = calculateClockwiseSpinSpeed(currentAngle, desiredAngle);
            isSpinning = true;
        } else {*/
            // Randomly spin
            isSpinning = true;
            spinSpeed = random(0.2, 0.5);
            //console.log("Random");
       // }
    }
}

function calculateClockwiseSpinSpeed(currentAngle, desiredAngle, decelerationFactor = 0.99, minSpeed = 0.01) {
    // Calculate clockwise angular distance
    let angleDifference = (desiredAngle - currentAngle + TWO_PI) % TWO_PI;
        
    // Add additional rotations for sufficient deceleration
    const additionalRotations = TWO_PI * 5; // Example: 5 full rotations
    let totalRotation = angleDifference;// + additionalRotations;
    
    // Calculate the initial speed to reach totalRotation with deceleration, stopping at minSpeed
    let n = 300; // Number of deceleration steps
    let initialSpeed = (totalRotation * (1 - decelerationFactor) + minSpeed * Math.pow(decelerationFactor, n)) / (1 - Math.pow(decelerationFactor, n));
    
    return initialSpeed;
}



function keyPressed() {
    if (key === ' ') {
        goToLocation("Roulette");
    }
}


/* Map Navigation */

function drawGraphicsBuffer() {
    graphicsBuffer.image(mapImage, 0, 0);
    drawRoulette(graphicsBuffer);
}

function loadMap() {
    graphicsBuffer = createGraphics(mapImage.width, mapImage.height);
    graphicsBuffer.image(mapImage, 0, 0);
    scaledWidth = mapImage.width;
    scaledHeight = mapImage.height;

    drawRoulette(graphicsBuffer);
}

function initMap(cityName) {
    let city = cityData[cityName];
    let x = city.x, y = city.y;

    offsetX = x - width / 2;;
    offsetY = y - height / 2;;
    targetX = offsetX;
    targetY = offsetY;
}

function goToLocation(cityName) {
    let city = cityData[cityName];
    let x = city.x, y = city.y;

    targetX = x - width / 2;
    targetY = y - height / 2;
    targetZoom = outZoom;

    setTimeout(() => {
        targetZoom = inZoom;
    }, 1000);
}

function updatePan() {
    offsetX = lerp(offsetX, targetX, panSpeed);
    offsetY = lerp(offsetY, targetY, panSpeed);
    currentZoom = lerp(currentZoom, targetZoom, panSpeed);
}


/* Handle window resizing */

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}