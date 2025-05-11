import { getAllSubjectQuestions, addNewQuestion } from "../services/firestore_queries_service.js";
import { showToast } from "../utilities/functions.js";

let params = new URLSearchParams(window.location.search);
let Sid = params.get("subjectId");
let questionadd = await getAllSubjectQuestions(Sid);
let idnumber = questionadd.length;
let correctAnswer = "";

let A = document.querySelectorAll("svg");
const toast = document.getElementById("exam-toast");
const toastSpan = document.querySelector('#exam-toast .alert span');


A.forEach((svg, index) => {
  svg.addEventListener("click", () => {
    A.forEach((el) => el.classList.remove("active"));
    svg.classList.add("active");

    let optionInputs = document.querySelectorAll(".answer input");
    correctAnswer = optionInputs[index].value;
    console.log(correctAnswer);
  });
});

document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  let questionText = document.querySelector('input[placeholder="Enter your question here"]').value;
  let optionInputs = document.querySelectorAll(".answer input");

  let options = {
    a: optionInputs[0].value,
    b: optionInputs[1].value,
    c: optionInputs[2].value,
    d: optionInputs[3].value,
  };

  let points = parseInt(document.getElementById("points").value);
  let difficulty = document.querySelector('input[name="radio-7"]:checked').value;
  let id = `${Sid}_Q${idnumber + 1}`;
  let examId = Sid;

  if (!correctAnswer) {
    showToast(toast);
    toastSpan.textContent = 'Please select the correct answer value'
    return;
  }

  let questionObject = {
    examId,
    difficulty,
    id,
    options,
    correctAnswer,
    points,
    questionText,
  };

  addNewQuestion(questionObject);

  optionInputs.forEach(input => input.value = "");
  document.getElementById("points").value = "";
  document.querySelector('input[placeholder="Enter your question here"]').value = "";
  document.getElementById("point-hint").style.display = "none";
  A.forEach((el) => el.classList.remove("active"));
  correctAnswer = "";
  idnumber++;


  //Indicate success toaster
  showToast(toast);
  toastSpan.textContent = 'Done! The question has been added!'

});

