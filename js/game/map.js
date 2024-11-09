// Map
let mapImage;
let graphicsBuffer;
// Camera Position
let offsetX, offsetY;
let targetX, targetY;
let panSpeed = 0.05;
// Camera Zoom
let inZoom = .5, outZoom = 1;
let currentZoom = inZoom;
let targetZoom = inZoom;
// Map Boundaries
let scaledWidth, scaledHeight;
// Roulette Map Position
let rouletteX, rouletteY;
// Map Objects
let objectData = {
    "Roulette": {
        "x": 2915,
        "y": 3060
    }
};

/* Map Navigation */

function drawGraphicsBuffer() {
    graphicsBuffer.image(content.mapImage.d, 0, 0);

    graphicsBuffer.imageMode(CENTER);
    graphicsBuffer.image(content.millImage.d, rouletteX, rouletteY+wheelHeight/2.5, millWidth, millHeight);
    graphicsBuffer.imageMode(CORNER);

    drawRoulette(graphicsBuffer);
}

function loadMap() {
    graphicsBuffer = createGraphics(content.mapImage.d.width, content.mapImage.d.height);
    graphicsBuffer.image(content.mapImage.d, 0, 0);
    scaledWidth = content.mapImage.d.width;
    scaledHeight = content.mapImage.d.height;

    graphicsBuffer.image(content.millImage.d, rouletteX, rouletteY);
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
    let city = content.quizData.d.topics.find(topic => topic.topicName === cityName);
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