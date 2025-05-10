import { Exam } from "../classes/Exam.js";
import { Question } from "../classes/Questions.js";
import { getAllSubjectQuestions } from "../services/firestore_queries_service.js";
import { createUserExamDoc } from "../services/firestore_service.js";

let userScore = 0;
let answeredQuestions = {};
let bookmarkedQuestions = {};

const userId = localStorage.getItem('userId');
//get subjectId from url
const subjectId = new URLSearchParams(window.location.search).get('subjectId');
const radioInputs = document.querySelectorAll('input[type=radio]');
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

    return questionsArr;

}


let currentQuestionIndex = 0;
let nextButton, previousButton;

//fetch exam data when the page opens
window.addEventListener('load', async () => {
    await fetchExamData(subjectId);

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



    const updateExamData = (currentQuestionIndex) => {
        questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questionsData.length}`;
        //access the next question in the array
        questionTitle.textContent = questionsData[currentQuestionIndex].questionText;
        //access the answers to the next question in the array
        let answerValues = Object.values(questionsData[currentQuestionIndex].options);
        answerTextFromHtml.forEach((item, index) => {
            item.textContent = answerValues[index];
        });

    }
    /* ================ FUNCTIONS FOR ANSWER SELECTION ================ */

    radioInputs.forEach((radio) => {
        radio.addEventListener('change', () => {

            let answerSelected = document.querySelector('.exam-form input[name="exam"]:checked');
            let answerSelectedTextContent = document.querySelector('.exam-form input[name="exam"]:checked + span');
            let currentQuestion = questionsData[currentQuestionIndex];

            const isCorrect = currentQuestion.isCorrect(answerSelectedTextContent.textContent);
            const wasAnsweredBefore = (currentQuestionIndex in answeredQuestions);
            const prevAnswer = answeredQuestions[currentQuestionIndex]
            const prevAnswerWasCorrect = wasAnsweredBefore && currentQuestion.isCorrect(prevAnswer)


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

            //update the latest answer
            answeredQuestions = {
                ...answeredQuestions, [currentQuestionIndex]: answerSelectedTextContent
                    .textContent
            };

            console.log(answeredQuestions)

            //update session storage 
            sessionStorage.setItem(`question-${currentQuestionIndex}`, answerSelected.value);

        })
    })

    /* ================ FUNCTIONS FOR EXAM NAVIGATION ================ */

    nextButton = document.querySelector(".exam-form .exam-buttons .next");
    previousButton = document.querySelector(".exam-form .exam-buttons .prev");

    nextButton.addEventListener("click", (e) => {
        //make previous button enabled again
        previousButton.classList.remove('disabled-btn');
        previousButton.disabled = false;
        let answerSelected = document.querySelector('.exam-form input[name="exam"]:checked');

        //Show toast if no answer is selected
        if (!answerSelected) {
            showToast();
            return;
        }

        //increment the current question pointer
        currentQuestionIndex++;
        updateMarkButtonState();

        //next question logic
        if (currentQuestionIndex < questionsData.length) {
            //change the content of the exam 
            updateExamData(currentQuestionIndex)
            // clear selected answer
            document.querySelectorAll('.exam-form input[name="exam"]').forEach(input => input.checked = false);

            // Restore the saved answer for this question
            //Search for an answer for the question with this index
            let savedAnswer = sessionStorage.getItem(`question-${currentQuestionIndex}`);
            if (savedAnswer) {
                //Important
                document.querySelector(`.exam-form input[name="exam"][value=${savedAnswer}]`).checked = true;
            } console.log(questionsArr.length)
            //disable button if last question
            if (currentQuestionIndex === questionsArr.length - 1) {
                nextButton.classList.add("disabled-btn");
                nextButton.disabled = true;
            }


        }
    });


    previousButton.addEventListener("click", (e) => {
        let answerSelectedTextContent = document.querySelector('.exam-form input[name="exam"]:checked + span');
        e.preventDefault();

        nextButton.classList.remove("disabled-btn");
        nextButton.disabled = false;

        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateMarkButtonState();
            updateExamData(currentQuestionIndex)
            // clear selected answer
            document.querySelectorAll('.exam-form input[name="exam"]').forEach(input => input.checked = false);
            // Restore the saved answer for this question (if any)
            let savedAnswer = sessionStorage.getItem(`question-${currentQuestionIndex}`);
            console.log(savedAnswer)
            if (savedAnswer) {
                console.log(savedAnswer);
                document.querySelector(`.exam-form input[name="exam"][value=${savedAnswer}]`).checked = true;
            }
            if (currentQuestionIndex === 0) {
                previousButton.classList.add("disabled-btn");
                previousButton.disabled = true;
            }
        }
    });

    //Questions bookmark
    const markBtn = document.querySelector('.mark');

    markBtn.addEventListener("click", function () {
        const bookmarkIndex = currentQuestionIndex;
        //check if the question already featured in bookmarked
        if (currentQuestionIndex in bookmarkedQuestions) {
            const currentBookmark = document.getElementById(`bookmark-${currentQuestionIndex}`);
            currentBookmark.remove();
            markBtn.textContent = 'Mark';
            delete bookmarkedQuestions[currentQuestionIndex];
            console.log(bookmarkedQuestions);
        }
        //execute if the question is not in bookmark object
        else {
            console.log(' bookmarked')
            markBtn.textContent = 'Unmark';
            let devCards = document.querySelector(".mark-card");
            let questionsmarked = document.createElement("div");
            questionsmarked.textContent = `Question ${currentQuestionIndex + 1}`;
            questionsmarked.addEventListener('click', () => {
                updateExamData(bookmarkIndex)
            })
            questionsmarked.id = `bookmark-${currentQuestionIndex}`;

            devCards.appendChild(questionsmarked);


            bookmarkedQuestions = { ...bookmarkedQuestions, [currentQuestionIndex]: true };
            console.log(bookmarkedQuestions)
        }
    });

    // Function to update the button state based on current question
    function updateMarkButtonState() {
        if (currentQuestionIndex in bookmarkedQuestions) {
            markBtn.textContent = 'Unmark';

        } else {
            markBtn.textContent = 'Mark';
        }
    }



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



const form = document.querySelector('.exam-form');

//submit handler
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isPassing = selectedSubject.isPassing(userScore);
    sessionStorage.setItem('current_score', userScore);
    await createUserExamDoc(userId, selectedSubject, userScore, isPassing);
    window.location.href = `/pages/result.html?subjectId=${selectedSubject.id}`
})


//timer handler
let span = document.querySelector(".time-progress span");
function TimeProgress() {
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
    }, 100);
}
TimeProgress();


