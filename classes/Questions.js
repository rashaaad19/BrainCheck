export class Question {
    constructor(id, examId, questionText, options, correctAnswer, difficulty, points) {
        this.id = id;
        this.examId = examId;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.difficulty = difficulty;
        this.points = points;
    }
    isCorrect(answerValue) {
        //check first if the passed value exists in the options
        const validValues = Object.values(this.options);
        if (!validValues.includes(answerValue)) {
            throw new Error(`"${answerValue}" is not a valid option!`);
        }
        return answerValue === this.correctAnswer;
    }

    shuffleOptions() {
        const options = Object.entries(this.options);
        const shuffledOptions = options.sort(() => Math.random() - 0.5);
        this.options = Object.fromEntries(shuffledOptions); // Update the instance
        return this.options;
    }
}




