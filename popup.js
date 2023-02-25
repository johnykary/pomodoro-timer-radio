const TWENTY_FIVE_MINUTES = "25:00"
const FIVE_MINUTES = "05:00"
let isOnBreak = false

function sendMessage(action, callback) {
  chrome.runtime.sendMessage({ action: action }, callback)
}

document.addEventListener("DOMContentLoaded", function () {
  let timerDisplay = document.querySelector("#timer")
  let timerInterval

  timerDisplay.textContent = TWENTY_FIVE_MINUTES

  const muteIcon = document.getElementById("muteIcon")

  // Get the mute state using the Chrome storage API
  chrome.storage.sync.get({ isMuted: false }, function (data) {
    if (data.isMuted) {
      muteIcon.classList.add("bi-volume-up");
    } else {
      muteIcon.classList.add("bi-volume-mute");
    }
  });
  document.getElementById("playButton").addEventListener("click", function () {
    sendMessage("play", function (response) {
      isOnBreak = false
      startTimer(response.remainingTime)
    })
  })

  document.getElementById("pauseButton").addEventListener("click", function () {
    sendMessage("pause", function (response) {
      resetTimer()
    })
  })

  document.getElementById("muteButton").addEventListener("click", function () {
    sendMessage("mute", function (response) {
      const muteIcon = document.getElementById("muteIcon")
      if (response.muted) {
        muteIcon.classList.remove("bi-volume-mute");
        muteIcon.classList.add("bi-volume-up");
      } else {
        muteIcon.classList.remove("bi-volume-up");
        muteIcon.classList.add("bi-volume-mute");
      }

      chrome.storage.sync.set({ isMuted: response.muted })
    })
  })

  function startTimer(initialTime) {
    let remainingSeconds = initialTime || 60 * 25
    let minutes, seconds
    let updateDisplay = function () {
      minutes = parseInt(remainingSeconds / 60, 10)
      seconds = parseInt(remainingSeconds % 60, 10)
      minutes = minutes < 10 ? "0" + minutes : minutes
      seconds = seconds < 10 ? "0" + seconds : seconds
      timerDisplay.textContent = minutes + ":" + seconds
      remainingSeconds--
      if (remainingSeconds < 0) {
        clearInterval(timerInterval)

        // Break starts
        startTimer(5)
        if (!isOnBreak) {
          isOnBreak = true
          timerDisplay.textContent = FIVE_MINUTES
          startTimer(5)
        } else {
          timerDisplay.textContent = TWENTY_FIVE_MINUTES
        }
      }
    }
    updateDisplay()
    timerInterval = setInterval(updateDisplay, 1000)
  }

  function resetTimer() {
    clearInterval(timerInterval)
    timerDisplay.textContent = TWENTY_FIVE_MINUTES
  }

  sendMessage("getStatus", function (response) {
    if (response.remainingTime > 0) {
      startTimer(response.remainingTime)
    }
  })
})
