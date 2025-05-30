//Class
import { Exam } from "../classes/Exam.js";
//Firebase functions
import { createUserExamDoc } from "../services/firestore_service.js";
//utility functions
import { showInitialQuestions, updateExamData, updateMarkButtonState } from "../utilities/displayFunctions.js";
import { fetchExamData, radioAnswerTracker, showToast, timeProgress } from "../utilities/functions.js";

//Variables
let userScore = 0;
let answeredQuestions = {};
let bookmarkedQuestions = {};
let currentQuestionIndex = 0;
let nextButton, previousButton;

//DOM ELEMENTS
let span = document.querySelector(".time-progress span");
const markBtn = document.querySelector('.mark');
const radioInputs = document.querySelectorAll('input[type=radio]');
const form = document.querySelector('.exam-form');
const toast = document.getElementById("exam-toast");
nextButton = document.querySelector(".exam-form .exam-buttons .next");
previousButton = document.querySelector(".exam-form .exam-buttons .prev");



//Getting data from URL and storage
const userId = localStorage.getItem('userId');
const subjectData = JSON.parse(localStorage.getItem('selectedSubjectData'));
const subjectId = new URLSearchParams(window.location.search).get('subjectId');


//Assign new Exam instances
var selectedSubject = new Exam(
    subjectData.id,
    subjectData.subjectName,
    subjectData.duration,
    subjectData.description,
    subjectData.passingGrade
)



/* ================ FETCHING DATA ON LOAD ================ */
window.addEventListener('load', async () => {
    //fetch questions for selected Subject
    var questionsArr = await fetchExamData(subjectId, selectedSubject);
    //fetch questions for selected Subject
    var questionsArr = await fetchExamData(subjectId, selectedSubject);
    let questionsData = selectedSubject.questions;




    const { examName,
        questionNumber,
        questionTitle,
        answerValues,
        answerTextFromHtml
    } = showInitialQuestions(selectedSubject)

    /* ================ RADIO BUTTON HANDLER ================ */

    radioInputs.forEach((radio) => {
        //store the user score to keep it updated
        radio.addEventListener('change', () => userScore = radioAnswerTracker(currentQuestionIndex, userScore, questionsData, answeredQuestions))
    })


    /* ================ FUNCTIONS FOR NEXT NAVIGATION ================ */

    nextButton.addEventListener("click", (e) => {
        //make previous button enabled again
        previousButton.classList.remove('disabled-btn');
        previousButton.disabled = false;
        let answerSelected = document.querySelector('.exam-form input[name="exam"]:checked');

        //Show toast if no answer is selected
        if (!answerSelected) {
            showToast(toast);
            return;
        }

        //increment the current question pointer
        currentQuestionIndex++;
        updateMarkButtonState(currentQuestionIndex, bookmarkedQuestions, markBtn);

        //next question logic
        if (currentQuestionIndex < questionsData.length) {
            //change the content of the exam 
            updateExamData(currentQuestionIndex, questionNumber, questionTitle, questionsData, answerTextFromHtml, answerValues)
            updateExamData(currentQuestionIndex, questionNumber, questionTitle, questionsData, answerTextFromHtml, answerValues)
            // clear selected answer
            document.querySelectorAll('.exam-form input[name="exam"]').forEach(input => input.checked = false);

            //Search for an answer for the question with this index
            let savedAnswer = sessionStorage.getItem(`question-${currentQuestionIndex}`);
            if (savedAnswer) {
                //Important
                document.querySelector(`.exam-form input[name="exam"][value=${savedAnswer}]`).checked = true;
            }
            //disable button if last question
            if (currentQuestionIndex === questionsArr.length - 1) {
                nextButton.classList.add("disabled-btn");
                nextButton.disabled = true;
            }


        }
    });


    /* ================ FUNCTIONS FOR PREVIOUS NAVIGATION ================ */

    previousButton.addEventListener("click", (e) => {
        let answerSelectedTextContent = document.querySelector('.exam-form input[name="exam"]:checked + span');
        e.preventDefault();

        nextButton.classList.remove("disabled-btn");
        nextButton.disabled = false;

        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateMarkButtonState(currentQuestionIndex, bookmarkedQuestions, markBtn);
            updateExamData(currentQuestionIndex, questionNumber, questionTitle, questionsData, answerTextFromHtml, answerValues)
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

    /* ================ BOOKMARK FUNCTION ================ */

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







            /* ================ BOOKMARKED ELEMENT FUNCTION ================ */
            questionsmarked.addEventListener('click', () => {
                currentQuestionIndex = bookmarkIndex; // Update the current index
                updateExamData(bookmarkIndex, questionNumber, questionTitle, questionsData, answerTextFromHtml, answerValues)
                updateExamData(bookmarkIndex, questionNumber, questionTitle, questionsData, answerTextFromHtml, answerValues)

                // Clear previous selection
                document.querySelectorAll('.exam-form input[name="exam"]').forEach(input => input.checked = false);

                // Restore saved answer (if any)
                let savedAnswer = sessionStorage.getItem(`question-${bookmarkIndex}`);
                if (savedAnswer) {
                    document.querySelector(`.exam-form input[name="exam"][value=${savedAnswer}]`).checked = true;
                }

                // Update button states
                updateMarkButtonState(currentQuestionIndex, bookmarkedQuestions, markBtn);

                // Handle prev/next button disabling
                if (bookmarkIndex === 0) {
                    previousButton.disabled = true;
                    previousButton.classList.add('disabled-btn')
                }
                if (bookmarkIndex === questionsArr.length - 1) {
                    previousButton.disabled = false;
                    previousButton.classList.remove('disabled-btn')

                }

            });
            questionsmarked.id = `bookmark-${currentQuestionIndex}`;

            devCards.appendChild(questionsmarked);
            bookmarkedQuestions = { ...bookmarkedQuestions, [currentQuestionIndex]: true };
            console.log(bookmarkedQuestions)
        }
    });



});





/* ================ SUBMIT HANDLER ================ */
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isPassing = selectedSubject.isPassing(userScore);
    console.log(isPassing, userScore)
    sessionStorage.setItem('current_score', userScore);
    await createUserExamDoc(userId, selectedSubject, userScore, isPassing);
    //clears the session storage
    Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith("question-")) {
            sessionStorage.removeItem(key);
        }
    });
    window.location.href = `/pages/result.html?subjectId=${selectedSubject.id}`

})


/* ================ PROGRESS HANDLER ================ */
timeProgress(span, selectedSubject, userId, userScore);


