import { getSubjectById } from "../services/firestore_queries_service.js";

const subjectId = new URLSearchParams(window.location.search).get('subjectId');
const userId = localStorage.getItem('userId');
const userScore = sessionStorage.getItem('current_score')
// alert(`User: ${userId} completed ${subjectId} Exam`);

const subjectData = await getSubjectById(subjectId);
