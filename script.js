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
