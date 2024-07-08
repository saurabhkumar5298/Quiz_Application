let score = 0;
let timer = 60;
let interval;

const scoreDisplay = document.getElementById("score");
const startRulesDiv = document.getElementById("start-rules");

document.getElementById("startQuiz").addEventListener("click", function () {
  startRulesDiv.style.display = "none";
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");
  getQuestion();
  startTimer();
  updateScore();
});

document.getElementById("playAgain").addEventListener("click", function () {
  score = 0;
  timer = 60;
  document.getElementById("endScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");
  getQuestion();
  startTimer();
  updateScore();
});

async function getQuestion() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=1");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // console.log("res", response)
    const data = await response.json();
    console.log("data is ", data);
    const question = data.results[0];
    document.getElementById("question").textContent = question.question;

    const correctIndex = Math.floor(Math.random() * 4);
    console.log("correct indx", correctIndex);
    const answerButtons = document.querySelectorAll(".answer");

    answerButtons.forEach((button, index) => {
      if (index === correctIndex) {
        button.textContent = question.correct_answer;
        button.onclick = () => correctAnswer();
      } else {
        button.textContent = question.incorrect_answers.pop();
        button.onclick = () => wrongAnswer();
      }
    });
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
    document.getElementById("question").textContent =
      "Error fetching the question. Please try again.";
  }
}

function correctAnswer() {
  score += 10;
  updateScore();
  getQuestion();
}

function wrongAnswer() {
  getQuestion();
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(function () {
    timer -= 1;
    document.getElementById("timer").textContent =
      "Time left: " + timer + " seconds";
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(interval);
  document.getElementById("quizScreen").classList.add("hidden");
  const endMessage = document.getElementById("endMessage");
  const finalScoreDisplay = document.getElementById("finalScore");

  if (score <= 20) {
    endMessage.textContent = "You played poor.";
  } else if (score > 20 && score <= 50) {
    endMessage.textContent = "You played good";
  } else {
    endMessage.textContent = "You were excellent during the quizz.";
  }

  endMessage.classList.remove("hidden");
  finalScoreDisplay.textContent = "Your score: " + score;
  document.getElementById("endScreen").classList.remove("hidden");
}