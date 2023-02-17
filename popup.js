function sendMessage(action, callback) {
  chrome.runtime.sendMessage({ action: action }, callback);
}

document.addEventListener('DOMContentLoaded', function() {
  let display = document.querySelector('#timer');
  let timerInterval;

  display.textContent = "25:00";

  document.getElementById('playButton').addEventListener('click', function() {
    sendMessage('play', function(response) {
      startTimer(response.remainingTime);
    });
  });

  document.getElementById('pauseButton').addEventListener('click', function() {
    sendMessage('pause', function(response) {
      resetTimer();
    });
  });

  function startTimer(initialTime) {
    let remainingSeconds = initialTime || 25 * 60;
    let minutes, seconds;
    let updateDisplay = function() {
      minutes = parseInt(remainingSeconds / 60, 10);
      seconds = parseInt(remainingSeconds % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      display.textContent = minutes + ":" + seconds;
      remainingSeconds--;
      if (remainingSeconds < 0) {
        clearInterval(timerInterval);
        display.textContent = "00:00";
        alert("Time's up!");
      }
    };
    updateDisplay();
    timerInterval = setInterval(updateDisplay, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    display.textContent = "25:00";
  }

  sendMessage('getStatus', function(response) {
    if (response.remainingTime > 0) {
      startTimer(response.remainingTime);
    }
  });
});