const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trackTitle = document.getElementById("trackTitle");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const progressCircle = document.querySelector(".circular-progress circle.progress");
const progressContainer = document.querySelector(".circular-progress-container");

const playlistDropdown = document.getElementById("playlistDropdown");
const playlistToggle = document.getElementById("playlistToggle");
const playlistContainer = document.getElementById("playlist");

// Calculate circumference dynamically
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

// Sample Playlists
const playlists = {
  1: [
    { title: "Angreji Beat - Honey Singh", src: "songs/Angreji Beat - Honey Singh.mp3" },
    { title: "Blue Eyes - Honey Singh", src: "songs/Blue Eyes - Honey Singh.mp3" },
    { title: "Brown Rang - Honey Singh", src: "songs/Brown Rang - Honey Singh.mp3" },
    { title: "Desi Kalakaar - Honey Singh", src: "songs/Desi Kalakaar - Honey Singh.mp3" },
    { title: "Dope Shope - Honey Singh", src: "songs/Dope Shope - Honey Singh.mp3" },
    { title: "High Heels - Honey Singh", src: "songs/High Heels - Honey Singh.mp3" },
    { title: "Millionaire - Honey Singh", src: "songs/Millionaire - Honey Singh.mp3" },
    { title: "One Bottle Down - Honey Singh", src: "songs/One Bottle Down - Honey Singh.mp3" }
  ],
  2: [
    { title: "Chura Liya Hai Tumne", src: "songs/songs2/Chura Liya Hai Tumne.mp3" },
    { title: "Kishore Kumar – Roop Tera Mastana (Jhankar Beats)", src: "songs/songs2/Kishore Kumar – Roop Tera Mastana (Jhankar Beats).mp3" },
    { title: "Kishore Kumar – ZINDAGI EK SAFAR HAI SUHANA", src: "songs/songs2/Kishore Kumar – ZINDAGI EK SAFAR HAI SUHANA.mp3" },
    { title: "kyu hua tera wada", src: "songs/songs2/kyu hua tera wada.mp3" },
    { title: "Lata Mangeshkar – Hum Dono Do Premi", src: "songs/songs2/Lata Mangeshkar – Hum Dono Do Premi.mp3" },
    { title: "o saathi re", src: "songs/songs2/o saathi re.mp3" },
    { title: "ye sham mastani", src: "songs/songs2/ye sham mastani.mp3" },
    { title: "yeh ladka hai deewana", src: "songs/songs2/yeh ladka hai deewana.mp3" }
    
  ]
};

let currentPlaylist = [];
let currentIndex = 0;

// Toggle dropdown
playlistToggle.addEventListener("click", () => {
  playlistDropdown.classList.toggle("open");
});

// Load playlist
document.querySelectorAll(".playlist-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.playlist;
    loadPlaylist(playlists[id]);
  });
});

function loadPlaylist(list) {
  currentPlaylist = list;
  currentIndex = 0;
  playlistContainer.innerHTML = "";

  currentPlaylist.forEach((track, index) => {
    const div = document.createElement("div");
    div.className = "track-card";
    div.textContent = track.title;
    div.addEventListener("click", () => loadTrack(index));
    playlistContainer.appendChild(div);
  });

  loadTrack(0);
}

function loadTrack(index) {
  currentIndex = index;
  const track = currentPlaylist[currentIndex];
  audio.src = track.src;
  trackTitle.textContent = "Track: " + track.title;

  document.querySelectorAll(".track-card").forEach((card, i) => {
    card.classList.toggle("active", i === currentIndex);
  });

  playTrack();
}

function playTrack() {
  audio.play();
  playPauseBtn.textContent = "⏸️";
}

function pauseTrack() {
  audio.pause();
  playPauseBtn.textContent = "▶️";
}

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) playTrack();
  else pauseTrack();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % currentPlaylist.length;
  loadTrack(currentIndex);
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  loadTrack(currentIndex);
});

// Auto-next track
audio.addEventListener("ended", () => {
  nextBtn.click();
});

// Update progress
audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  if (!isNaN(duration)) {
    const progress = (currentTime / duration) * circumference;
    progressCircle.style.strokeDashoffset = circumference - progress;
  }

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

// Click-to-seek
progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  let angle = Math.atan2(dy, dx) + Math.PI/2;
  if (angle < 0) angle += 2 * Math.PI;
  const fraction = angle / (2 * Math.PI);
  if (!isNaN(audio.duration)) audio.currentTime = fraction * audio.duration;
});

function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}
