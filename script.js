let songIndex = 0;

let songs = [
    { songName:"Shri Hanuman Chalisa", filePath:"/songs/Song1.mp3", coverPath:"/covers/Cover1.jpeg" },
    { songName:"Dhrundhar Title Song", filePath:"/songs/Song2.mp3", coverPath:"/covers/Cover2.jpeg" },
    { songName:"Vaaroon - Mirzapur", filePath:"/songs/Song3.mp3", coverPath:"/covers/Cover3.jpeg" },
    { songName:"Ishq Jalakar - Karvaan", filePath:"/songs/Song4.mp3", coverPath:"/covers/Cover4.webp" },
    { songName:"Ishq Di Baajiyaan", filePath:"/songs/Song5.mp3", coverPath:"/covers/Cover5.jpeg" },
    { songName:"Apna Bana Le", filePath:"/songs/Song6.mp3", coverPath:"/covers/Cover6.jpeg" },
    { songName:"Sundari", filePath:"/songs/Song7.mp3", coverPath:"/covers/Cover7.webp" },
    { songName:"Tum ho to", filePath:"/songs/Song8.mp3", coverPath:"/covers/Cover8.jpeg" },
];

// initialization
let audioElement = new Audio(songs[songIndex].filePath);

let songItems = document.getElementsByClassName("songitems");
let songItemsPlay = document.getElementsByClassName("songItemsPlay");
let start = document.getElementsByClassName("song-start");
let progressBar = document.getElementById("progressbar");
let end = document.getElementsByClassName("song-end");
let previous = document.getElementById("previous");
let masterPlay = document.getElementById("master");
let next = document.getElementById("next");
let gif = document.getElementById("gif");
let masterName = document.getElementsByClassName("song-master-title");

function songDuration(duration) {
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    if (seconds < 10) seconds = "0" + seconds;
    return `${minutes}:${seconds}`;
}

// song list UI
Array.from(songItems).forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("song-title")[0].innerText = songs[i].songName;

    let tempAudio = new Audio(songs[i].filePath);
    tempAudio.addEventListener("loadedmetadata", () => {
        element.getElementsByClassName("song-length")[0].innerText =
            songDuration(tempAudio.duration);
    });
});

// duration for master (FIXED – once only)
audioElement.addEventListener("loadedmetadata", () => {
    end[0].innerText = songDuration(audioElement.duration);
});

function makeAllPlay() {
    Array.from(songItemsPlay).forEach((element) => {
        element.classList.replace("fa-circle-pause", "fa-circle-play");
    });
}

// FIXED ORDER (src → play)
function allSongPlay() {
    masterPlay.classList.replace("fa-circle-play", "fa-circle-pause");
    audioElement.src = songs[songIndex].filePath;
    audioElement.play();
    masterName[0].innerText = songs[songIndex].songName;
    gif.style.opacity = 1;
}

// song item play
Array.from(songItemsPlay).forEach((element) => {
    element.addEventListener("click", (e) => {
        let clickIndex = parseInt(e.target.id);

        if (songIndex === clickIndex) {
            if (audioElement.paused) {
                audioElement.play();
                e.target.classList.replace("fa-circle-play", "fa-circle-pause");
                masterPlay.classList.replace("fa-circle-play", "fa-circle-pause");
                gif.style.opacity = 1;
            } else {
                audioElement.pause();
                e.target.classList.replace("fa-circle-pause", "fa-circle-play");
                masterPlay.classList.replace("fa-circle-pause", "fa-circle-play");
                gif.style.opacity = 0;
            }
        } else {
            makeAllPlay();
            songIndex = clickIndex;
            audioElement.src = songs[songIndex].filePath;
            audioElement.currentTime = 0;
            audioElement.play();

            e.target.classList.replace("fa-circle-play", "fa-circle-pause");
            masterPlay.classList.replace("fa-circle-play", "fa-circle-pause");
            masterName[0].innerText = songs[songIndex].songName;
            gif.style.opacity = 1;
        }
    });
});

// master play (FIXED)
masterPlay.addEventListener("click", () => {
    if (audioElement.paused) {
        audioElement.play();
        masterPlay.classList.replace("fa-circle-play", "fa-circle-pause");
        gif.style.opacity = 1;
        masterName[0].innerText = songs[songIndex].songName;
        document.getElementById(songIndex)?.classList.replace("fa-circle-play","fa-circle-pause");
    } else {
        audioElement.pause();
        masterPlay.classList.replace("fa-circle-pause", "fa-circle-play");
        gif.style.opacity = 0;
        document.getElementById(songIndex)?.classList.replace("fa-circle-pause","fa-circle-play");
    }
});

// progress
audioElement.addEventListener("timeupdate", () => {
    if (!isNaN(audioElement.duration)) {
        progressBar.value = (audioElement.currentTime / audioElement.duration) * 100;
        start[0].innerText = songDuration(audioElement.currentTime);
    }
});

progressBar.addEventListener("change", () => {
    audioElement.currentTime = (progressBar.value * audioElement.duration) / 100;
});

// previous
previous.addEventListener("click", () => {
    if(songIndex <=0) {
        songIndex = songs.length-1;  //songIndex = songIndex <= 0 ? songs.length - 1 : songIndex - 1;
    }
    else {
        songIndex --;
    }
    makeAllPlay();
    allSongPlay();
    document.getElementById(songIndex)?.classList.replace("fa-circle-play","fa-circle-pause");
});

// next
next.addEventListener("click", () => {
    if(songIndex >= songs.length-1) {
        songIndex = 0;
    }
    else {
        songIndex ++;   // songIndex = songIndex >= songs.length - 1 ? 0 : songIndex + 1;
    }
    makeAllPlay();
    allSongPlay();
    document.getElementById(songIndex)?.classList.replace("fa-circle-play","fa-circle-pause");
});

// auto next
audioElement.addEventListener("ended", () => {
    if(songIndex >= songs.length-1) {
        songIndex = 0;
    }
    else {
        songIndex ++;  // songIndex = songIndex >= songs.length - 1 ? 0 : songIndex + 1;
    }
    makeAllPlay();
    allSongPlay();
    document.getElementById(songIndex)?.classList.replace("fa-circle-play","fa-circle-pause");
});
