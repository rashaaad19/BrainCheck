import { getAllSubjectQuestions, addNewQuestion } from "../services/firestore_queries_service.js";

let params = new URLSearchParams(window.location.search);
let Sid = params.get("subjectId");
console.log(Sid);

let questionadd = await getAllSubjectQuestions(Sid);
let idnumber = questionadd.length;
let correctAnswer = "";

let A = document.querySelectorAll("svg");

A.forEach((svg, index) => {
  svg.addEventListener("click", () => {
    A.forEach((el) => el.classList.remove("active"));
    svg.classList.add("active");

    let optionInputs = document.querySelectorAll(".answer input");
    correctAnswer = optionInputs[index].value ;
    console.log( correctAnswer);
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
    alert("Please select the correct answer.");
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
});

// let question={
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
