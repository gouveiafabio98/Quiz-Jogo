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
        y: 5720,
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
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        margin: 0
    }, pointer: {
        src: 'data/pointer.png',
        type: 'PNG',
        d: null,
        x: 6890,
        y: 5340,
        interaction: false,
        w: 0,
        h: 0
    }, rightSong: {
        src: 'data/sound1.wav',
        type: 'WAV',
        d: null
    }, wrongSong: {
        src: 'data/sound2.wav',
        type: 'WAV',
        d: null
    }, backButton: {
        src: 'data/backButton.png',
        type: 'PNG',
        d: null,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        margin: 0
    }
};

// Load Progress
let loadCount = 0;
let loadPercentage = 0;
let loadOuterBar, loadInnerBar, displayInnerBar;

let loadingBackground = {
    w: 0,
    h: 0,
    x: 0,
    y: 0,
}

function preload() { // Preload Content
    mainFont = loadFont('data/fonts/HubotSans_Condensed-ExtraBold.ttf');
    loadingImg = loadImage('data/loadingScreen.png');
}

function setup() { // Setup Content
    createCanvas(windowWidth, windowHeight);

    textFont(mainFont);
    loadContent();
    scaleResize(windowWidth, windowHeight);

    updateLoading();
}

function loadScreen() { // Loading Screen
    imageMode(CORNER);

    image(loadingImg, loadingBackground.x, loadingBackground.y, loadingBackground.w, loadingBackground.h);

    if (loadPercentage < 1 - 0.01)
        loadPercentage = lerp(loadPercentage, loadCount / totalAssets, loadCount * 0.005);
    else {
        loadPercentage = 1;
    }

    // Draw the inner bar
    loadInnerBar.clear();
    loadInnerBar.fill('#bcdfe1');
    loadInnerBar.noStroke();
    loadInnerBar.rect(0, 0, width / 3 * loadPercentage, 50, 50);

    displayInnerBar = loadInnerBar.get();
    displayInnerBar.mask(loadOuterBar);
    
    image(loadOuterBar, width / 2 - loadOuterBar.width / 2, loadOuterBar.height);
    image(displayInnerBar, width / 2 - loadInnerBar.width / 2, loadInnerBar.height);
}

function loadContent() {
    // Function to Load the game content
    totalAssets = Object.keys(content).length + Object.keys(quizImages).length + (mapCols * mapRows);
    for (let key in content) {
        if (content[key].type === 'PNG' || content[key].type === 'JPG') {
            content[key].d = loadImage(content[key].src, assetLoaded);
        } else if (content[key].type === 'JSON') {
            content[key].d = loadJSON(content[key].src, assetLoaded);
        } else if (content[key].type === 'WAV') {
            content[key].d = loadSound(content[key].src, assetLoaded);
        }
    }
    for (let key in quizImages) {
        if (quizImages[key].type === 'PNG' || quizImages[key].type === 'JPG') {
            quizImages[key].d = loadImage(quizImages[key].src, assetLoaded);
        } else if (quizImages[key].type === 'JSON') {
            quizImages[key].d = loadJSON(quizImages[key].src, assetLoaded);
        } else if (quizImages[key].type === 'WAV') {
            quizImages[key].d = loadSound(quizImages[key].src, assetLoaded);
        }
    }
    loadTiles(); // Function to Load the Pre-Tiled Map
}

function assetLoaded() { // Called for each successful load 
    loadCount++;
    if (totalAssets == loadCount) {
        setData();
        setRoulette();
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
    updateElements();
}

function updateLoading() {
    let screenRatio = width / height;

    let loadWidth = loadingImg.width;
    let loadHeight = loadingImg.height;

    let loadRatio = loadWidth / loadHeight;

    if (loadRatio > screenRatio) {
        loadingBackground.h = height;
        loadingBackground.w = height * loadRatio;
    } else {
        loadingBackground.w = width;
        loadingBackground.h = width / loadRatio;
    }
    
    loadingBackground.x = (width - loadingBackground.w) / 2;
    loadingBackground.y = (height - loadingBackground.h) / 2;

    // Loading Bar
    loadOuterBar = createGraphics(width / 3, 50);
    loadInnerBar = createGraphics(width / 3, 50);

    loadOuterBar.clear();
    loadOuterBar.fill('#f3edb8');
    loadOuterBar.noStroke();
    loadOuterBar.rect(0, 0, width / 3, 50, 50);
}