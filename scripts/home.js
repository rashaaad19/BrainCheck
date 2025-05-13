import { Exam } from "../classes/Exam.js";
import { logout } from "../services/auth_service.js";
import {
  getAllSubjectsData,
  getCurrentUserDoc,
} from "../services/firestore_queries_service.js";

const logoutBtn = document.getElementsByClassName("logOut-btn")[0];
const userId = localStorage.getItem("userId");

const currentUser = await getCurrentUserDoc(userId);
const subjects = await getAllSubjectsData();

//assign each subject to Exam class
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

const subjectButtonHandler = async (id) => {
  //find the selected class item based on user click
  const selectedSubject = subjectClasses.find((subject) => subject.id === id);
  // Save the raw data (not the class instance) to localStorage
  localStorage.setItem("selectedSubjectData", JSON.stringify(selectedSubject));
  //navigate to exam page with custom subjectId query
  if (currentUser.role === "teacher") {
    window.location.href = `/pages/teacher.html?subjectId=${selectedSubject.id}`;
  } else {
    window.location.href = `/pages/exam-page.html?subjectId=${selectedSubject.id}`;
  }
};


//courses based on firestore

subjectClasses.map((subject) => {
  const outerContainer = document.querySelector(".course");

  // create the card of each subject
  const card = document.createElement("div");
  card.className =
    "subjects-container  flex flex-col justify-between card bg-white p-relative rad-10 pb-15";
  let subjectnamedev = document.createElement("div");
  subjectnamedev.className = "flex flex-col items-start  min-h-[250px]";
  subjectnamedev.style.backgroundImage = `url(${subject.img})`;
  subjectnamedev.style.backgroundSize = "cover";
  subjectnamedev.style.backgroundRepeat = "no-repeat";
  subjectnamedev.style.backgroundPosition = "center";
 subjectnamedev.style.borderTopLeftRadius = "7px";
subjectnamedev.style.borderTopRightRadius = "7px";

  subjectnamedev.innerHTML = `
   <div class="courses w-full flex flex-col items-start p-10 min-h-[250px] m-0">
    </div>
    
  `;
  let pargarph = document.createElement("div");
  pargarph.className = ` flex flex-col items-start p-10 gap-2`;
  pargarph.innerHTML = `     
     <h3 class=" h31 text-xl text-start min-h-10"  >${subject.subjectName}</h3>
      <h3 class=" h32  line-1-6  "  padding-top:7px ">${subject.description}</h3>`;

  card.appendChild(subjectnamedev);
  card.appendChild(pargarph);

  const btn = document.createElement("div");
  btn.className =
    "startbtn flex justify-center start-btn mt-10 fw-500 c-blue pointer p-6";
  const startbtn = document.createElement("button");
  startbtn.className = " start ";

  if (currentUser.role === "teacher") {
    startbtn.innerText = "Add Questions";
  }

  if (currentUser.role === "student") {
    startbtn.innerText = "Start Exam";
  }

  outerContainer.append(card);
});

//handle log out btn click
logoutBtn.addEventListener("click", () => {
  logout();
  localStorage.removeItem("userId");
  window.location.href = `/`;
});
