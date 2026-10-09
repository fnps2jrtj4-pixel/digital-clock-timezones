const timeZoneOptions = [
  "UTC",
  "America/Los_Angeles",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney"
];

const select = document.getElementById("timezoneSelect");
const timeDisplay = document.getElementById("timeDisplay");
const dateDisplay = document.getElementById("dateDisplay");
const timezoneLabel = document.getElementById("timezoneLabel");

const STORAGE_KEY = "selected-timezone";

function getTimeZoneLabel(timeZone) {
  if (timeZone === "UTC") return "UTC";

  const parts = timeZone.split("/");
  const city = parts[parts.length - 1].replace(/_/g, " ");
  return city;
}

function formatTime(date, timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

function formatDate(date, timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function populateSelect() {
  timeZoneOptions.forEach((zone) => {
    const option = document.createElement("option");
    option.value = zone;
    option.textContent = zone === "UTC" ? "UTC" : zone.replace("/", " — ");
    select.appendChild(option);
  });

  const savedTimeZone = localStorage.getItem(STORAGE_KEY) || "UTC";
  select.value = timeZoneOptions.includes(savedTimeZone) ? savedTimeZone : "UTC";
}

function updateSelectedClock() {
  const timeZone = select.value;
  const now = new Date();

  localStorage.setItem(STORAGE_KEY, timeZone);

  timeDisplay.textContent = formatTime(now, timeZone);
  dateDisplay.textContent = formatDate(now, timeZone);
  timezoneLabel.textContent = getTimeZoneLabel(timeZone);
}

function updateMiniClocks() {
  const now = new Date();

  document.querySelectorAll(".mini-clock").forEach((card) => {
    const zone = card.dataset.timezone;
    const time = card.querySelector(".mini-time");
    const date = card.querySelector(".mini-date");

    time.textContent = formatTime(now, zone);
    date.textContent = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      weekday: "short",
      month: "short",
      day: "numeric"
    }).format(now);
  });
}

function tick() {
  updateSelectedClock();
  updateMiniClocks();
}

populateSelect();
select.addEventListener("change", tick);

tick();
setInterval(tick, 1000);
