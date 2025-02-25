function saveHighscore(score, difficulty) {
    let highscores = getHighscores();
    highscores.push({ score: score, difficulty: difficulty });
    highscores.sort((a, b) => b.score - a.score);
    if (highscores.length > 10) {
        highscores = highscores.slice(0, 10);
    }
    localStorage.setItem("highscores", JSON.stringify(highscores));
}

function getHighscores() {
    let highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    highscores.sort((a, b) => b.score - a.score);
    return highscores;
}