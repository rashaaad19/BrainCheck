/* ================ START EXAM INFO =================== */

export const showInitialQuestions = (selectedSubject) => {
    let questionsData = selectedSubject.questions
    let examName = document.querySelector('.exam-heading .exam-name')
    examName.textContent = selectedSubject.subjectName;

    let questionNumber = document.querySelector(".exam-form .question-num");
    questionNumber.textContent = `Question ${1} of ${questionsData.length}`;

    let questionTitle = document.querySelector(".exam-form .question-title");
    questionTitle.textContent = questionsData[0].questionText;

    let answerTextFromHtml = document.querySelectorAll(".exam-form label span");
    let answerValues = Object.values(questionsData[0].options);
    answerTextFromHtml.forEach((item, index) => {
        item.textContent = answerValues[index];
    });

    return { examName, questionNumber, questionTitle, answerValues, answerTextFromHtml }

}

/* ================ FUNCTIONS FOR UPDATING EXAM ================ */

export const updateExamData = (currentQuestionIndex, questionNumber, questionTitle, questionsData, answerTextFromHtml, answerValues) => {
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questionsData.length}`;
    //access the next question in the array
    questionTitle.textContent = questionsData[currentQuestionIndex].questionText;
    //access the answers to the next question in the array
    answerValues = Object.values(questionsData[currentQuestionIndex].options);
    answerTextFromHtml.forEach((item, index) => {
        item.textContent = answerValues[index];
    });

}



/* ================ FUNCTIONS FOR UPDATING BUTTON STATES ================ */

export const updateMarkButtonState = (currentQuestionIndex, bookmarkedQuestions, markBtn) => {
    if (currentQuestionIndex in bookmarkedQuestions) {
        markBtn.textContent = 'Unmark';

    } else {
        markBtn.textContent = 'Mark';
    }
}









