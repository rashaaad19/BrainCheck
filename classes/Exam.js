import { getAllSubjectsData } from "../services/firestore_queries_service.js";
export class Exam {
    constructor(id, name, duration, description, passingGrade, questions = []) {
        this.id = id;
        this.subjectName = name;
        this.duration = duration;
        this.description = description;
        this.passingGrade = passingGrade;
        this.questions = questions;
    }
    addQuestions(questionsArray) {
        this.questions = questionsArray
    }
    isPassing(score) {
        return score >= this.passingGrade
    }
    getDurationHours() {
        return (this.duration / 60).toFixed(1);
    }

    shuffleQuestions() {
        const arr = this.questions;
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        this.questions = arr;
    }

}

// const subjects = await getAllSubjectsData();
// const subjectClasses = subjects.map(item => new Exam(item.id, item.subjectName, item.duration, item.description, item.passingGrade));


// console.log(subjectClasses)
// console.log(subjectClasses[0].isPassing(40))
// console.log(subjectClasses[2].getDurationHours())