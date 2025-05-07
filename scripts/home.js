import { Exam } from "../classes/exam.js";
import { getAllSubjectsData } from "../services/firestore_queries_service.js";

const container = document.getElementsByClassName("subjects-container")[0];
console.log("Home js");
//fetch subjects data and assign each subject as Exam instance
const subjects = await getAllSubjectsData();
const subjectClasses = subjects.map(
  (item) =>
    new Exam(
      item.id,
      item.subjectName,
      item.duration,
      item.description,
      item.passingGrade
    )
);

const subjectButtonHandler = async (id) => {
  //find the selected class item based on user click
  const selectedSubject = subjectClasses.find((subject) => subject.id === id);
  // Save the raw data (not the class instance) to localStorage
  localStorage.setItem("selectedSubjectData", JSON.stringify(selectedSubject));
  //navigate to exam page with custom subjectId query
  window.location.href = `/pages/exam.html?subjectId=${selectedSubject.id}`;
};

//Dummy UI to test, needs more styling
subjectClasses.map((subject) => {
  const container = document.querySelector(".course");

  const card = document.createElement("div");
  card.className = "subjects-container card bg-white p-relative rad-10";

  card.innerHTML = `
    <div class="text p-20 pb-30 p-relative bb-1-eee">
      <h3 class="fw-600 fs-18 pb-10">${subject.subjectName}</h3>
      <p class="c-grey fs-14 line-1-6">${subject.description}</p>
    </div>
  
  `;

  const btn = document.createElement("div");
  btn.className = "start-btn mt-10 fw-500 c-blue pointer";
  btn.innerText ="Start Exam"

 
  btn.addEventListener("click", () => subjectButtonHandler(subject.id));

 
  card.appendChild(btn);


  container.appendChild(card);
});

