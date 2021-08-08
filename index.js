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
let videoDuration;
let currentTime;

video.addEventListener('loadedmetadata', () => {
  videoDuration = video.duration;
  currentTime = video.currentTime
  videoProgress.setAttribute("max", videoDuration)
  videoProgressText.textContent = `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60)}/${Math.floor(videoDuration / 60)}:${Math.floor(videoDuration % 60)}`;
})

playButton.addEventListener('click', videoControl);
video.addEventListener('play', () => { 
  setInterval(updateCurrentTime, 950);
})

volumeButton.addEventListener('click', volumeControl)

videoProgress.addEventListener('change', () => {
  video.currentTime = videoProgress.value;
})

volumeProgress.addEventListener('pointermove', () => {
  video.volume = volumeProgress.value;
  if (video.volume == 0) {
    volumeButton.style.backgroundImage = muteSVG;
  }
  else {
    volumeButton.style.backgroundImage = volSVG;
  }
})

function updateCurrentTime() {
  currentTime = video.currentTime;
  videoProgress.value = currentTime;
  videoProgressText.textContent = `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60)}/${Math.floor(videoDuration / 60)}:${Math.floor(videoDuration % 60)}`;
  if (video.currentTime == video.duration) {
    playButton.classList.toggle('playing');
    playButton.style.backgroundImage = playSVG;
    videoProgress.value = 0;
    videoProgressText.textContent = `0:0/${Math.floor(videoDuration / 60)}:${Math.floor(videoDuration % 60)}`;
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