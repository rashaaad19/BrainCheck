import { Question } from "../classes/Questions.js";
import { getAllSubjectQuestions } from "../services/firestore_queries_service.js";
import { createUserExamDoc } from "../services/firestore_service.js";

/* ================ TOAST FUNCTION ================ */

export function showToast() {
    const toast = document.getElementById("exam-toast");

    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 2000);
}


/* ================ DISPLAY EXAM DATA FUNCTION ================ */

export const fetchExamData = async (id, selectedSubject) => {
    const questions = await getAllSubjectQuestions(id);
    let questionsArr = questions.slice(0, 10).map(question =>
        new Question(
            question.id,
            question.examId,
            question.questionText,
            question.options,
            question.correctAnswer,
            question.difficulty,
            question.points
        )
    );
    //update the questions array in the class
    selectedSubject.addQuestions(questionsArr)
    questionsArr = questionsArr.map(question => question.shuffleOptions())
    selectedSubject.shuffleQuestions();

    return questionsArr;

}



/* ================ ANSWER SELECTION ================ */

export const radioAnswerTracker = (currentQuestionIndex, userScore, questionsData, answeredQuestions) => {
    let answerSelected = document.querySelector('.exam-form input[name="exam"]:checked');
    let answerSelectedTextContent = document.querySelector('.exam-form input[name="exam"]:checked + span');
    let currentQuestion = questionsData[currentQuestionIndex];

    const isCorrect = currentQuestion.isCorrect(answerSelectedTextContent.textContent);
    const wasAnsweredBefore = (currentQuestionIndex in answeredQuestions);
    const prevAnswer = answeredQuestions[currentQuestionIndex]
    const prevAnswerWasCorrect = wasAnsweredBefore && currentQuestion.isCorrect(prevAnswer);

    // Case 1: First time answering (and correct),  Add points
    if (!wasAnsweredBefore && isCorrect) {
        userScore += currentQuestion.points;
    }
    // Case 2: Previously correct, now wrong, Remove points
    else if (wasAnsweredBefore && prevAnswerWasCorrect && !isCorrect) {
        userScore -= currentQuestion.points;
    }
    // Case 3: Previously wrong, now correct, Add points
    else if (wasAnsweredBefore && !prevAnswerWasCorrect && isCorrect) {
        userScore += currentQuestion.points;
    }

    console.log(userScore)
    //update the latest answer
    answeredQuestions[currentQuestionIndex] = answerSelectedTextContent.textContent;
    //update session storage 
    sessionStorage.setItem(`question-${currentQuestionIndex}`, answerSelected.value);

    //return the user score to keep it updated
    return userScore;
}



/* ================ PROGRESS BAR FUNCTION ================ */

export const timeProgress = (span,selectedSubject,userId, userScore) => {
    
    let width = 0;

    let step = setInterval(async function () {
        if (width >= 100) {
            clearInterval(step);
            const isPassing = selectedSubject.isPassing(userScore);
            sessionStorage.setItem('current_score', userScore);
            await createUserExamDoc(userId, selectedSubject, userScore, isPassing);
            window.location.href = `/pages/result.html?subjectId=${selectedSubject.id}`

        }

        else {
            width = width + .10;
            span.style.width = width + "%";
            if (width > 100) {
                width = 100;
            }
        }
    }, 300);
}


