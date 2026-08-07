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
