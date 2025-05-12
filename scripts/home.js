import { Exam } from "../classes/Exam.js";
import { logout } from "../services/auth_service.js";
import {
  getAllSubjectsData,
  getCurrentUserDoc,
} from "../services/firestore_queries_service.js";

const logoutBtn = document.getElementsByClassName('logOut-btn')[0];
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
  card.className = "subject-card-container";

  // create the image container for each subject
  const imgContainer = document.createElement("div");
  imgContainer.className = "img-card-container";
  let img = document.createElement("img");
  img.src = subject.img;
  img.alt = subject.subjectName;
  imgContainer.appendChild(img);

  // create the info container for each subject
  const infoContainer = document.createElement("div");
  infoContainer.className = "info-container";
  let subjectName = document.createElement("h2");
  subjectName.innerText = subject.subjectName;
  subjectName.title = subject.subjectName;
  let subjectDescription = document.createElement("p");
  subjectDescription.innerText = subject.description;
  infoContainer.append(subjectName, subjectDescription);

  // create the start exam button for each subject 
  const startExamBtnContainer = document.createElement("div");
  startExamBtnContainer.className = "start-exam-btn";
  let startExamBtn = document.createElement("button");
  startExamBtn.innerText = "Start Exam";
  startExamBtn.addEventListener("click", () => subjectButtonHandler(subject.id));
  startExamBtnContainer.appendChild(startExamBtn);

  // append the elements to the card
  card.append(imgContainer, infoContainer, startExamBtnContainer);


  if (currentUser.role === 'teacher') {
    startExamBtn.innerText = "Add Questions";
  }

  if (currentUser.role === 'student') {
    startExamBtn.innerText = "Start Exam";

  }

  outerContainer.append(card);
});

//handle log out btn click
logoutBtn.addEventListener('click', () => {
  logout();
  localStorage.removeItem('userId');
  window.location.href = `/`;
})