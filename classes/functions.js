
///func to fet random question and delete it from arr
// export function randomQuestion(arr) {
//     let newarray = [...arr];

//     return function () {
//       if (newarray.length === 0) {
//         return " no Question !";
//       }
//       let ranindex = Math.floor(Math.random() * newarray.length);
//       return newarray.splice(ranindex, 1)[0];
//     };
// }
/// fun for time
function TimeProgress() {
  let span = document.querySelector(".time-progress span");
  let width = 0;

  let step = setInterval(function () {
    if (width >= 100) {
      clearInterval(step);
    } else {
      width = width + .15;
      span.style.width = width + "%";
      if (width > 100){
        width = 100;
      } 
    }
  }, 100); 

 
  setTimeout(function () {
    window.location.href = "#../pages/result.html";
  }, 100);
}

TimeProgress();

///////////fun mark

function MarkedQuestions(){
let markbtn=document.querySelectorAll(".exam-buttons button")[1]
console.log(markbtn)

markbtn.addEventListener("click", function(){
  if(   markbtn.textContent==="Mark"){

       markbtn.textContent="Un Mark"

  let devCards=document.querySelector(".mark-card");

  questionsmarked= document.createElement("div");

  questionsmarked.textContent=` Question 1 `
  devCards.appendChild(questionsmarked)

  }else{
       markbtn.textContent="Mark"
       questionsmarked.style.display='none';

  }
 

});

}
MarkedQuestions()

