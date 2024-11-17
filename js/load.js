// Map Tiles
let mapTiles = [];
let tileSize = 1024;
let mapCols = 11;
let mapRows = 9;

// Pre-Load Content
let mainFont;
let loadingImg;

// Load Content
let totalAssets;
let content = {
    quizData: {
        src: 'data/topics.json',
        type: 'JSON',
        d: null
    }, roulette: {
        src: 'data/roulette.png',
        type: 'PNG',
        d: null,
        x: 6890,
        y: 5455,
        w: 0,
        h: 0
    }, mill: {
        src: 'data/mill.png',
        type: 'PNG',
        d: null,
        x: 6890,
        y: 5755,
        w: 0,
        h: 0
    }, spinButton: {
        src: 'data/spinButton.png',
        type: 'PNG',
        d: null,
        x: 6890,
        y: 5455,
        interaction: true,
        w: 0,
        h: 0
    }, infoButton: {
        src: 'data/infoButton.png',
        type: 'PNG',
        d: null,
        interaction: true,
        w: 0,
        h: 0
    }
};

// Load Progress
let loadCount = 0;
let loadPercentage = 0;

function preload() { // Preload Content
    mainFont = loadFont('data/fonts/HubotSans_Condensed-ExtraBold.ttf');
    loadingImg = loadImage('data/loadingScreen.png');
}

function setup() { // Setup Content
    createCanvas(windowWidth, windowHeight);

    textFont(mainFont);
    loadContent();
    scaleResize(windowWidth, windowHeight);
}

function loadScreen() { // Loading Screen
    imageMode(CENTER);
    image(loadingImg, 0, 0);

    if (loadPercentage < 1 - 0.01)
        loadPercentage = lerp(loadPercentage, loadCount / totalAssets, loadCount * 0.005);
    else
        loadPercentage = 1;

    fill('#f3edb8');
    rect(width / 2 - width / 3 / 2, 100, width / 3, 50, 50);
    fill('#bcdfe1');
    rect(width / 2 - width / 3 / 2, 100, width / 3 * loadPercentage, 50, 50);
}

function loadContent() { // Function to Load the game content
    totalAssets = Object.keys(content).length + (mapCols * mapRows);
    for (let key in content) {
        if (content[key].type === 'PNG' || content[key].type === 'JPG') {
            content[key].d = loadImage(content[key].src, assetLoaded);
        } else if (content[key].type === 'JSON') {
            content[key].d = loadJSON(content[key].src, assetLoaded);
        }
    }
    loadTiles(); // Function to Load the Pre-Tiled Map
}

function assetLoaded() { // Called for each successful load 
    loadCount++;
    if(totalAssets==loadCount) {
        setData();
        setRoulette();
        newGame();
        updateQuestion();
    }
}

function loadTiles() { // Function to Load the Pre-Tiled Map
    for (let col = 0; col < mapCols; col++) {
        mapTiles[col] = [];
        for (let row = 0; row < mapRows; row++) {
            mapTiles[col][row] = loadImage(`data/tiles/tile_${col}_${row}.png`, assetLoaded);
        }
    }
}

function setData() {
    quizTopics = content.quizData.d.topics.map(topic => topic.topicName);
    numSections = quizTopics.length;
    anglePerSection = TWO_PI / numSections;

    targetX = content.roulette.x - width / 2;
    targetY = content.roulette.y - height / 2
    offsetX = targetX;
    offsetY = targetY;

    for (let key in content) {
        if (content[key].type === 'PNG' || content[key].type === 'JPG') {
            content[key].w = content[key].d.width;
            content[key].h = content[key].d.height;
        }
    }
}