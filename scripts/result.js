import { getCurrentUserDoc, getSubjectById } from "../services/firestore_queries_service.js";

const subjectId = new URLSearchParams(window.location.search).get('subjectId');
const userId = localStorage.getItem('userId');
const userScore = sessionStorage.getItem('current_score')
// alert(`User: ${userId} completed ${subjectId} Exam`);

const subjectData = await getSubjectById(subjectId);

console.log(userScore);
// console.log(subjectData);
// console.log(userId);

const userDoc = await getCurrentUserDoc(userId);

// console.log(userDoc.displayName);





/* ======================= Html Elements ======================= */


const resultDescription = document.querySelector('.show-result .result-description span');
const currentUserImg = document.querySelector('.img-container img');
const userName = document.querySelector('.show-result .userName');
const audio = document.querySelector('.audio-container audio');

if (userScore >= subjectData.passingGrade) {
    currentUserImg.src = '../images/success.png';
    userName.textContent = `Excellent ${userDoc.displayName}`;
    userName.style.textTransform = 'capitalize';
    audio.src = '../audio/success_audio.mp3';
} else {
    currentUserImg.src = '../images/failed.webp';
    userName.textContent = `Failed ${userDoc.displayName}`;
    userName.style.textTransform = 'capitalize';
    audio.src = '../audio/failed_audio.mp3';

}

resultDescription.textContent = `${userScore} / ${subjectData.totalGrade}`;

