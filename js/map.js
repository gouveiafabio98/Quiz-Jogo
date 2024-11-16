// Map Movement Values
let offsetX = 0, offsetY = 0;
let targetX = 4578, targetY = 4578;
let panSpeed = 0.1;
let inZoom = 1, outZoom = 0.5;
let currentZoom = inZoom;
let targetZoom = inZoom;

// Map Objects
let mapObjects = {
    "Roulette": {
        "x": 2915,
        "y": 3060
    }
};

function updateMapMovement() { // Update Map Location
    offsetX = lerp(offsetX, targetX, panSpeed);
    offsetY = lerp(offsetY, targetY, panSpeed);
    currentZoom = lerp(currentZoom, targetZoom, panSpeed);
}

function drawMap() { // Draw Map Tiles
    imageMode(CORNER);
    offsetX = constrain(offsetX, 0, (mapCols * tileSize) - width);
    offsetY = constrain(offsetY, 0, (mapRows * tileSize) - height);

    let startCol = floor(offsetX / tileSize);
    let startRow = floor(offsetY / tileSize);
    let endCol = ceil((offsetX + width) / tileSize);
    let endRow = ceil((offsetY + height) / tileSize);

    for (let col = startCol; col < endCol; col++) {
        for (let row = startRow; row < endRow; row++) {
            if (mapTiles[col] && mapTiles[col][row]) {
                image(mapTiles[col][row],
                    (col * tileSize) - offsetX,
                    (row * tileSize) - offsetY);
            }
        }
    }
}

function goToObject(objName) { // Go to a Selected Object
    let city = objectData[objName];
    let x = city.x, y = city.y;
    goToLocation(x, y); // Go to a Selected Position
}

function goToCity(cityName) { // Go to a Selected City
    let city = content.quizData.d.topics.find(topic => topic.topicName === cityName);
    goToLocation(city.coordinates[0].x, city.coordinates[0].y);  // Go to a Selected Position
}

function goToLocation(x, y) {  // Go to a Selected Position
    targetX = x - width / 2;
    targetY = y - height / 2;
    targetZoom = outZoom;

    setTimeout(() => {
        targetZoom = inZoom;
    }, 1000);
}