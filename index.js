const video = document.querySelector('video');
const playButton = document.querySelector('.play-button');
const volumeButton = document.querySelector('.volume-button');
const videoProgress = document.querySelector('#video-progress');
const volumeProgress = document.querySelector('#volume-progress');
const videoProgressText = document.querySelector('.video-progress-text');
const playbackRateElem = document.querySelector('.playback-rate');
const rewind = document.querySelector('.rewind');
const playSVG = 'url("assets/video/svg/play.svg")';
const pauseSVG = 'url("assets/video/svg/pause.svg")';
const volSVG = 'url("assets/video/svg/volume.svg")';
const muteSVG = 'url("assets/video/svg/mute.svg")';
const forwardSVG = 'url("assets/video/svg/forward-10.svg")';
const rewindSVG = 'url("assets/video/svg/rewind-10.svg")';

let currentTime;
let videoFullLength;
let timerRewind;
let timerPlaybackRate
let timerInterval;
let volumeValue = 0.5;

const HOTKEYS = {
  'KeyM': () => {
    volumeControl();
  },
  'KeyF': () => {
    fullScreen();
  },
  'KeyJ': (event) => {
    video.currentTime = video.currentTime - 10;
    showRewind(event)
  },
  'KeyL': (event) => {
    video.currentTime = video.currentTime + 10;
    showRewind(event)
  },
  'Space': () => {
    if (document.activeElement.tagName == 'BUTTON') return
    videoControl();
  },
  'Comma': (evt) => {
    if(evt.shiftKey) {
      video.playbackRate = video.playbackRate == 0.25 ? video.playbackRate : video.playbackRate - 0.25;
      showPlaybackRate();
    }
  },
  'Period': (evt) => {
    if(evt.shiftKey) {
      video.playbackRate = video.playbackRate == 2.5 ? video.playbackRate : video.playbackRate + 0.25;
      showPlaybackRate();
    }
  },
  'ArrowUp': () => {
    video.volume = video.volume > 0.95 ? 1 : video.volume + 0.05;
    updateVolume();
  },
  'ArrowDown': () => {
    video.volume = video.volume < 0.05 ? 0 : video.volume - 0.05;
    updateVolume();
  }
}

function init() {
  let videoDuration = video.duration;
  let videoLengthMinutes = Math.floor(videoDuration / 60) < 10 ? `0${Math.floor(videoDuration / 60)}` : Math.floor(videoDuration / 60);
  let videoLengthSeconds = Math.floor(videoDuration % 60) < 10 ? `0${Math.floor(videoDuration % 60)}` : Math.floor(videoDuration % 60);
  videoFullLength = `${videoLengthMinutes}:${videoLengthSeconds}`;
  videoProgress.setAttribute("max", videoDuration);
  videoProgressText.textContent = `00:00/${videoFullLength}`;
  video.volume = volumeValue;
  volumeProgress.value = video.volume;
  volumeProgress.style.background = `linear-gradient(to right, #710707 0%, #710707 ${volumeProgress.value * 100}%, #fff ${volumeProgress.value * 100}%, white 100%)` 
}

const pause = document.createElement('img');
pause.setAttribute('src', "assets/video/svg/pause.svg");
const mute = document.createElement('img');
mute.setAttribute('src', "assets/video/svg/mute.svg")

init();
video.addEventListener('loadedmetadata', init)

function updateVideoProgress() {
  videoProgress.value = video.currentTime
  videoDuration = video.duration;
  let progressPercent = video.currentTime / videoDuration * 100;
  videoProgress.style.background = `linear-gradient(to right, #710707 0%, #710707 ${progressPercent}%, #fff ${progressPercent}%, white 100%)`;
}

function updateCurrentTime() {
  currentTime = video.currentTime;
  let currentMinutes = Math.floor(currentTime / 60) < 10 ? `0${Math.floor(currentTime / 60)}` : Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60) < 10 ? `0${Math.floor(currentTime % 60)}` : Math.floor(currentTime % 60);
  videoProgressText.textContent = `${currentMinutes}:${currentSeconds}/${videoFullLength}`;
}

function videoControl() {
  if (video.paused) {
    playButton.style.backgroundImage = pauseSVG;
    video.play();
  }
  else {
    playButton.style.backgroundImage = playSVG;
    video.pause();
  }
}

playButton.addEventListener('click', videoControl);
video.addEventListener('click', videoControl)
video.addEventListener('dblclick', fullScreen)
video.addEventListener('timeupdate', () => {
  updateCurrentTime();
  updateVideoProgress();
})

videoProgress.addEventListener('change', () => {
  video.currentTime = videoProgress.value;
  updateVideoProgress();
})
videoProgress.addEventListener('pointermove', updateVideoProgress);

video.addEventListener('ended', () => {
  playButton.classList.toggle('playing');
  playButton.style.backgroundImage = playSVG;
  videoProgress.value = 0;
  videoProgressText.textContent = `00:00/${videoFullLength}`;
  videoProgress.style.background = `linear-gradient(to right, #710707 0%, #710707 0%, #fff 0%, white 100%)`;
})

function updateVolume() {
  video.volume = volumeProgress.value;
  volumeProgress.style.background = `linear-gradient(to right, #710707 0%, #710707 ${volumeProgress.value * 100}%, #fff ${volumeProgress.value * 100}%, white 100%)`
  if (video.volume == 0) {
    volumeButton.classList.remove('active');
    volumeButton.style.backgroundImage = muteSVG;
  }
  else {
    volumeButton.classList.add('active');
    volumeButton.style.backgroundImage = volSVG;
  }
}

function volumeControl() {
  volumeButton.classList.toggle('active');
  if (volumeButton.classList.contains('active')) {
    video.volume = volumeValue;
    volumeProgress.value = volumeValue;
    updateVolume();
    volumeButton.style.backgroundImage = volSVG;
  }
  else {
    volumeValue = video.volume;
    volumeProgress.value = 0;
    video.volume = 0;
    updateVolume();
    volumeButton.style.backgroundImage = muteSVG;
  }
}

volumeButton.addEventListener('click', volumeControl)
volumeProgress.addEventListener('change', updateVolume)
volumeProgress.addEventListener('pointermove', updateVolume)

function fullScreen() {
  if (!document.fullscreenElement) {
    video.requestFullscreen();
  }
  else {
    document.exitFullscreen();
  }
}

function showPlaybackRate() {
  if (timerPlaybackRate) clearTimeout(timerPlaybackRate);
  playbackRateElem.textContent = `${video.playbackRate}x`;
  if (!playbackRateElem.classList.contains('visible')) {
    playbackRateElem.classList.toggle('visible')
  }
  timerPlaybackRate = setTimeout(() => playbackRateElem.classList.toggle('visible'), 3000)
}

function showRewind(event) {
  if (timerRewind) clearTimeout(timerRewind);
  if (event.code == 'KeyL') {
    rewind.style.backgroundImage = forwardSVG;
    if (!rewind.classList.contains('visible')) {
      rewind.classList.toggle('visible');
    }
  }
  else {
    rewind.style.backgroundImage = rewindSVG;
    if (!rewind.classList.contains('visible')) {
      rewind.classList.toggle('visible');
    }
  }
  timerRewind = setTimeout(() => rewind.classList.toggle('visible'), 3000);
}

document.addEventListener('keydown', (evt) => {
  const pressedKey = evt.code;
  if (Object.keys(HOTKEYS).includes(pressedKey)) {
    HOTKEYS[pressedKey](evt);
  }
})