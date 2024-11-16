// Map Tiles
let mapTiles = [];
let mapCols, mapRows;
let tileSize = 512;

// Pre-Load Content
let mainFont;
let loadingImg;

// Load Content
let totalAssets;
let content = {
    mapImage: {
        src: 'data/map.png',
        type: 'PNG',
        d: null
    },
    quizData: {
        src: 'data/topics.json',
        type: 'JSON',
        d: null
    }
};
let progress = 0;
let loadCount = 0;
let loadExtra = 1;
let loadPercentage = 0;

function preload() { // Preload Content
    mainFont = loadFont('data/fonts/HubotSans_Condensed-ExtraBold.ttf');
    loadingImg = loadImage('data/loadingScreen.png');
}

function setup() { // Setup Content
    createCanvas(windowWidth, windowHeight);

    textFont(mainFont);
    loadContent();
}

function loadScreen() {
    imageMode(CENTER);
    image(loadingImg, 0, 0);

    if (loadPercentage < 1 - 0.01)
        loadPercentage = lerp(loadPercentage, progress, loadCount * 0.005);
    else
        loadPercentage = 1;

    fill('#f3edb8');
    rect(width / 2 - width / 3 / 2, 100, width / 3, 50, 50);
    fill('#bcdfe1');
    rect(width / 2 - width / 3 / 2, 100, width / 3 * loadPercentage, 50, 50);
}

function loadContent() { // Function to Load the game content
    totalAssets = Object.keys(content).length;
    for (let key in content) {
        if (content[key].type === 'PNG' || content[key].type === 'JPG') {
            content[key].d = loadImage(content[key].src, assetLoaded);
        } else if (content[key].type === 'JSON') {
            content[key].d = loadJSON(content[key].src, assetLoaded);
        }
    }
}

function assetLoaded() { // Called for each successful load 
    loadCount++;
    progress = loadCount / (totalAssets + loadExtra);

    if (loadCount == totalAssets && content.mapImage.d != null && mapTiles.length == 0) { // Extra Load Iteration to Tile the Map
        //tileMap(content.mapImage.d);
        loadTiles();
        assetLoaded();
    }
}

/*function tileMap(img) { // Function to Tile the Map
    mapCols = ceil(img.width / tileSize);
    mapRows = ceil(img.height / tileSize);

    for (let col = 0; col < mapCols; col++) {
        mapTiles[col] = [];
        for (let row = 0; row < mapRows; row++) {
            let pg = createGraphics(tileSize, tileSize);
            pg.image(
                img,
                0, 0, tileSize, tileSize,
                col * tileSize, row * tileSize, tileSize, tileSize
            );
            mapTiles[col][row] = pg;
        }
    }
}*/

function loadTiles() { // Function to Load the Pre-Tiled Map
    mapCols = ceil(content.mapImage.d.width / tileSize);
    mapRows = ceil(content.mapImage.d.height / tileSize);

    for (let col = 0; col < mapCols; col++) {
        mapTiles[col] = [];
        for (let row = 0; row < mapRows; row++) {
            mapTiles[col][row] = loadImage(`data/tiles/tile_${col}_${row}.png`);
        }
    }
}