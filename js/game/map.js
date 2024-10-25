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

function mousePressed() {
    if (!isSpinning) {
        isSpinning = true;
        spinSpeed = random(0.2, 0.5);
    }
    console.log(spinSpeed);
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