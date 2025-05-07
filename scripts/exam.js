import { Exam } from "../classes/exam.js";
import { Question } from "../classes/Questions.js";
import { doc } from "../firebase.js";
import { getAllSubjectQuestions } from "../services/firestore_queries_service.js";

//get subjectId from url
const subjectId = new URLSearchParams(window.location.search).get('subjectId');
//get the selected subject from local storage and assign it's details to new Exam instance
const subjectData = JSON.parse(localStorage.getItem('selectedSubjectData'));
let questionsArr;
var selectedSubject = new Exam(
    subjectData.id,
    subjectData.subjectName,
    subjectData.duration,
    subjectData.description,
    subjectData.passingGrade
)

const fetchExamData = async (id) => {
    //fetch all questions for the subject and create instance for them 
    const questions = await getAllSubjectQuestions(id);
    questionsArr = questions.map(question =>
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

    //local storage accept json strings , must be parsed again when used
    // console.log(selectedSubject)
    return questionsArr;

}


let currentQuestionIndex = 0;
let nextButton, previousButton;

//fetch exam data when the page opens
window.addEventListener('load', async () => {
    const data = await fetchExamData(subjectId);

    console.log(selectedSubject.questions)

    let questionsData = selectedSubject.questions;

    /* ================ START EXAM INFO =================== */
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



    /* ================ FUNCTIONS FOR EXAM NAVIGATION ================ */

    nextButton = document.querySelector(".exam-form .exam-buttons .next");

    nextButton.addEventListener("click", (e) => {
        e.preventDefault();

        let answerSelected = document.querySelector('.exam-form input[name="exam"]:checked');
        let answerSelectedTextContent = document.querySelector('.exam-form input[name="exam"]:checked + span');

        if (!answerSelected) {
            showToast();
            return;
        }

        // sessionStorage.setItem(`answer_${currentQuestionIndex}`, answerSelected.value);
        sessionStorage.setItem(`option-${currentQuestionIndex}`, answerSelectedTextContent.textContent);
        // console.log(answerSelectedTextContent.textContent)
        console.log(currentQuestionIndex);

        currentQuestionIndex++;

        if (currentQuestionIndex < questionsData.length) {
            questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questionsData.length}`;
            questionTitle.textContent = questionsData[currentQuestionIndex].questionText;

            let answerValues = Object.values(questionsData[currentQuestionIndex].options);
            answerTextFromHtml.forEach((item, index) => {
                item.textContent = answerValues[index];
            });

            // clear selected answer
            document.querySelectorAll('.exam-form input[name="exam"]').forEach(input => input.checked = false);

            // Restore the saved answer for this question
            let savedAnswer = sessionStorage.getItem(`option-${currentQuestionIndex}`);

            if (savedAnswer) {
                console.log(savedAnswer);
                document.querySelector(`.exam-form input[name="exam"][value="option-${currentQuestionIndex}"]`).checked = true;
            }

        } else {
            nextButton.classList.add("disabled-btn");
            nextButton.disabled = true;
        }
    });

    previousButton = document.querySelector(".exam-form .exam-buttons .prev");

    previousButton.addEventListener("click", (e) => {
        e.preventDefault();

        nextButton.classList.remove("disabled-btn");
        nextButton.disabled = false;

        // console.log(currentQuestionIndex);
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;

            questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questionsData.length}`;
            questionTitle.textContent = questionsData[currentQuestionIndex].questionText;

            let answerValues = Object.values(questionsData[currentQuestionIndex].options);
            answerTextFromHtml.forEach((item, index) => {
                item.textContent = answerValues[index];
            });

            // clear selected answer
            document.querySelectorAll('.exam-form input[name="exam"]').forEach(input => input.checked = false);

            // Restore the saved answer for this question (if any)
            let savedAnswer = sessionStorage.getItem(`option-${currentQuestionIndex}`);

            if (savedAnswer) {
                console.log(savedAnswer);
                document.querySelector(`.exam-form input[name="exam"][value="option-${currentQuestionIndex}"]`).checked = true;
            }
        }
        // else {
        //     previousButton.classList.add("disabled-btn");
        //     previousButton.disabled = true;
        // }
    });
});

// Toast function 
function showToast() {
    const toast = document.getElementById("exam-toast");
    const span = toast.querySelector("span");

    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 2000);
}






