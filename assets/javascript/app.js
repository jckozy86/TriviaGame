//  Interval Exercise (follow the instructions below).

//  This code will run as soon as the page loads.
window.onload = function () {
  startTimer();
  $("#reset").on("click", reset);
  $(document).on("click", ".answer", checkAnswer);
};

//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

// prevents the clock from being sped up unnecessarily
var time = 60;
var correct = 0;
var wrong = 0;
var skipped = 30;
clockRunning = false;
var isPaused = false;
var queryURL = "https://opentdb.com/api.php?amount=1&category=14&difficulty=easy&type=multiple";

var answer = "";

var resultInterval;

function reset() {

  time = 0;

  //  TODO: Change the "display" div to "00:00."
  $("#display").html("30");
  //********************** */
  getTrivia();

}

function startTimer() {

  //  TODO: Use setInterval to start the count here and set the clock to running.
  if (!clockRunning) {
    console.log("starting the timer")
    clockRunning = true;
    //clearInterval(intervalId);

    getQuestion()

    intervalId = setInterval(count, 1000);
  }

}

function checkAnswer() {

  var guess = $(this).text();

  if (guess === answer) {
    console.log("Correct answer was picked")

    correctAnswer();

    correct++;
    skipped--;

    var remaining = skipped - correct - wrong;

    if (remaining === 0) {
      end();
    } else {
      getQuestion();
    }

  } else {
    console.log("Wrong answer was given")
    wrongAnswer();
    wrong++;
    skipped--;
    var remaining = 30 - correct - wrong;

    if (remaining === 0) {
      console.log("Answered all questions")
      end();
    } else {
      console.log("There are " + remaining + " questions left")
      getQuestion();
    }

  }
}

function correctAnswer() {

  console.log("In correct Answer function")

  isPaused = true;
  var timeleft = 3;

    $("#rightTitle").text("You got the right answer!");

    $("#questions").attr("hidden", true);
    $("#wrong").attr("hidden", true);
    $("#right").attr("hidden", false);
    $("#end").attr("hidden", true);

  var downloadTimer = setInterval(function () {

    console.log("In correct interval timer");
    

    timeleft -= 1;
    if (timeleft <= 0) {

      console.log("Leaving correct interval");
      clearInterval(downloadTimer);

      isPaused = false;

      $("#questions").attr("hidden", false);
      $("#wrong").attr("hidden", true);
      $("#right").attr("hidden", true);
      $("#end").attr("hidden", true);
    }
  }, 1000);
}

function wrongAnswer() {

  console.log("In Wrong Answer function")

  isPaused = true;
  var timeleft = 3;

    $("#wrongTitle").text("You got the WRONG answer!");
    $("#answer").text("Answer is: "+answer);

    $("#questions").attr("hidden", true);
    $("#wrong").attr("hidden", false);
    $("#right").attr("hidden", true);
    $("#end").attr("hidden", true);

  var downloadTimer = setInterval(function () {

    console.log("In wrong interval timer");
    

    timeleft -= 1;
    if (timeleft <= 0) {
      console.log("Leaving wrong interval");
      clearInterval(downloadTimer);

      isPaused = false;

      $("#questions").attr("hidden", false);
      $("#wrong").attr("hidden", true);
      $("#right").attr("hidden", true);
      $("#end").attr("hidden", true);
    }
  }, 1000);
}

function getQuestion() {

  console.log("In get Question function, first clearing #questions tag")

  $("#questions").empty();

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    console.log(response);

    var results = response.results[0];

    var q = $("<p>");
    q.addClass("question");
    q.text(results.question)

    console.log("Adding question text to be: " + results.question)

    $("#questions").append(q);

    var correctIndex = Math.floor(Math.random() * 4);
    var countWrong = 0;

    for (i = 0; i < 4; i++) {

      var answerId = "answer" + i;

      var a = $("<button>");
      a.addClass("answer");
      a.attr("id", answerId);

      //console.log("checking: "+i+" with: "+correctIndex)
      if (i !== correctIndex) {
        a.text(results.incorrect_answers[countWrong])
        countWrong++;
      } else {
        a.text(results.correct_answer)
        answer = results.correct_answer;
      }
      $("#questions").append(a);
      console.log("added button with text: " + a.text());
    }
  });


}

function stop() {

  //  TODO: Use clearInterval to stop the count here and set the clock to not be running.

  clearInterval(intervalId);
  clockRunning = false;

}

function end() {

  stop();
  showResults();

}

function showResults() {

  $("#endTitle").text("All done, here are your results:");
  $("#correct").text("Correct answers: " + correct);
  wrong+=skipped;
  $("#mistakes").text("Wrong answers: " + wrong);

  $("#questions").attr("hidden", true);
  $("#wrong").attr("hidden", true);
  $("#right").attr("hidden", true);
  $("#end").removeAttr("hidden");

}

function count() {

  if( !isPaused ){
    time--;
  }

  if (time === 0) {

    stop();

    showResults();

  }

  $("#time").html(time);

}