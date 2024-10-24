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
    }
};


// Preload the map image
function preload() {
    mapImage = loadImage('data/map.webp');
    quizData = loadJSON('data/topics.json');
}

// Setup the canvas and graphics buffer
function setup() {
    createCanvas(windowWidth, windowHeight);

    setData();

    graphicsBuffer = createGraphics(mapImage.width, mapImage.height);
    graphicsBuffer.image(mapImage, 0, 0);  // Draw the map onto the offscreen buffer

    // Constrain offsetX and offsetY so the panning doesn't go beyond the map edges
    scaledWidth = mapImage.width;
    scaledHeight = mapImage.height;

    offsetX = cityData["Cantanhede"].x  - width / 2;;
    offsetY = cityData["Cantanhede"].y  - height / 2;;
    targetX = offsetX;
    targetY = offsetY;
}

// Main drawing loop
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

        
    drawRolette();
}

/* Handle window resizing */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/* Function to smoothly pan to a specific location on the map */
function goToLocation(cityName) {
    let city = cityData[cityName];
    let x = city.x, y = city.y;

    targetX = x - width / 2;
    targetY = y - height / 2;
    targetZoom = outZoom;
    // After a delay, zoom back in
    setTimeout(() => {
        targetZoom = inZoom;  // Zoom back to normal (100%)
    }, 1000);  // 1 second delay before zooming back in
}

function updatePan() {
    // Smoothly interpolate towards the target location using lerp
    offsetX = lerp(offsetX, targetX, panSpeed);
    offsetY = lerp(offsetY, targetY, panSpeed);
    currentZoom = lerp(currentZoom, targetZoom, panSpeed);

}

function keyPressed() {
    if (key == '1') {
        goToLocation("Cantanhede"); // Pan to Cantanhede
    }
    if (key == '2') {
        goToLocation("Figueira da Foz"); // Pan to Figueira da Foz
    }
    if (key == '3') {
        goToLocation("Mira"); // Pan to Mira
    }
    if (key == '4') {
        goToLocation("Montemor-o-Velho"); // Pan to Montemor-o-Velho
    }
    if (key == '5') {
        goToLocation("Mealhada"); // Pan to Mealhada
    }
    if (key == '6') {
        goToLocation("Penacova"); // Pan to Penacova
    }
}