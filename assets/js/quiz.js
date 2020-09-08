function buildQuiz() {
  const output = [];

  quizQuestions.forEach((currentQuestion, questionNumber) => {
    const answers = [];
    for (letter in currentQuestion.answers) {
      answers.push(
        `<label class="option button text-center">
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${currentQuestion.answers[letter]}
             <span class="checkmark"></span>
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
  });
  resultsContainer.innerHTML = `${numCorrect} out of ${quizQuestions.length}`;
  restartButton.style.display = "inline-block";
  checkAnswersButton.style.display = "inline-block";
}

function checkAnswers() {
  const answerContainers = quizContainer.querySelectorAll(".answers");

  quizQuestions.forEach((currentQuestion, questionNumber) => {
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;
    if (userAnswer === currentQuestion.correctAnswer) {
      // color the answers green
      answerContainers[questionNumber].style.color = "lightgreen";
    }
    // if answer is wrong or blank
    else {
      // color the answers red
      answerContainers[questionNumber].style.color = "red";
    }
  });
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
