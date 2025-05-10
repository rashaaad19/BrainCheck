import { getCurrentUserDoc, getUserExamHistory } from "../services/firestore_queries_service.js";

//get user ID from local storage
const userID = localStorage.getItem('userId');
//fetch the user document from firestore
const userData = await getCurrentUserDoc(userID);
console.log(userData)

//Element selectors
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userFullName = document.getElementById('userFullName');
const userRole = document.getElementById('userRole');
const userImg = document.getElementById('userImg');

//Update the text of elements with user information
userName.innerText = userData.displayName;
userEmail.innerText = userData.email;
userFullName.innerText = userData.displayName;
userRole.innerText = userData.role;

//conditionally changing profile image based on user role
if(userData.role==='teacher'){
    userImg.src = '../images/teacher.png'
    console.log('teacher')
}
if(userData.role==='student'){
    userImg.src = '../images/pupil.png'
}



console.log(await getUserExamHistory(userID))