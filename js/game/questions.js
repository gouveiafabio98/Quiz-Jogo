let currentTopic;
let currentQuestion;

function displayQuestion() {
    text(currentQuestion.question, width/2, height/2);
}

function selectQuestion(cityName) {
    let city = quizData.topics.find(topic => topic.topicName === cityName);
    let randomIndex = Math.floor(Math.random() * city.questions.length);
    return city.questions[randomIndex];
}