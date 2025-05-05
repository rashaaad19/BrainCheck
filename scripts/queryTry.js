import { getCurrentUserId } from "../services/auth_service.js";
import { addNewQuestion, getAllSubjectsData, getAllSubjectNames, getAllSubjectQuestions, getQuestionsNumber, getCorrectAnswer, getCurrentUserDoc } from "../services/firestore_queries_service.js";


const userId =  await getCurrentUserId()
console.log(await getCurrentUserDoc(userId))
const question = {
    correctAnswer: 'Third Option',
    difficulty: 'hard',
    examId: 'PHYS301',
    id: 'BIO101_Q11',
    options: {
        a: 'First option',
        b: 'Second option',
        c: 'Third option',
        d: 'Fourth option'
    },
    points:5,
    questionText:'This is a new question template'
}


// console.log(await getAllSubjectsData())
// console.log(await getAllSubjectQuestions('PHYS301'));
// console.log(await getAllSubjectNames());
// console.log(await getQuestionsNumber('BIO101'));
// console.log(await getCorrectAnswer('BIO101', 'BIO101_Q7'))



