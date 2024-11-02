// Map
let mapImage;
let graphicsBuffer;
// Camera Position
let offsetX, offsetY;
let targetX, targetY;
let panSpeed = 0.05;
// Camera Zoom
let inZoom = 0.5, outZoom = 1;
let currentZoom = inZoom;
let targetZoom = inZoom;
// Map Boundaries
let scaledWidth, scaledHeight;
// Roulette Map Position
let rouletteX, rouletteY;
// Map Objects
let objectData = {
    "Roulette": {
        "x": 2855,
        "y": 1800
    }
};

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

function initMap(x, y) {
    offsetX = x - width / 2;;
    offsetY = y - height / 2;;
    targetX = offsetX;
    targetY = offsetY;
}

function goToObject(objName) {
    let city = objectData[objName];
    let x = city.x, y = city.y;
    goToLocation(x, y);
}

function goToCity(cityName) {
    let city = quizData.topics.find(topic => topic.topicName === cityName);
    goToLocation(city.coordinates[0].x, city.coordinates[0].y);
}


function goToLocation(x, y) {
    targetX = x - width / 2;
    targetY = y - height / 2;
    targetZoom = outZoom;

    setTimeout(() => {
        targetZoom = inZoom;
    }, 1000);
}

function updateMapMovement() {
    offsetX = lerp(offsetX, targetX, panSpeed);
    offsetY = lerp(offsetY, targetY, panSpeed);
    currentZoom = lerp(currentZoom, targetZoom, panSpeed);
}