let timerInterval = null;

function sendMessage(action) {
  chrome.runtime.sendMessage({ action: action });
  if (action === 'pause') {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimer(duration, display) {
  let timer = duration, minutes, seconds;
  timerInterval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = duration;
      sendMessage('pause');
      display.textContent = "25:00";
      alert("Time's up!");
    }
  }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
  let twentyFiveMinutes = 60 * 25;
  let display = document.querySelector('#timer');
  display.textContent = "25:00";

  document.getElementById('playButton').addEventListener('click', function() {
    if (timerInterval === null) {
      startTimer(twentyFiveMinutes, display);
    }
    sendMessage('play');
  });

  document.getElementById('pauseButton').addEventListener('click', function() {
    sendMessage('pause');
    display.textContent = "25:00";
  });
});