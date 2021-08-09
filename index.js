const video = document.querySelector('video');
const playButton = document.querySelector('.play-button');
const volumeButton = document.querySelector('.volume-button');
const playSVG = 'url("assets/video/play.svg")';
const pauseSVG = 'url("assets/video/pause.svg")';
const volSVG = 'url("assets/video/volume.svg")';
const muteSVG = 'url("assets/video/mute.svg")';
const videoProgress = document.querySelector('#video-progress');
const volumeProgress = document.querySelector('#volume-progress')
const videoProgressText = document.querySelector('.video-progress-text');
const speedControl = document.querySelector('.speed-control');
const speed = speedControl.querySelector('.speed');
const speedValue = speed.querySelector('.speed-value')
let videoDuration;
let videoLengthMinutes;
let videoLengthSeconds;
let videoFullLength;
let currentTime;
let timer;

volumeProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${volumeProgress.value * 100}%, #fff ${volumeProgress.value * 100}%, white 100%)`

video.addEventListener('loadedmetadata', () => {
  videoDuration = video.duration;
  currentTime = video.currentTime;
  videoLengthMinutes = Math.floor(videoDuration / 60) < 10 ? `0${Math.floor(videoDuration / 60)}` : Math.floor(videoDuration / 60);
  videoLengthSeconds = Math.floor(videoDuration % 60) < 10 ? `0${Math.floor(videoDuration % 60)}` : Math.floor(videoDuration % 60);
  videoFullLength = `${videoLengthMinutes}:${videoLengthSeconds}`
  videoProgress.setAttribute("max", videoDuration)
  videoProgressText.textContent = `00:00/${videoFullLength}`;
})

playButton.addEventListener('click', videoControl);
video.addEventListener('play', () => { 
  timer = setInterval(updateCurrentTime, 950);
})

volumeButton.addEventListener('click', volumeControl)

videoProgress.addEventListener('change', () => {
  video.currentTime = videoProgress.value;
  let progressPercent = video.currentTime / videoDuration * 100;
  videoProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${progressPercent}%, #fff ${progressPercent}%, white 100%)`
})

volumeProgress.addEventListener('pointermove', () => {
  video.volume = volumeProgress.value;
  if (video.volume == 0) {
    volumeButton.style.backgroundImage = muteSVG;
  }
  else {
    volumeButton.style.backgroundImage = volSVG;
    volumeProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${volumeProgress.value * 100}%, #fff ${volumeProgress.value * 100}%, white 100%)`
  }
})

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
    videoProgressText.textContent = `0:0/${MvideoFullLength}`;
    videoProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${0}%, #fff ${0}%, white 100%)`
    removeInterval(timer)
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

speedControl.addEventListener('pointermove', (event) => {
  const value = event.pageY - speedControl.offsetTop;
  const step = speedControl.offsetHeight / 9;
  let playbackRate = 0.25 * (10 - Math.round(value / step));
  speed.style.height = `${(1- playbackRate / 2.5) * 100}%`;
  speedValue.textContent = `${playbackRate}x`
  video.playbackRate = playbackRate;
})