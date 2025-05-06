
///func to fet random question and delete it from arr
export function randomQuestion(arr) {
    let newarray = [...arr];

    return function () {
      if (newarray.length === 0) {
        return " no Question !";
      }
      let ranindex = Math.floor(Math.random() * newarray.length);
      return newarray.splice(ranindex, 1)[0];
    };
}


////function to time out

export function Timeout (time){
    setTimeout(function () {
        window.location.href = "#result.html"; 
      }, time*1000); 
      
}