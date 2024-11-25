// Map Tiles
let mapTiles = [];
let tileSize = 1024;
let mapCols = 11;
let mapRows = 9;

// Pre-Load Content
let mainFont;
let loadingImg;
let loadingWheel;

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
    }, Antom: {
        src: "data/fonts/Anton-Regular.ttf",
        type: 'TTF',
        d: null
    }, HabitasMedium: {
        src: "data/fonts/Habitas-Medium.otf",
        type: 'OTF',
        d: null
    }, HabitasBold: {
        src: "data/fonts/Habitas-Bold.otf",
        type: 'OTF',
        d: null
    }, HabitasLight: {
        src: "data/fonts/Habitas-Light.otf",
        type: 'OTF',
        d: null
    }, HabitasSemibold: {
        src: "data/fonts/Habitas-Semibold.otf",
        type: 'OTF',
        d: null
    }, music: {
        src: 'data/music.mp3',
        type: 'MP3',
        d: null
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
    content.HabitasBold.d = loadFont(content.HabitasBold.src);
    content.HabitasSemibold.d = loadFont(content.HabitasSemibold.src);
    content.HabitasLight.d = loadFont(content.HabitasLight.src);

    loadingImg = loadImage('data/loadingScreen.png');
    loadingWheel = loadImage('data/wheelLoad.png');
    content.mill.d = loadImage(content.mill.src);
}

function setup() { // Setup Content
    createCanvas(windowWidth, windowHeight);

    loadContent();
    scaleResize(windowWidth, windowHeight);

    updateLoading();
}

function loadScreen() { // Loading Screen
    imageMode(CORNER);
    textAlign(CENTER, CENTER);
    textSize(40);

    menuScreen();

    push();
    translate(width / 2, height / 2);

    if (loadPercentage < 1 - 0.0015 && !(totalAssets == loadCount) && !finishLoad) {
        loadPercentage = lerp(loadPercentage, loadCount / totalAssets, loadCount * 0.015);
        menuWheelRot = loadPercentage * TWO_PI * 4;
    } else {
        loadPercentage = 1;
        menuWheelRot += 0.01;
    }

    loadInnerBar.clear();
    loadInnerBar.fill('#bcdfe1');
    loadInnerBar.noStroke();
    loadInnerBar.rect(0, 0, loadInnerBar.width * loadPercentage, startButton.h, startButton.h);

    displayInnerBar = loadInnerBar.get();
    displayInnerBar.mask(loadOuterBar);

    fill(255);
    textFont(content.HabitasSemibold.d);
    textSize(loadingTextSize.lv1);
    text("JOGO", 0, 0);
    textFont(content.HabitasBold.d);
    textSize(loadingTextSize.lv2);
    text("GeoAtlântico", 0, loadingTextSize.lv1 / 2 + loadingTextSize.lv2 / 2);
    textFont(content.HabitasLight.d);
    textSize(loadingTextSize.lv3);
    text("Rotas do Património", 0, loadingTextSize.lv1 * 2 + loadingTextSize.lv2 / 2);

    if (loadPercentage != 1) {
        image(loadOuterBar, - loadOuterBar.width / 2, loadingTextSize.lv1 * 2 + loadingTextSize.lv2 / 2 + loadingTextSize.lv3 * 2);
        image(displayInnerBar, - loadInnerBar.width / 2, loadingTextSize.lv1 * 2 + loadingTextSize.lv2 / 2 + loadingTextSize.lv3 * 2);
    }

    pop();

    if (loadPercentage == 1) {
        textFont(content.HabitasBold.d);
        drawButton(startButton.text, startButton.y,
            startButton.w, startButton.h,
            startButton.radius, startButton.translateX, startButton.translateY,
            startButton.textSize, "#589359", true);
    }
}

let menuWheelRot = 0;

function menuScreen() {
    imageMode(CORNER);
    image(loadingImg, loadingBackground.x, loadingBackground.y, loadingBackground.w, loadingBackground.h);

    push();
    translate(width / 2, height / 2);

    push();
    translate(0, -loadingWheel.height / 2 * outZoom - loadingTextSize.lv1 / 2);
    scale(outZoom);
    image(content.mill.d, -content.mill.d.width / 2, -content.mill.d.height / 2);
    push();
    translate(0, -110);
    rotate(menuWheelRot);
    image(loadingWheel, -loadingWheel.width / 2, -loadingWheel.height / 2);
    pop();
    pop();

    pop();
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
        } else if (content[key].type === 'TTF' || content[key].type === 'OTF') {
            content[key].d = loadFont(content[key].src, assetLoaded);
        }
    }
    for (let key in quizImages) {
        if (quizImages[key].type === 'PNG' || quizImages[key].type === 'JPG') {
            quizImages[key].d = loadImage(quizImages[key].src, assetLoaded);
        } else if (quizImages[key].type === 'JSON') {
            quizImages[key].d = loadJSON(quizImages[key].src, assetLoaded);
        } else if (quizImages[key].type === 'WAV' || quizImages[key].type === 'MP3') {
            quizImages[key].d = loadSound(quizImages[key].src, assetLoaded);
        } else if (quizImages[key].type === 'TTF' || quizImages[key].type === 'OTF') {
            quizImages[key].d = loadFont(quizImages[key].src, assetLoaded);
        }
    }
    loadTiles(); // Function to Load the Pre-Tiled Map
}

async function assetLoaded() { // Called for each successful load 
    loadCount++;
    if (totalAssets == loadCount) {
        await setData();
        await setRoulette();
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

function updateLoading() {
    // Text Size
    loadingTextSize.lv1 = max(min(40, (width / 1920) * 40), 30);
    loadingTextSize.lv2 = max(min(70, (width / 1920) * 70), 45);
    loadingTextSize.lv3 = max(min(35, (width / 1920) * 35), 25);

    // Start Button
    startButton.textSize = max(min(50, (width / 1920) * 50), 35);
    startButton.radius = max(min(50, (width / 1920) * 50), 25);
    startButton.marginW = max(min(35, (width / 1920) * 35), 25);
    startButton.marginH = max(min(15, (width / 1920) * 15), 10);

    textFont(content.HabitasBold.d);
    textSize(startButton.textSize);
    startButton.w = textWidth(startButton.text) + startButton.marginW * 2;
    startButton.h = startButton.textSize + startButton.marginH * 2;
    startButton.y = -startButton.h / 10;

    startButton.translateX = width / 2;
    startButton.translateY = height / 2 + loadingTextSize.lv1 * 2 + loadingTextSize.lv2 / 2 + loadingTextSize.lv3 * 2 + startButton.h / 2;

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

    // Loading Scale
    if (windowWidth > windowHeight) {
        outZoom = min(0.5, windowWidth * 0.5 / 1920);
    } else {
        outZoom = min(0.5, windowHeight * 0.5 / 1000);
    }
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