export class Exam {
  constructor(
    id,
    name,
    duration,
    description,
    passingGrade,
    img,
    questions = []
  ) {
    this.id = id;
    this.subjectName = name;
    this.duration = duration;
    this.description = description;
    this.passingGrade = passingGrade;
    this.questions = questions;
    this.img = img;
  }
  addQuestions(questionsArray) {
    this.questions = questionsArray;
  }
  isPassing(score) {
    return score >= this.passingGrade;
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

