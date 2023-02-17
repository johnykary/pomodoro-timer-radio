let audio = new Audio('https://coderadio-relay-nyc.freecodecamp.org/radio/8010/radio.mp3');
let isPlaying = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == 'play') {
    if (!isPlaying) {
      audio.play();
      isPlaying = true;
    }
  } else if (request.action == 'pause') {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    }
  }
});