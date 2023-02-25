let audio = new Audio(
  "https://coderadio-relay-nyc.freecodecamp.org/radio/8010/radio.mp3"
)
let isPlaying = false

let timerInterval = null
let remainingTime = 0
const TWENTY_FIVE_MINUTES = 60 * 25
const FIVE_MINUTES = 60 * 5

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "play") {
    if (!isPlaying) {
      audio.play()
      isPlaying = true
      if (timerInterval === null) {
        startTimer(TWENTY_FIVE_MINUTES)
      }
    }
  } else if (request.action == "pause") {
    if (isPlaying) {
      audio.pause()
      isPlaying = false
      remainingTime = 0
      stopTimer()
    }
  }else if(request.action === "mute"){
    if(isPlaying){
      audio.muted = audio.muted ? false : true;
      sendResponse({muted: audio.muted})
    }
  }
  sendResponse({ remainingTime: remainingTime })
})


chrome.alarms.onAlarm.addListener((req) => {
  if (req.name === "break") {
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: "icon.png",
        title: "Times up!",
        message: "Take a rest human!",
        silent: false,
      },
      () => {
        return true
      }
    )
  } else {
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: "icon.png",
        title: "Break is Off!",
        message: "Continue the epic grinding!",
        silent: false,
      },
      () => {
        return true
      }
    )
  }
})

function createAlarm(type) {
  if (type === "break") {
    chrome.alarms.create("break", {
      when: new Date().getTime(),
    })
  } else {
    chrome.alarms.create("break_off", {
      when: new Date().getTime(),
    })
  }
}


function startTimer(time) {
  let isBreakTime = time === FIVE_MINUTES
  let endTime = Date.now() + (remainingTime || time) * 1000
  timerInterval = setInterval(function () {
    remainingTime = Math.floor((endTime - Date.now()) / 1000)
    if (remainingTime < 0) {
      remainingTime = 0
      stopTimer()

      if (!isBreakTime) {
        breakTimer()
        createAlarm("break")
      } else {
        createAlarm("break_off")
      }
    }
  }, 1000)
}

function stopTimer() {
  clearInterval(timerInterval)
  timerInterval = null
  // Stop audio
  audio.pause()
  isPlaying = false
}

async function breakTimer() {
  startTimer(FIVE_MINUTES)
}

