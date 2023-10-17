const questionsNumber = document.getElementById("questionsNumber");
const difficultyOptions = document.getElementById("difficultyOptions");
const categoryMenu = document.getElementById("categoryMenu");
const questionContainer = document.getElementById("questionContainer");
let score = 0;

let allDAtaForQuestion;

$("#btnStart").click(async function () {
  const numbers = questionsNumber.value;
  const difficulty = difficultyOptions.value;
  const category = categoryMenu.value;
  const quiz1 = new Quiz(numbers, difficulty, category);
  allDAtaForQuestion = await quiz1.getDate();
  console.log(allDAtaForQuestion);
  const question1 = new Question(0);
  question1.displayQuestion();
  document.getElementById("form").classList.replace("d-flex", "d-none");
});

class Quiz {
  constructor(numbers, difficulty, category) {
    this.numbers = numbers;
    this.difficulty = difficulty;
    this.category = category;
  }
  async getDate() {
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${this.numbers}&category=${this.category}&difficulty=${this.difficulty}`
    );
    const date = await res.json();
    return date.results;
  }

  endQuiz(){
    return   `
    <div class="theQuestion mx-auto mt-1 pt-5 ">
        <h2 class="text-center pt-3">score is ${score} </h2>
        <h2 class="text-center mt-5 bg-">try again<i onclick='location.reload();' class="fa-solid fs-4 ms-2 fa-arrow-rotate-right"></i></h2>
    </div>

    `
  }




   
    

  
}


class Question {
  constructor(index) {
    this.quetion = allDAtaForQuestion[index].question;
    this.category = allDAtaForQuestion[index].category;
    this.correctAnswer = allDAtaForQuestion[index].correct_answer;
    this.incorrectAnswer = allDAtaForQuestion[index].incorrect_answers;
    this.allAnswers = this.incorrectAnswer.concat(this.correctAnswer).sort();
    this.index = index;
    this.answered = false;
  }
  async displayQuestion() {
    const question = `
        
        
            <div class="theQuestion mx-auto mt-1">

                <div class="header d-flex p-3 justify-content-between ">
                    <h6 class="animals">${this.category}</h6>
                    <h6 class="numberOfQuestion">${this.index + 1} Question ${
      allDAtaForQuestion.length
    } </h6>
                </div>

                    <h5 class="text-center">${this.quetion}</h5>
                
               
                <div class="answer  d-flex justify-content-between flex-wrap  px-4 mt-3">
                ${this.allAnswers
                  .map((Answer) => {
                    return `<h5 class="d-flex justify-content-center align-items-center">${Answer}</h5>`;
                  })
                  .join("")}
               
                </div>

                <h4 class="text-center fs-3 mt-2 fw-bolder"> <span><i class="fa-regular fa-face-smile"></i> score:${score} </span></h4>
                

            </div>

        
        
        `;
    questionContainer.innerHTML = question;
    const answer = document.querySelectorAll(".answer h5");
    for (let i = 0; i < answer.length; i++) {
      answer[i].addEventListener("click", (e) => {
        this.checkAnswer(e);
      });
    }
  }

  checkAnswer(e) {
    const event = e;
    if (!this.answered) {
      this.answered = true;
      const userAnswer = e.target.innerHTML;
      if (userAnswer == this.correctAnswer) {
        score++;
        $(e.target).css("backgroundColor", "green");
        $(e.target).css("color", "white");
        $(e.target).css("border", "none");
        e.target.classList.add("animate__animated","animate__bounceIn")
      } else {
        $(e.target).css("backgroundColor", "red");
        $(e.target).css("color", "white");
        $(e.target).css("border", "none");
        e.target.classList.add("animate__animated","animate__shakeX")
      }
    }
    setTimeout(() => {
      this.nextQuestion(event);
    }, 1000);
  }

  nextQuestion(e) {
    questionContainer.classList.add("animate__animated","animate__backOutLeft");
    setTimeout(() => {
      
      questionContainer.classList.remove("animate__animated","animate__backOutLeft");
      if (
        (this.allAnswers.includes(e.target.innerHTML) == true) &
        (this.index < allDAtaForQuestion.length - 1)
      ) {
        this.index += 1;
        const question = new Question(this.index);
        question.displayQuestion();
        return;
      }
  
    const gameOver = new Quiz();
      questionContainer.innerHTML = gameOver.endQuiz();
  
      
    }, 1000);

    
   
    

  }

}
