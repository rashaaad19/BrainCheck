import { Exam } from "../classes/exam.js";
import { Question } from "../classes/Questions.js";
import { getAllSubjectQuestions } from "../services/firestore_queries_service.js";


//get subjectId from url
const subjectId = new URLSearchParams(window.location.search).get('subjectId');
//get the selected subject from local storage and assign it's details to new Exam instance
const subjectData = JSON.parse(localStorage.getItem('selectedSubjectData'));
var selectedSubject = new Exam(
    subjectData.id,
    subjectData.subjectName,
    subjectData.duration,
    subjectData.description,
    subjectData.passingGrade
)



const fetchExamData = async (id) => {
    //fetch all questions for the subject and create instance for them 
    const questions = await getAllSubjectQuestions(id);
    const questionsArr = questions.map(question =>
        new Question(
            question.id,
            question.examId,
            question.questionText,
            question.options,
            question.correctAnswer,
            question.difficulty,
            question.points
        )
    );
    //update the questions array in the class
    selectedSubject.addQuestions(questionsArr)
    questionsArr.map(question => question.shuffleOptions())
    selectedSubject.shuffleQuestions();
    //local storage accept json strings , must be parsed again when used
    console.log(selectedSubject)
}


//fetch exam data when the page opens
window.addEventListener('load', () => {
    fetchExamData(subjectId);
})

