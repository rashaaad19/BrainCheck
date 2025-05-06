import { db, collection, doc, getDoc, getDocs, setDoc } from "../firebase.js"

//return array of object each one contain all subject data 
export const getAllSubjectsData = async () => {
    const collectionRef = collection(db, 'exams');
    const querySnapshot = await getDocs(collectionRef);
    const arrData = querySnapshot.docs.map((doc) => doc.data());
    return arrData;
}

//return array of subject names that appear in the database
export const getAllSubjectNames = async () => {
    const collectionRef = collection(db, 'exams');
    const querySnapshot = await getDocs(collectionRef);
    const arrNames = querySnapshot.docs.map((doc) => doc.data().subjectName);
    return arrNames;
}


//pass the subject id, and returns all questions appear fo this subject
export const getAllSubjectQuestions = async (id) => {
    try {
        //create reference to the subject in firestore with it's id
        const subjectRef = doc(db, 'exams', id);
        //create reference to the questions collection that has the exam
        const questionsRef = collection(subjectRef, 'questions');
        const querySnapshot = await getDocs(questionsRef);
        return querySnapshot.docs.map(doc => doc.data())
    }

    catch (e) {
        throw new Error(e.code)
    }
}

//pass the new question and it add it to the database
export const addNewQuestion = async (question) => {
    try {
        //create reference to the subject in firestore with it's id
        const subjectRef = doc(db, 'exams', question.examId);
        //create reference to the new question document
        const questionRef = doc(subjectRef, 'questions', question.id);
        await setDoc(questionRef, question)

    }
    catch (e) {
        throw new Error(e.code)
    }
}

//Helpful when  generating id for new quesiton, BIO101_Q(number+1)
export const getQuestionsNumber = async (subjectId) => {
    try {
        //create reference to the subject in firestore with it's id
        const subjectRef = doc(db, 'exams', subjectId);
        //create reference to the questions collection that has the exam
        const questionsRef = collection(subjectRef, 'questions');
        const querySnapshot = await getDocs(questionsRef);
        const questions = await querySnapshot.docs.map(doc => doc.data())
        return questions.length
    }
    catch (e) {
        throw new Error(e.code)
    }
}

//pass exam id and question id, return the correct answer
export const getCorrectAnswer = async (examId, questionId) => {
    try {

        //create reference to the subject in firestore with it's id
        const subjectRef = doc(db, 'exams', examId);
        //create reference to the new question document
        const questionRef = doc(subjectRef, 'questions', questionId);
        const question = await getDoc(questionRef);
        return question.data().correctAnswer

    }
    catch (e) {
        throw new Error(e.code)
    }
}




//takes user id as parameter, and return the user doc in firestore
export const getCurrentUserDoc=async(id)=>{
  const userRef =    doc(db, 'users', id);
    const querySnapshot =  await getDoc(userRef);
    return querySnapshot.data()

}