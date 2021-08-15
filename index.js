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

let videoDuration;
let videoLengthMinutes;
let videoLengthSeconds;
let videoFullLength;
let currentTime;
let timer;
let timerInterval;
video.volume = 0.5;
volumeProgress.value = video.volume;
volumeProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${volumeProgress.value * 100}%, #fff ${volumeProgress.value * 100}%, white 100%)`

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

video.addEventListener('loadedmetadata', () => {
  videoDuration = video.duration;
  videoLengthMinutes = Math.floor(videoDuration / 60) < 10 ? `0${Math.floor(videoDuration / 60)}` : Math.floor(videoDuration / 60);
  videoLengthSeconds = Math.floor(videoDuration % 60) < 10 ? `0${Math.floor(videoDuration % 60)}` : Math.floor(videoDuration % 60);
  videoFullLength = `${videoLengthMinutes}:${videoLengthSeconds}`
  videoProgress.setAttribute("max", videoDuration)
  videoProgressText.textContent = `00:00/${videoFullLength}`;  
})

video.addEventListener('click', videoControl)

playButton.addEventListener('click', videoControl);
video.addEventListener('play', () => { 
  timerInterval = setInterval(updateCurrentTime, 1000);
})

videoProgress.addEventListener('change', () => {
  video.currentTime = videoProgress.value;
  let progressPercent = video.currentTime / videoDuration * 100;
  videoProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${progressPercent}%, #fff ${progressPercent}%, white 100%)`
})

volumeButton.addEventListener('click', volumeControl)

volumeProgress.addEventListener('pointermove', () => {
  video.volume = volumeProgress.value;
  updateVolume();
})

function updateVolume() {
  volumeProgress.value = video.volume;
  volumeProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${volumeProgress.value * 100}%, #fff ${volumeProgress.value * 100}%, white 100%)`
  if (video.volume == 0) {
    volumeButton.style.backgroundImage = muteSVG;
  }
  else {
    volumeButton.style.backgroundImage = volSVG;
  }
}

function updateCurrentTime() {
  currentTime = video.currentTime;
  videoProgress.value = currentTime;
  let progressPercent = video.currentTime / videoDuration * 100;
  let currentMinutes = Math.floor(currentTime / 60) < 10 ? `0${Math.floor(currentTime / 60)}` : Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60) < 10 ? `0${Math.floor(currentTime % 60)}` : Math.floor(currentTime % 60);
  videoProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${progressPercent}%, #fff ${progressPercent}%, white 100%)`
  videoProgressText.textContent = `${currentMinutes}:${currentSeconds}/${videoFullLength}`;
  if (video.currentTime == video.duration) {
    playButton.classList.toggle('playing');
    playButton.style.backgroundImage = playSVG;
    videoProgress.value = 0;
    videoProgressText.textContent = `00:00/${videoFullLength}`;
    videoProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 0%, #fff 0%, white 100%)`
    clearInterval(timerInterval)
  }
}

function videoControl() {
  playButton.classList.toggle('playing');
  if (playButton.classList.contains('playing')) {
    playButton.style.backgroundImage = pauseSVG;
    video.play();
  }
  else {
    playButton.style.backgroundImage = playSVG;
    video.pause();
  }
  playButton.blur();
}

function volumeControl() {
  volumeButton.classList.toggle('active');
  if (volumeButton.classList.contains('active')) {
    volumeButton.style.backgroundImage = volSVG;
    video.muted = false;
  }
  else {
    volumeButton.style.backgroundImage = muteSVG;
    video.muted = true;
  }
}

function fullScreen() {
  if (!document.fullscreenElement) {
    video.requestFullscreen();
  }
  else {
    document.exitFullscreen();
  }
}

document.addEventListener('keydown', (evt) => {
  const pressedKey = evt.code;
  if (Object.keys(HOTKEYS).includes(pressedKey)) {
    HOTKEYS[pressedKey](evt);
  }
})

function showPlaybackRate() {
  if (timer) clearTimeout(timer);
  playbackRateElem.textContent = `${video.playbackRate}x`;
  if (!playbackRateElem.classList.contains('visible')) {
    playbackRateElem.classList.toggle('visible')
  }
  timer = setTimeout(() => playbackRateElem.classList.toggle('visible'), 3000)
}

function showRewind(event) {
  if (timer) clearTimeout(timer);
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
  timer = setTimeout(() => rewind.classList.toggle('visible'), 3000);
}