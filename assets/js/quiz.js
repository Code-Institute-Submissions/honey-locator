
// Quiz questions

let questions = [
  {
    question:
      "Approximately how many flowers must honeybees visit to make one kilogram of honey?",
    option1: "Four Hundred",
    option2: "Four Thousand",
    option3: "Four Million",
    corAnswer: "3",
  },
  {
    question:
      "How many miles does a beehive fly (collectively) to make a pound of honey?",
    option1: "55,000 miles",
    option2: "100,00 miles",
    option3: "900 miles",
    corAnswer: "1",
  },
  {
    question: "How much honey does an average worker bee make in its lifetime?",
    option1: "Half a teaspoon",
    option2: "One whole teaspoon",
    option3: "One tenth of a teaspoon",
    corAnswer: "3",
  },
  {
    question:
      "A bees' buzz is the sound made by the beat of their wings, how many times do the beat per minute?",
    option1: "1400 times",
    option2: "11,400 times",
    option3: "140 times",
    corAnswer: "2",
  },
  {
    question: "How fast can a honeybee fly?",
    option1: "Up to five miles per hour",
    option2: "Up to ten miles per hour",
    option3: "Up to fifteen miles per hour",
    corAnswer: "2",
  },
];

let currentQuestion = 0;
let question = document.getElementById("question");
let score = 0;

let quizHandlers = {
  loadQuestion: function (i) {
    let option1 = document.getElementById("option1");
    let option2 = document.getElementById("option2");
    let option3 = document.getElementById("option3");
    let q = questions[i];
    question.textContent = i + 1 + ". " + q.question;
    option1.textContent = q.option1;
    option2.textContent = q.option2;
    option3.textContent = q.option3;
  },

  nextQuestion: function () {
    let totalQuestions = questions.length;
    let quizResultsContainer = document.getElementById("quizResultsContainer");
    let quizQuestionsContainer = document.getElementById(
      "quizQuestionsContainer"
    );
    let quizNextContainer = document.getElementById("nextContainer");
    let restart = document.getElementById("restart");
    let showAnswers = document.getElementById("showAnswers");
    let selectedOption = document.querySelector("input[type = radio]:checked");

    if (!selectedOption) {
      alert("Please choose an answer");
    }

    let corAnswer = selectedOption.value;
    if (questions[currentQuestion].corAnswer == corAnswer) {
      score += 1;
    }

    selectedOption.checked = false;
    currentQuestion++;
    if (currentQuestion === totalQuestions - 1) {
      nextBtn.textContent = "Finish";
    }
    if (currentQuestion === totalQuestions) {
      quizQuestionsContainer.style.display = "none";
      quizNextContainer.style.display = "none";
      quizResultsContainer.style.display = "";
      quizResultsContainer.innerHTML = `<div class="content-text center p-5"><h2>Your Score  ${score} / 5!</h2></div>`;
      quizResultsContainer.appendChild(showAnswers);
      quizResultsContainer.appendChild(restart);
      return;
    }
    progBar.value = progBar.value + 10;
    quizHandlers.loadQuestion(currentQuestion);
  },

  restartQuiz: function () {
    location.reload();
    return false;
  },
};

$(document).ready(function () {
  $("#answers").hide();
  $("#showAnswers").click(function () {
    $("#answers").toggle();
  });
});

quizHandlers.loadQuestion(currentQuestion);
