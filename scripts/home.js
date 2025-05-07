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
  card.className = "subjects-container  flex flex-col justify-between card bg-white p-relative rad-10 p-10";
    let subjectnamedev=document.createElement("div")
    subjectnamedev.className="flex flex-col items-start text p-20  p-relative p-10"
    
  subjectnamedev.innerHTML = `
   
      <h3 class="fw-600 fs-18 text-start min-h-10" style='color:darkblue' >${subject.subjectName}</h3>
      <h3 class="c-grey fs-14 line-1-6 pt-5 "  style="padding-top: 7px">${subject.description}</h3>
    
  
  `;
  card.appendChild(subjectnamedev)

  const btn = document.createElement("div");
  btn.className = " flex justify-center start-btn mt-10 fw-500 c-blue pointer p-6";
  const startbtn=document.createElement("button")
  startbtn.className="btn btn-outline btn-success p-15 m-3"
  startbtn.innerText ="Start Exam"

 
  startbtn.addEventListener("click", () => subjectButtonHandler(subject.id));

 btn.appendChild(startbtn);
  card.appendChild(btn);


  container.appendChild(card);
});

