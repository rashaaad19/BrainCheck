import { logout } from "../services/auth_service.js";
import { getCurrentUserDoc, getUserExamHistory } from "../services/firestore_queries_service.js";

//get user ID from local storage
const userID = localStorage.getItem('userId');

//fetch the user document from firestore
const userData = await getCurrentUserDoc(userID);
const userHistory = await getUserExamHistory(userID)
//Element selectors
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userFullName = document.getElementById('userFullName');
const userRole = document.getElementById('userRole');
const userImg = document.getElementById('userImg');
const historyContainer = document.querySelector('.latest-activities');
const logoutBtn = document.getElementsByClassName('logOut-btn')[0];

//Update the text of elements with user information
userName.innerText = userData.displayName;
userEmail.innerText = userData.email;
userFullName.innerText = userData.displayName;
userRole.innerText = userData.role;

//conditionally changing profile image based on user role
if (userData.role === 'teacher') {
    userImg.src = '../images/teacher.png'
    console.log('teacher')
}
if (userData.role === 'student') {
    userImg.src = '../images/pupil.png'
}



console.log(userHistory);

//if the user has taken exams previously
if (userHistory) {
    userHistory.forEach((exam) => {



        const div = document.createElement('div');
        const examHeader = document.createElement('h3');
        const subjectCode = document.createElement('span');
        const description = document.createElement('p');
        const metaContainer = document.createElement('div');
        const dateElement = document.createElement('span');
        const statusElement = document.createElement('span');
        const userScoreElement = document.createElement('p');
        const passingGradeElement = document.createElement('p');

        // Format date
        const examDate = new Date(exam.createdAt.seconds * 1000);
        const formattedDate = examDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Set content
        examHeader.textContent = exam.subjectName;
        subjectCode.textContent = exam.subjectId;
        description.textContent = exam.description;
        dateElement.textContent = formattedDate;
        statusElement.textContent = exam.pass ? 'Passed' : 'Failed';
        userScoreElement.textContent = `Your Score was ${exam.userScore}`;
        passingGradeElement.textContent = `Exam passing grade: ${exam.passingGrade}`;

        // Add classes
        div.classList.add('examHistory_container');
        examHeader.classList.add('examHistory_header');
        subjectCode.classList.add('examHistory_subjectCode');
        description.classList.add('examHistory_description');
        userScoreElement.classList.add('examHistory_userScore')
        metaContainer.classList.add('examHistory_meta');
        dateElement.classList.add('examHistory_date');
        statusElement.classList.add('examHistory_status');
        statusElement.classList.add(exam.pass ? 'pass' : 'fail');
        passingGradeElement.classList.add('examHistory_passingGrade');




        // Build DOM structure
        examHeader.appendChild(subjectCode);

        metaContainer.appendChild(dateElement);
        metaContainer.appendChild(statusElement);

        div.appendChild(examHeader);
        div.appendChild(description);
        div.appendChild(userScoreElement);
        div.appendChild(passingGradeElement);
        div.appendChild(metaContainer);

        historyContainer.appendChild(div);

    });
}



//handle log out btn click
logoutBtn.addEventListener('click',()=>{
  logout();
  window.location.href = `/`;
})