let audio = new Audio('https://coderadio-relay-nyc.freecodecamp.org/radio/8010/radio.mp3');
let isPlaying = false;

let timerInterval = null;
let remainingTime = 0;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == 'play') {
    if (!isPlaying) {
      audio.play();
      isPlaying = true;
      if (timerInterval === null) {
        startTimer();
      }
    }
  } else if (request.action == 'pause') {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      stopTimer();
    }
  }

  sendResponse({ remainingTime: remainingTime });
});


function startTimer() {
  let twentyFiveMinutes = 60 * 25;
  let endTime = Date.now() + (remainingTime || twentyFiveMinutes) * 1000;
  timerInterval = setInterval(function () {
    remainingTime = Math.floor((endTime - Date.now()) / 1000);
    if (remainingTime < 0) {
      remainingTime = 0;
      stopTimer();
      alert("Time's up!");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}
