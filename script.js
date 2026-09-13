function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    const meridian = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, "0");

    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    document.getElementById("clock").innerHTML =
        `${hours}:${minutes}:${seconds} <span class="ampm">${meridian}</span>`;

    document.getElementById("date").textContent = new Intl.DateTimeFormat(
        "en-GB",
        { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    ).format(now);
}

updateClock();
setInterval(updateClock, 1000);

const backgroundMusic = document.getElementById("background-music");
const musicMessage = document.getElementById("music-message");
const audioBars = document.getElementById("audio-bars");
const barsContext = audioBars.getContext("2d");
const backgroundImages = {
    "1": "img/img1.png",
    "2": "img/img2.png",
    "3": "img/img3.png",
    "4": "img/img4.jpg",
    "5": "img/img5.png",
    "6": "img/img6.jpg",
    "7": "img/img7.jpg",
    "8": "img/img8.jpg",
    "9": "img/img9.jpg",
    "0": "img/img0.jpg"
};

let audioContext;
let analyser;
let frequencyData;
let animationFrame;
let musicSource;

function resizeBars() {
    const pixelRatio = window.devicePixelRatio || 1;
    const { width, height } = audioBars.getBoundingClientRect();

    audioBars.width = Math.round(width * pixelRatio);
    audioBars.height = Math.round(height * pixelRatio);
    barsContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function drawBars() {
    const { width, height } = audioBars.getBoundingClientRect();
    const styles = getComputedStyle(audioBars);
    const requestedBars = Number.parseInt(styles.getPropertyValue("--bar-count"), 10);
    const barWidth = Number.parseFloat(styles.getPropertyValue("--bar-width"));
    const barGap = Number.parseFloat(styles.getPropertyValue("--bar-gap"));
    const barCount = Math.min(requestedBars, Math.floor((width + barGap) / (barWidth + barGap)));

    barsContext.clearRect(0, 0, width, height);

    if (backgroundMusic.paused || !analyser) {
        animationFrame = undefined;
        return;
    }

    analyser.getByteFrequencyData(frequencyData);
    const totalWidth = barCount * barWidth + (barCount - 1) * barGap;
    const startX = (width - totalWidth) / 2;

    barsContext.fillStyle = "white";

    for (let index = 0; index < barCount; index += 1) {
        const frequencyIndex = Math.floor((index / barCount) * frequencyData.length);
        const barHeight = Math.max(3, (frequencyData[frequencyIndex] / 255) * height);
        const x = startX + index * (barWidth + barGap);

        barsContext.fillRect(x, height - barHeight, barWidth, barHeight);
    }

    animationFrame = requestAnimationFrame(drawBars);
}

function startBars() {
    if (!animationFrame) {
        resizeBars();
        drawBars();
    }
}

function connectBars() {
    if (audioContext) {
        return;
    }

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

    musicSource = audioContext.createMediaElementSource(backgroundMusic);
    musicSource.connect(analyser);
    analyser.connect(audioContext.destination);
}

function activateBars() {
    connectBars();

    if (audioContext) {
        audioContext.resume().then(startBars).catch(() => {});
    }
}

window.addEventListener("resize", resizeBars);

function playMusic() {
    backgroundMusic.play().then(() => {
        musicMessage.hidden = true;
    }).catch(() => {
        musicMessage.hidden = false;
    });
}

// Browsers may block audio autoplay until the page receives an interaction.
playMusic();

document.addEventListener("keydown", (event) => {
    // Resuming here satisfies browser audio policies without changing playback.
    activateBars();

    const selectedBackground = backgroundImages[event.key];

    if (selectedBackground) {
        document.body.style.backgroundImage = `url("${selectedBackground}")`;
        return;
    }

    if (event.code === "Space") {
        event.preventDefault();

        if (backgroundMusic.paused) {
            playMusic();
        } else {
            backgroundMusic.pause();
            musicMessage.textContent = "Press Space to resume music";
            musicMessage.hidden = false;
        }
    }
});
