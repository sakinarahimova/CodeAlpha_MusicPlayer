// const audio = document.querySelector(".audio");
// const playBtn = document.querySelector(".play-btn");
// const prevBtn = document.querySelector(".prev-btn");
// const nextBtn = document.querySelector(".next-btn");
// const progressBar = document.querySelector(".progress input[type='range']");
// const volumeBar = document.querySelector(".volume input[type='range']");
// const title = document.querySelector(".playing-info .title");
// const artist = document.querySelector(".playing-info .artist");
// const playingPhoto = document.querySelector(".playing-photo img");
// const carousel = document.querySelector(".carousel");

// let songs = [];
// let songIndex = 0;
// let isPlaying = false;

// // Trending songs
// const trending = [
//   { title: "Snowman", artist: "Sia" },
//   { title: "Sweater Weather", artist: "The Neighbourhood" },
//   { title: "Diet Mountain Dew", artist: "Lana Del Rey" },
//   { title: "Shape of My Heart", artist: "Sting" },
//   { title: "Those Eyes", artist: "New West" },
//   { title: "Die With A Smile", artist: "Lady Gaga & Bruno Mars" },
//   { title: "Perfect", artist: "Ed Sheeran" },
// ];

// // JSONP callback counter
// let callbackCounter = 0;

// // Gradient fill for ranges
// function updateFill(element) {
//   const percent = (element.value - element.min) / (element.max - element.min) * 100;
//   element.style.background = `linear-gradient(to right, #702B81 ${percent}%, white ${percent}%)`;
// }

// // Load song into the right player
// function loadSong(index) {
//   const song = songs[index];
//   title.textContent = song.title;
//   artist.textContent = song.artist;
//   audio.src = song.src;
//   playingPhoto.src = song.img;
//   progressBar.value = 0;
//   updateFill(progressBar);
//   playBtn.querySelector("img").src = "./icons/play.svg";
//   isPlaying = false;
// }

// // Play / Pause functions
// function playSong() {
//   audio.play().then(() => {
//     isPlaying = true;
//     playBtn.querySelector("img").src = "./icons/pausa.svg";
//   }).catch(err => console.log(err));
// }

// function pauseSong() {
//   audio.pause();
//   isPlaying = false;
//   playBtn.querySelector("img").src = "./icons/prev.svg";
// }

// function togglePlay() {
//   isPlaying ? pauseSong() : playSong();
// }

// // Previous / Next
// function prevSong() {
//   songIndex = (songIndex - 1 + songs.length) % songs.length;
//   loadSong(songIndex);
//   playSong();
// }

// function nextSong() {
//   songIndex = (songIndex + 1) % songs.length;
//   loadSong(songIndex);
//   playSong();
// }

// // Progress bar updates
// audio.addEventListener("timeupdate", () => {
//   if (audio.duration) {
//     progressBar.value = (audio.currentTime / audio.duration) * 100;
//     updateFill(progressBar);
//   }
// });
// progressBar.addEventListener("input", () => {
//   if (audio.duration) {
//     audio.currentTime = (progressBar.value / 100) * audio.duration;
//     updateFill(progressBar);
//   }
// });
// volumeBar.addEventListener("input", () => {
//   audio.volume = volumeBar.value;
//   updateFill(volumeBar);
// });
// audio.addEventListener("ended", nextSong);

// // Build carousel
// function buildCarousel() {
//   carousel.innerHTML = "";
//   songs.forEach((song, idx) => {
//     const card = document.createElement("div");
//     card.classList.add("card");
//     card.innerHTML = `
//       <img src="${song.img}" alt="${song.title}">
//       <h3>${song.title}</h3>
//       <p>${song.artist}</p>
//     `;
//     card.addEventListener("click", () => {
//       songIndex = idx;
//       loadSong(songIndex);
//       audio.onloadedmetadata = () => {
//         playSong();
//         audio.onloadedmetadata = null;
//       };
//     });
//     carousel.appendChild(card);
//   });
// }

// // Fetch single Deezer track using JSONP
// function fetchDeezerTrack(song, callbackName) {
//   const query = encodeURIComponent(`${song.title} ${song.artist}`);
//   const script = document.createElement("script");
//   script.src = `https://api.deezer.com/search?q=${query}&limit=1&output=jsonp&callback=${callbackName}`;
//   document.body.appendChild(script);
// }

