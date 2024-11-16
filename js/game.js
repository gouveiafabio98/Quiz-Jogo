function draw() {
    if (loadPercentage != 1) {
        loadScreen();
    } else {
        background(255);
        updateMapMovement();
        drawMap();
    }
}

function keyPressed() {
    if (key === ' ') {
        goToCity("Cantanhede");
    }
}