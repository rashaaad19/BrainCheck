import { Exam } from "../classes/exam.js";
import { getAllSubjectsData } from "../services/firestore_queries_service.js";

const container = document.getElementsByClassName('subjects-container')[0];

//fetch subjects data and assign each subject as Exam instance
const subjects = await getAllSubjectsData();
const subjectClasses = subjects.map(item =>
    new Exam(
        item.id,
        item.subjectName,
        item.duration,
        item.description,
        item.passingGrade
    )
);

const subjectButtonHandler = async (id) => {
    //find the selected class item based on user click
    const selectedSubject = subjectClasses.find(subject => subject.id === id)
    // Save the raw data (not the class instance) to localStorage
    localStorage.setItem('selectedSubjectData', JSON.stringify(selectedSubject));
    //navigate to exam page with custom subjectId query
    window.location.href = `/pages/exam-page.html?subjectId=${selectedSubject.id}`
}

//Dummy UI to test, needs more styling
subjectClasses.map((subject) => {
    const btn = document.createElement('button');
    btn.innerText = subject.subjectName;
    btn.addEventListener('click', () => subjectButtonHandler(subject.id));
    container.appendChild(btn)
})


