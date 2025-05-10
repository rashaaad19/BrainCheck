import { Exam } from "../classes/Exam.js";
import { getAllSubjectsData } from "../services/firestore_queries_service.js";

const container = document.getElementsByClassName("subjects-container")[0];
console.log("Home js");
//fetch subjects data and assign each subject as Exam instance
const subjects = await getAllSubjectsData();
console.log(subjects);

const subjectClasses = subjects.map(
  (item) =>
    new Exam(
      item.id,
      item.subjectName,
      item.duration,
      item.description,
      item.passingGrade,
      item.img
    )
);
console.log(subjectClasses);
const subjectButtonHandler = async (id) => {
  //find the selected class item based on user click
  const selectedSubject = subjectClasses.find((subject) => subject.id === id);
  // Save the raw data (not the class instance) to localStorage
  localStorage.setItem("selectedSubjectData", JSON.stringify(selectedSubject));
  //navigate to exam page with custom subjectId query
  window.location.href = `/pages/exam-page.html?subjectId=${selectedSubject.id}`;
};

//courses based on firestore
subjectClasses.map((subject) => {
  const container = document.querySelector(".course");

  const card = document.createElement("div");
  card.className =
    "subjects-container  flex flex-col justify-between card bg-white p-relative rad-10 p-10 gap-3";
  let subjectnamedev = document.createElement("div");
  subjectnamedev.className = "flex flex-col items-start  min-h-[150px]";
  subjectnamedev.style.backgroundImage = `url(${subject.img})`;
  subjectnamedev.style.backgroundSize = "cover";
  subjectnamedev.style.backgroundRepeat = "no-repeat";
  subjectnamedev.style.backgroundPosition = "center";
  subjectnamedev.style.borderRadius = "10px";
  subjectnamedev.innerHTML = `
   <div class="courses flex flex-col items-start p-10 min-h-[150px] m-0">
     <h3 class=" no fw-600 text-xl text-start min-h-10" style='color: rgb(0, 0, 163)' >${subject.subjectName}</h3>
      <h3 class=" no text-xs line-1-6  "  style="color:white; padding-top:7px ">${subject.description}</h3>
   
   </div>
  
 
  `;

  card.appendChild(subjectnamedev);

  const btn = document.createElement("div");
  btn.className =
    " flex justify-center start-btn mt-10 fw-500 c-blue pointer p-6";
  const startbtn = document.createElement("button");
  startbtn.className = " start ";

  startbtn.innerText = "Start Exam";

  startbtn.addEventListener("click", () => subjectButtonHandler(subject.id));

  btn.appendChild(startbtn);
  card.appendChild(btn);

  container.appendChild(card);
});
