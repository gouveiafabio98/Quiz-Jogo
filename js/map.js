// Map Movement Values
let offsetX = 0, offsetY = 0;
let targetX = 0, targetY = 0;
let panSpeed = 0.1;
let bootSpeed = 0.01;
let currentPanSpeed = panSpeed;
let inZoom = 1, outZoom = 0.5;
let bootZoom = 0.4;
let currentZoom = bootZoom;
let targetZoom = bootZoom;

function updateMapMovement() { // Update Map Location
    offsetX = lerp(offsetX, targetX, panSpeed);
    offsetY = lerp(offsetY, targetY, panSpeed);
    currentZoom = lerp(currentZoom, targetZoom, currentPanSpeed);
    currentPanSpeed = lerp(currentPanSpeed, panSpeed, bootSpeed);
}

function drawMap() { // Draw Map Tiles
    imageMode(CORNER);
    offsetX = constrain(offsetX, 0, (mapCols * tileSize) - width);
    offsetY = constrain(offsetY, 0, (mapRows * tileSize) - height);

    let startCol = floor(
        ((offsetX + width / 2) / tileSize) -
        (width / 2 * (1 / currentZoom) / tileSize)
    );
    let endCol = ceil(
        ((offsetX + (width / 2)) / tileSize) +
        (width / 2 * (1 / currentZoom) / tileSize)
    );

    let startRow = floor(
        ((offsetY + height / 2) / tileSize) -
        (height / 2 * (1 / currentZoom) / tileSize)
    );
    let endRow = ceil(
        ((offsetY + height / 2) / tileSize) +
        (height / 2 * (1 / currentZoom) / tileSize)
    );

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

function drawObject(obj, interaction = false) {
    let pX = obj.x - offsetX;
    let pY = obj.y - offsetY;

    push();
    translate(width / 2, height / 2);
    scale(currentZoom);

    if (obj.interaction && interaction &&
        dist(mouseX, mouseY, obj.x - offsetX, obj.y - offsetY) < obj.d.width / 2 * currentZoom) {
        cursorPointer = true;
        scale(1.1);
    }

    translate(-width / 2, -height / 2);

    image(obj.d, pX, pY);
    pop();
}

function goToObject(object, zoomBack = true, zoomOut = outZoom) { // Go to a Selected Object
    let x = object.x, y = object.y;
    goToLocation(x, y, zoomBack, zoomOut); // Go to a Selected Position
}

function goToCity(cityName) { // Go to a Selected City
    let city = content.quizData.d.topics.find(topic => topic.topicName === cityName);
    goToLocation(city.coordinates[0].x, city.coordinates[0].y);  // Go to a Selected Position
}

function goToLocation(x, y, zoomBack = true, zoomOut = outZoom) {  // Go to a Selected Position
    targetX = x - width / 2;
    targetY = y - height / 2;
    targetZoom = zoomOut;

    if (zoomBack)
        setTimeout(() => {
            targetZoom = inZoom;
        }, 1000);
}