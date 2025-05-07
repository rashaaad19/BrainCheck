import { collection, db, doc, getDoc, setDoc } from "../firebase.js"



export const createUser = async (userData) => {
    console.log(userData)
    try {
        const docRef = doc(db, "users", userData.id);
        const data = await setDoc(docRef, {
            email: userData.email,
            displayName: userData.name,
            role:userData.role,
            exams:userData.exams,
            id:userData.id
            
        });
        return data;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const checkUserDoc = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    const docExist = userDoc.exists();
    return docExist

}


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


export const createQuestionCollection = async (questions, subjectID) => {

    //create reference to the subject in firestore with it's id
    const subjectRef = doc(db, 'exams', subjectID);
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