// // Fetch all songs
// function fetchSongs() {
//   trending.forEach(song => {
//     const callbackName = `deezerCallback${callbackCounter++}`;
//     window[callbackName] = function(data) {
//       if (data.data && data.data.length > 0) {
//         const track = data.data[0];
//         songs.push({
//           title: track.title,
//           artist: track.artist.name,
//           src: track.preview,
//           img: track.album.cover_medium
//         });
//       } else {
//         songs.push({
//           title: song.title,
//           artist: song.artist,
//           src: "",
//           img: "./images/default.jpg"
//         });
//       }
//       // When all songs are fetched, initialize player & carousel
//       if (songs.length === trending.length) {
//         loadSong(0);  // Snowman plays first
//         buildCarousel();
//       }
//       delete window[callbackName];
//     };
//     fetchDeezerTrack(song, callbackName);
//   });
// }

// // Buttons
// playBtn.addEventListener("click", togglePlay);
// prevBtn.addEventListener("click", prevSong);
// nextBtn.addEventListener("click", nextSong);

// // Init
// fetchSongs();
// updateFill(progressBar);
// updateFill(volumeBar);






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
const searchBtn = document.querySelector(".input-search img");

let songs = [];
let songIndex = 0;
let isPlaying = false;

// Trending songs
const trending = [
  { title: "Snowman", artist: "Sia" },
  { title: "Sweater Weather", artist: "The Neighbourhood" },
  { title: "Diet Mountain Dew", artist: "Lana Del Rey" },
  { title: "Shape of My Heart", artist: "Sting" },
  { title: "Those Eyes", artist: "New West" },
  { title: "Die With A Smile", artist: "Lady Gaga & Bruno Mars" },
  { title: "Perfect", artist: "Ed Sheeran" },
];

// JSONP callback counter
let callbackCounter = 0;

// Gradient fill for ranges
function updateFill(element) {
  const percent = (element.value - element.min) / (element.max - element.min) * 100;
  element.style.background = `linear-gradient(to right, #702B81 ${percent}%, white ${percent}%)`;
}

// Load song into the right player
function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  playingPhoto.src = song.img;
  progressBar.value = 0;
  updateFill(progressBar);
  playBtn.querySelector("img").src = "./icons/play.svg";
  isPlaying = false;
}

// Play / Pause functions
function playSong() {
  audio.play().then(() => {
    isPlaying = true;
    playBtn.querySelector("img").src = "./icons/pausa.svg";
  }).catch(err => console.log(err));
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.querySelector("img").src = "./icons/play.svg";
}

function togglePlay() {
  isPlaying ? pauseSong() : playSong();
}

// Previous / Next
function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songIndex);
  playSong();
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songIndex);
  playSong();
}

// Progress bar updates
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

// Build carousel
function buildCarousel(list) {
  carousel.innerHTML = "";
  list.forEach((song, idx) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${song.img}" alt="${song.title}">
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
    `;
    card.addEventListener("click", () => {
      // Replace the currently playing song
      songs.push(song);
      songIndex = songs.length - 1;
      loadSong(songIndex);
      audio.onloadedmetadata = () => {
        playSong();
        audio.onloadedmetadata = null;
      };
    });
    carousel.appendChild(card);
  });
}

// Fetch single Deezer track using JSONP
function fetchDeezerTrack(song, callbackName) {
  const query = encodeURIComponent(`${song.title} ${song.artist}`);
  const script = document.createElement("script");
  script.src = `https://api.deezer.com/search?q=${query}&limit=1&output=jsonp&callback=${callbackName}`;
  document.body.appendChild(script);
}

// Fetch all trending songs
function fetchSongs() {
  trending.forEach(song => {
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
      if (songs.length === trending.length) {
        loadSong(0);  // Snowman plays first
        buildCarousel(songs); // initial carousel
      }
      delete window[callbackName];
    };
    fetchDeezerTrack(song, callbackName);
  });
}

// Search function (up to 30 results)
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

// Event listeners for search
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

// Buttons
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Initialize
fetchSongs();
updateFill(progressBar);
updateFill(volumeBar);
