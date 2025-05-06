export class AnswerServics {
  constructor(a, c) {
    this.answers = a;
    this.correct = c;
  }

  correctAnswer() {
    this.correct = true;
    // to make answer true
  }

  incorrectAnswe() {
    this.correct = false;
    // to make answer false
  }
}

export class QuestionServics {
  constructor(q) {
    this.qusetiontext = q;
    this.answers = [];
  }

  addAnswers(...answer) {
    answer.forEach((a) => {
      if (a instanceof AnswerServics) {
        this.answers.push(a);
      } else {
        throw "Only instances of AnswerServics are allowed.";
      }
    });
  }

  thecorrectAnswer() {
    return this.answers.filter((a) => a.correct === true);
    // return array of correct answers
  }
}

export class Subject {
  constructor(id, examid) {
    this.id = id;
    this.examid = examid;
    this.question = [];
  }

  addQuestions(...questions) {
    questions.forEach((q) => {
      if (q instanceof QuestionServics) {
        this.question.push(q);
      } else {
        throw "Only instances of QuestionServics are allowed.";
      }
    });
  }
  deletQuestion(index) {
    if (index < this.question.length) {
      this.question.splice(index, 1);
    } else {
      throw `error => question not found`;
    }
  }
  

}

let q = new QuestionServics("what is your fav city");
let ans1 = new AnswerServics("cairo", true);
let ans2 = new AnswerServics("domyat", false);
let ans3 = new AnswerServics("cairo", false);
console.log(typeof q);

q.addAnswers(ans1);
let newexam = new Subject(2, "binary");
newexam.addQuestions(q);
console.log(q);
