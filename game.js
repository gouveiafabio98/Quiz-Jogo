let offsetX = 0, offsetY = 0;
let targetX = 4578, targetY = 4578;
let panSpeed = 0.1;
let inZoom = 1, outZoom = 0.5;
let currentZoom = inZoom;
let targetZoom = inZoom;

function draw() {
    if (loadPercentage != 1) {
        loadScreen();
    } else {
        background(255);
        updateMapMovement();
        drawMap();
    }
}

function updateMapMovement() {
    offsetX = lerp(offsetX, targetX, panSpeed);
    offsetY = lerp(offsetY, targetY, panSpeed);
    currentZoom = lerp(currentZoom, targetZoom, panSpeed);
}

function drawMap() { // Draw Map Tiles
    imageMode(CORNER);
    offsetX = constrain(offsetX, 0, content.mapImage.d.width - width);
    offsetY = constrain(offsetY, 0, content.mapImage.d.height - height);

    let startCol = floor(offsetX / tileSize);
    let startRow = floor(offsetY / tileSize);
    let endCol = ceil((offsetX + width) / tileSize);
    let endRow = ceil((offsetY + height) / tileSize);

    console.log(startCol, endCol, startRow, endRow);

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