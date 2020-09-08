function buildQuiz() {
  const output = [];

  quizQuestions.forEach((currentQuestion, questionNumber) => {
    const answers = [];
    for (letter in currentQuestion.answers) {
      answers.push(
        `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label>`
      );
    }
    output.push(
      `  <div class="slide">
            <div class="question"> ${currentQuestion.question} </div>
            <div class="answers"> ${answers.join("")} </div>
            </div>
       `
    );
  });
  quizContainer.innerHTML = output.join("");
}

function showResults() {
  const answerContainers = quizContainer.querySelectorAll(".answers");
  let numCorrect = 0;
  quizQuestions.forEach((currentQuestion, questionNumber) => {
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;
    if (userAnswer === currentQuestion.correctAnswer) {
      // add to the number of correct answers
      numCorrect++;
    }
    checkAnswersButton.onclick = function () {
      if (userAnswer === currentQuestion.correctAnswer) {
        // color the answers green
        answerContainers[questionNumber].style.color = "lightgreen";
      }
      // if answer is wrong or blank
      else {
        // color the answers red
        answerContainers[questionNumber].style.color = "red";
      }
    };
  });
  resultsContainer.innerHTML = `${numCorrect} out of ${quizQuestions.length}`;
  restartButton.style.display = "inline-block";
  checkAnswersButton.style.display = "inline-block";
}

function showSlide(n) {
  slides[currentSlide].classList.remove("active-slide");
  slides[n].classList.add("active-slide");
  currentSlide = n;
  if (currentSlide === 0) {
    previousButton.style.display = "none";
    restartButton.style.display = "none";
    checkAnswersButton.style.display = "none";
  } else {
    previousButton.style.display = "inline-block";
  }
  if (currentSlide === slides.length - 1) {
    nextButton.style.display = "none";
    restartButton.style.display = "none";
    submitButton.style.display = "inline-block";
    checkAnswersButton.style.display = "none";
  } else {
    nextButton.style.display = "inline-block";
    restartButton.style.display = "none";
    submitButton.style.display = "none";
    checkAnswersButton.style.display = "none";
  }
}

function showNextSlide() {
  showSlide(currentSlide + 1);
  progBar.value = progBar.value + 10;
}

function showPreviousSlide() {
  showSlide(currentSlide - 1);
  progBar.value = progBar.value - 10;
}

function restartQuiz() {
  location.reload();
  return false;
}

//Quiz Variables
let quizContainer = document.getElementById("quiz");
let resultsContainer = document.getElementById("results");
let submitButton = document.getElementById("submit");
let checkAnswersButton = document.getElementById("checkAnswers");
let quizQuestions = [
  {
    question:
      "Approximately how many flowers must honeybees visit to make one kilogram of honey?",
    answers: {
      a: "Four Hundred",
      b: "Four Thousand",
      c: "Four Million",
    },
    correctAnswer: "c",
  },
  {
    question:
      "How many miles does a beehive fly (collectively) to make a pound of honey?",
    answers: {
      a: "55,000 miles",
      b: "100,00 miles",
      c: "900 miles",
    },
    correctAnswer: "a",
  },
  {
    question: "How much honey does an average worker bee make in its lifetime?",
    answers: {
      a: "Half a teaspoon",
      b: "One whole teaspoon",
      c: "One tenth of a teaspoon",
    },
    correctAnswer: "c",
  },
  {
    question:
      "A bees' buzz is the sound made by the beat of their wings, how many times do the beat per minute?",
    answers: {
      a: "1400 times",
      b: "11,400 times",
      c: "140 times",
    },
    correctAnswer: "b",
  },
  {
    question: "How fast can a honeybee fly?",
    answers: {
      a: "Up to five miles per hour",
      b: "Up to ten miles per hour",
      c: "Up to fifteen miles per hour",
    },
    correctAnswer: "b",
  },
];
// display the quiz
buildQuiz();

// pagination
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const restartButton = document.getElementById("restart");
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;
showSlide(currentSlide);

// quiz handlers
submitButton.addEventListener("click", showResults);
previousButton.addEventListener("click", showPreviousSlide);
nextButton.addEventListener("click", showNextSlide);
restartButton.addEventListener("click", restartQuiz);
checkAnswersButton.addEventListener("click", checkAnswers);

// let currentQuestion = 0;
// let question = document.getElementById("question");
// let score = 0;

// let quizHandlers = {
//   loadQuestion: function (i) {
//     let option1 = document.getElementById("option1");
//     let option2 = document.getElementById("option2");
//     let option3 = document.getElementById("option3");
//     let q = questions[i];
//     question.textContent = i + 1 + ". " + q.question;
//     option1.textContent = q.option1;
//     option2.textContent = q.option2;
//     option3.textContent = q.option3;
//   },

//   nextQuestion: function () {
//     let totalQuestions = questions.length;
//     let quizResultsContainer = document.getElementById("quizResultsContainer");
//     let quizQuestionsContainer = document.getElementById(
//       "quizQuestionsContainer"
//     );
//     let quizNextContainer = document.getElementById("nextContainer");
//     let restart = document.getElementById("restart");
//     let showAnswers = document.getElementById("showAnswers");
//     let selectedOption = document.querySelector("input[type = radio]:checked");

//     if (!selectedOption) {
//       alert("Please choose an answer");
//     }

//     let corAnswer = selectedOption.value;
//     if (questions[currentQuestion].corAnswer == corAnswer) {
//       score += 1;
//     }

//     selectedOption.checked = false;
//     currentQuestion++;
//     if (currentQuestion === totalQuestions - 1) {
//       nextBtn.textContent = "Finish";
//     }
//     if (currentQuestion === totalQuestions) {
//       quizQuestionsContainer.style.display = "none";
//       quizNextContainer.style.display = "none";
//       quizResultsContainer.style.display = "";
//       quizResultsContainer.innerHTML = `<div class="content-text center p-5"><h2>Your Score  ${score} / 5!</h2></div>`;
//       quizResultsContainer.appendChild(showAnswers);
//       quizResultsContainer.appendChild(restart);
//       return;
//     }
//     progBar.value = progBar.value + 10;
//     quizHandlers.loadQuestion(currentQuestion);
//   },

//   restartQuiz: function () {
//     location.reload();
//     return false;
//   },
// };

// $(document).ready(function () {
//   $("#answers").hide();
//   $("#showAnswers").click(function () {
//     $("#answers").toggle();
//   });
// });

// quizHandlers.loadQuestion(currentQuestion);
