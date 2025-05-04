import { collection, db, doc, setDoc } from "../firebase.js"

export const createExamCollection = async (exams) => {
    console.log('called')
    exams.map(async (exam) => {
        const docRef = doc(db, 'exams', exam.id);
        await setDoc(docRef, {
            subjectName: exam.subjectName,
            description: exam.description,
            duration: exam.durationMinutes,
            id: exam.id,
            passingGrade: exam.passingGrade,

        })
    })
}


export const createQuestionCollection = async (questions) => {

    //create reference to the subject in firestore with it's id
    const subjectRef = doc(db, 'exams', 'PHYSED100');
    //create reference to the questions collection that has the exam
    const examRef = collection(subjectRef, 'questions');

    questions.map(async (question) => {
        //create unique reference to each question document in the collection
        const questionsRef = doc(examRef, question.id);

        await setDoc(questionsRef, {
            id:question.id,
            examId:question.examId,
            questionText:question.questionText,
            options:question.options,
            correctAnswer:question.correctAnswer,
            difficulty:question.difficulty,
            points:question.points
        })
    
    })

}