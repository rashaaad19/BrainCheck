import { getAllSubjectQuestions } from "../services/firestore_queries_service.js";

import { addNewQuestion } from "../services/firestore_queries_service.js";

const params = new URLSearchParams(window.location.search);
const Sid = params.get("subjectId");
console.log(Sid);

let questionadd = await getAllSubjectQuestions(Sid);
console.log(questionadd);
let idnumber = questionadd.length;
let correctAnswer = "";

let A = document.querySelectorAll("svg");

A.forEach((svg, index) => {
  svg.addEventListener("click", () => {
    A.forEach((el) => el.classList.remove("active"));
    svg.classList.add("active");

    ///send correct answer
    let optionInputs = document.querySelectorAll(".answer input");
    if (index === 0) correctAnswer = optionInputs[0].value;
    else if (index === 1) correctAnswer = optionInputs[1].value;
    else if (index === 2) correctAnswer = optionInputs[2].value;
    else if (index === 3) correctAnswer = optionInputs[3].value;

    console.log(correctAnswer);
  });
});

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const questionText = document.querySelector(
    'input[placeholder="Enter your question here"]'
  ).value;

  let optionInputs = document.querySelectorAll(".answer input");
  let options = {
    a: optionInputs[0].value,
    b: optionInputs[1].value,
    c: optionInputs[2].value,
    d: optionInputs[3].value,
  };

  let points = parseInt(document.getElementById("points").value);
  let difficulty = document.querySelector(
    'input[name="radio-7"]:checked'
  ).value;
  let id = `${Sid}_Q${idnumber + 1}`;

  const examId = Sid;

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
  optionInputs[0].value = "";
  optionInputs[1].value = "";
  optionInputs[2].value = "";
  optionInputs[3].value = "";
  document.getElementById("points").value = "";
  document.querySelector('input[placeholder="Enter your question here"]').value="";
  document.getElementById("point-hint").style.display="none";
});

// const question={
//   examId:'CHEM205',
//   difficulty:"easy",
//   id:"BIO101_Q12",
//   options:{
//     a:'Bla',
//     b:'Bla Bla',
//     c:'Bla Bla Bla',
//     d:'Bla Bla Bla Bla'
//   },
//   points:3,
//   questionText:'This is question text'

// }
