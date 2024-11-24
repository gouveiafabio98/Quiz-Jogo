// Map Tiles
let mapTiles = [];
let tileSize = 1024;
let mapCols = 11;
let mapRows = 9;

// Pre-Load Content
let mainFont;
let loadingImg;
let loadingWheel;

let habitas_semiBold, habitas_bold, habitas_light;

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
    }, rightSound: {
        src: 'data/right.mp3',
        type: 'MP3',
        d: null
    }, wrongSound: {
        src: 'data/wrong.mp3',
        type: 'MP3',
        d: null
    }, clickSound: {
        src: 'data/click.mp3',
        type: 'MP3',
        d: null
    }, popSound: {
        src: 'data/pop.mp3',
        type: 'MP3',
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
let finishLoad = false;

let loadingBackground = {
    w: 0,
    h: 0,
    x: 0,
    y: 0,
};

let loadingTextSize = {
    lv1: 0,
    lv2: 0,
    lv3: 0
};

function preload() { // Preload Content
    mainFont = loadFont('data/fonts/HubotSans_Condensed-ExtraBold.ttf');
    habitas_semiBold = loadFont('data/fonts/Habitas-Semibold.otf');
    habitas_bold = loadFont('data/fonts/Habitas-Bold.otf');
    habitas_light = loadFont('data/fonts/Habitas-Light.otf');

    loadingImg = loadImage('data/loadingScreen.png');
    loadingWheel = loadImage('data/wheelLoad.png');
    content.mill.d = loadImage(content.mill.src);
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
    textAlign(CENTER, CENTER);
    textSize(40);

    image(loadingImg, loadingBackground.x, loadingBackground.y, loadingBackground.w, loadingBackground.h);

    if (loadPercentage < 1 - 0.0015 && !(totalAssets == loadCount) && !finishLoad)
        loadPercentage = lerp(loadPercentage, loadCount / totalAssets, loadCount * 0.015);
    else {
        loadPercentage = 1;
    }

    push();
    translate(width / 2, height / 2);

    loadInnerBar.clear();
    loadInnerBar.fill('#bcdfe1');
    loadInnerBar.noStroke();
    loadInnerBar.rect(0, 0, loadInnerBar.width * loadPercentage, startButton.h, startButton.h);

    displayInnerBar = loadInnerBar.get();
    displayInnerBar.mask(loadOuterBar);

    push();
    translate(0, -180);
    scale(.5);
    image(content.mill.d, -content.mill.d.width / 2, -content.mill.d.height / 2);
    push();
    translate(0, -110);
    rotate(loadPercentage * TWO_PI * 4);
    image(loadingWheel, -loadingWheel.width / 2, -loadingWheel.height / 2);
    pop();
    pop();

    fill(255);
    textFont(habitas_semiBold);
    textSize(loadingTextSize.lv1);
    text("JOGO", 0, 0);
    textFont(habitas_bold);
    textSize(loadingTextSize.lv2);
    text("GeoAtlântico", 0, loadingTextSize.lv1 / 2 + loadingTextSize.lv2 / 2);
    textFont(habitas_light);
    textSize(loadingTextSize.lv3);
    text("Rotas do Património", 0, loadingTextSize.lv1 * 2 + loadingTextSize.lv2 / 2);

    if (loadPercentage != 1) {
        image(loadOuterBar, - loadOuterBar.width / 2, loadingTextSize.lv1 * 2 + loadingTextSize.lv2 / 2 + loadingTextSize.lv3 * 2);
        image(displayInnerBar, - loadInnerBar.width / 2, loadingTextSize.lv1 * 2 + loadingTextSize.lv2 / 2 + loadingTextSize.lv3 * 2);
    }
    pop();
    
    if(loadPercentage == 1) {
        textFont(habitas_bold);
        drawButton(startButton.text, startButton.y,
            startButton.w, startButton.h,
            startButton.radius, startButton.translateX, startButton.translateY,
            startButton.textSize, "#589359", true);
    }
}

function loadContent() {
    // Function to Load the game content
    totalAssets = Object.keys(content).length + Object.keys(quizImages).length + (mapCols * mapRows);
    for (let key in content) {
        if (content[key].type === 'PNG' || content[key].type === 'JPG') {
            content[key].d = loadImage(content[key].src, assetLoaded);
        } else if (content[key].type === 'JSON') {
            content[key].d = loadJSON(content[key].src, assetLoaded);
        } else if (content[key].type === 'WAV' || content[key].type === 'MP3') {
            content[key].d = loadSound(content[key].src, assetLoaded);
        }
    }
    for (let key in quizImages) {
        if (quizImages[key].type === 'PNG' || quizImages[key].type === 'JPG') {
            quizImages[key].d = loadImage(quizImages[key].src, assetLoaded);
        } else if (quizImages[key].type === 'JSON') {
            quizImages[key].d = loadJSON(quizImages[key].src, assetLoaded);
        } else if (quizImages[key].type === 'WAV' || content[key].type === 'MP3') {
            quizImages[key].d = loadSound(quizImages[key].src, assetLoaded);
        }
    }
    loadTiles(); // Function to Load the Pre-Tiled Map
}

async function assetLoaded() { // Called for each successful load 
    loadCount++;
    if (totalAssets == loadCount) {
        await setData();
        await setRoulette();
        await updateQuestion();
        finishLoad = true;
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

async function setData() {
    quizTopics = content.quizData.d.topics.map(topic => topic.topicName);
    numSections = quizTopics.length;
    anglePerSection = TWO_PI / numSections;

    targetX = menuPosition.x - width / 2;
    targetY = menuPosition.y - height / 2
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

function mapPosition() {
    if (playStage == 1) {
        targetX = menuPosition.x - width / 2;
        targetY = menuPosition.y - height / 2;
        targetZoom = bootZoom;
    } else if (playStage == 2) {
        targetX = content.roulette.x - width / 2;
        targetY = content.roulette.y - height / 2;
        targetZoom = inZoom;
    }
}

function updateLoading() {
    // Text Size
    loadingTextSize.lv1 = max(min(40, (width / 1920) * 40), 30);
    loadingTextSize.lv2 = max(min(70, (width / 1920) * 70), 45);
    loadingTextSize.lv3 = max(min(35, (width / 1920) * 35), 25);

    // Start Button
    startButton.textSize = max(min(50, (width / 1920) * 50), 35);
    startButton.radius = max(min(50, (width / 1920) * 50), 25);
    startButton.marginW = max(min(20, (width / 1920) * 20), 15);
    startButton.marginH = max(min(15, (width / 1920) * 15), 10);

    textFont(habitas_bold);
    textSize(startButton.textSize);
    startButton.w = textWidth(startButton.text) + startButton.marginW * 2;
    startButton.h = startButton.textSize + startButton.marginH * 2;
    startButton.y = -startButton.h / 10;

    startButton.translateX = width/2;
    startButton.translateY = height/2 + loadingTextSize.lv1 * 2 + loadingTextSize.lv2 / 2 + loadingTextSize.lv3 * 2 + startButton.h / 2;

    // Loading Bar
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

    if (width > height) {
        loadOuterBar = createGraphics(width / 3, startButton.h);
        loadInnerBar = createGraphics(width / 3, startButton.h);
    } else {
        loadOuterBar = createGraphics(width / 1.5, startButton.h);
        loadInnerBar = createGraphics(width / 1.5, startButton.h);
    }

    loadOuterBar.clear();
    loadOuterBar.fill('#f3edb8');
    loadOuterBar.noStroke();
    loadOuterBar.rect(0, 0, loadOuterBar.width, startButton.h, startButton.h);
}

let startButton = {
    text: "COMEÇAR",
    textSize: 0,
    textLeading: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    marginW: 0,
    marginH: 0,
    radius: 0,
    color: 255
}