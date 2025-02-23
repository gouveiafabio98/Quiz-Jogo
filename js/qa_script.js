function displayData(data) {
    const container = document.getElementById('container');
    data.topics.forEach(topic => {
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic';

        const topicName = document.createElement('h2');
        topicName.className = 'topic-name';
        topicName.innerText = topic.displayName;
        topicDiv.appendChild(topicName);

        topic.questions.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.innerText = question.question;

            const answersDiv = document.createElement('ol'); // Use ordered list (ol) for numbering
            answersDiv.className = 'answers';
            question.answers.forEach((answer, index) => {
                const answerDiv = document.createElement('li'); // Use list item (li) for each answer
                answerDiv.className = 'answer';
                answerDiv.innerHTML = answer.isCorrect ? `<strong>${answer.text}</strong>` : answer.text; // Bold the correct answer
                answersDiv.appendChild(answerDiv);
            });

            questionDiv.appendChild(answersDiv);
            topicDiv.appendChild(questionDiv);
        });

        container.appendChild(topicDiv);
    });
}

fetch('data/topics.json')
    .then(response => response.json())
    .then(data => displayData(data))
    .catch(error => console.error('Error loading JSON:', error));

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/topics.json')
        .then(response => response.json())
        .then(data => displayData(data))
        .catch(error => console.error('Error loading JSON:', error));
});
