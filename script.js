const audio = document.querySelector(".audio");
const playBtn = document.querySelector(".play-btn");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const progressBar = document.querySelector(".progress input[type='range']");
const volumeBar = document.querySelector(".volume input[type='range']");
const title = document.querySelector(".playing-info .title");
const artist = document.querySelector(".playing-info .artist");
const playingPhoto = document.querySelector(".playing-photo img");
const carousel = document.querySelector(".carousel");
const searchInput = document.querySelector(".input-search input");
const searchBtn = document.querySelector(".input-search button");

let songs = [];
let songIndex = 0;
let isPlaying = false;

const trendingSongs = [
  { title: "Snowman", artist: "Sia" },
  { title: "Forever Young", artist: "Alphaville"},
  { title: "Sweater Weather", artist: "The Neighbourhood" },
  { title: "Diet Mountain Dew", artist: "Lana Del Rey" },
  { title: "Shape of My Heart", artist: "Sting" },
  { title: "Those Eyes", artist: "New West" },
  { title: "Die With A Smile", artist: "Lady Gaga & Bruno Mars" },
  { title: "Perfect", artist: "Ed Sheeran" },
];

let callbackCounter = 0;

function updateFill(element){
  const percent = (element.value - element.min) / (element.max - element.min) * 100;
  element.style.background = `linear-gradient(to right, #702B81 ${percent}%, white ${percent}%)`;
}

function loadSong(index){
  const song = songs[index];
  if (!song) return;
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  playingPhoto.src = song.img;
  progressBar.value = 0;
  updateFill(progressBar);
  playBtn.querySelector("img").src = "./icons/play.svg";
  isPlaying = false;
}

function playSong(){
  audio.play().then(() => {
    isPlaying = true;
    playBtn.querySelector("img").src = "./icons/pause.svg";
  }).catch(err => console.log(err));
}

function pauseSong(){
  audio.pause();
  isPlaying = false;
  playBtn.querySelector("img").src = "./icons/play.svg";
}

function togglePlay(){
  isPlaying ? pauseSong() : playSong();
}

function prevSong(){
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songIndex);
  playSong();
}

function nextSong(){
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songIndex);
  playSong();
}

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    updateFill(progressBar);
  }
});

progressBar.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
    updateFill(progressBar);
  }
});

volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value;
  updateFill(volumeBar);
});

audio.addEventListener("ended", nextSong);

function buildCarousel(list) {
  carousel.innerHTML = "";
  list.forEach((song, id) => {
    const card = document.createElement("div");
    card.classList.add("card", `color-${id % 6}`);
    card.innerHTML = `
      <img src="${song.img}" alt="${song.title}">
      <div>
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
      </div>`;
    card.addEventListener("click", () => {
      songIndex = id;
      loadSong(songIndex);
      audio.onloadedmetadata = () => {
        playSong();
        audio.onloadedmetadata = null;
      };
    });
    carousel.appendChild(card);
  });
}

function fetchDeezerTrack(song, callbackName) {
  const query = encodeURIComponent(`${song.title} ${song.artist}`);
  const script = document.createElement("script");
  script.src = `https://api.deezer.com/search?q=${query}&limit=1&output=jsonp&callback=${callbackName}`;
  document.body.appendChild(script);
}

function fetchSongs() {
  trendingSongs.forEach(song => {
    const callbackName = `deezerCallback${callbackCounter++}`;
    window[callbackName] = function(data) {
      if (data.data && data.data.length > 0) {
        const track = data.data[0];
        songs.push({
          title: track.title,
          artist: track.artist.name,
          src: track.preview,
          img: track.album.cover_medium
        });
      } else {
        songs.push({
          title: song.title,
          artist: song.artist,
          src: "",
          img: "./images/default.jpg"
        });
      }
      if (songs.length === trendingSongs.length) {
        loadSong(0);
        buildCarousel(songs);
      }
      delete window[callbackName];
    };
    fetchDeezerTrack(song, callbackName);
  });
}

function searchSong(query) {
  const callbackName = `deezerSearchCallback${callbackCounter++}`;
  window[callbackName] = function(data) {
    if (data.data && data.data.length > 0) {
      const searchResults = data.data.slice(0, 30).map(track => ({
        title: track.title,
        artist: track.artist.name,
        src: track.preview,
        img: track.album.cover_medium
      }));
      buildCarousel(searchResults);
      songs = searchResults;
      songIndex = 0;
      loadSong(0);
    } else {
      alert("No results found!");
    }
    delete window[callbackName];
  };
  const encodedQuery = encodeURIComponent(query);
  const script = document.createElement("script");
  script.src = `https://api.deezer.com/search?q=${encodedQuery}&limit=30&output=jsonp&callback=${callbackName}`;
  document.body.appendChild(script);
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) searchSong(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) searchSong(query);
  }
});

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

fetchSongs();
updateFill(progressBar);
updateFill(volumeBar);
