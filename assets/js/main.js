const HOURS = JSON.parse(document.getElementById("hours-data").textContent);
const DAY_NAMES = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

// Altijd Nederlandse tijd, ook als de bezoeker in een andere tijdzone zit
function nowInAmsterdam() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Amsterdam", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return {
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function nextOpening(day, minutes) {
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7;
    const h = HOURS[d];
    if (!h) continue;
    if (i === 0 && minutes >= toMin(h[0])) continue;
    return { day: d, offset: i, hours: h };
  }
  return null;
}

const $ = (id) => document.getElementById(id);
let first = true;

function moveSun(x, y) {
  const sun = $("dial-sun");
  if (!sun) return;
  if (first && !reduceMotion) {
    sun.style.transition = "none";
    sun.style.transform = "translate(30px, 245px)";
    sun.getBoundingClientRect();
    sun.style.transition = "";
  }
  sun.style.transform = `translate(${x}px, ${y}px)`;
}

function update() {
  const { day, minutes } = nowInAmsterdam();
  const today = HOURS[day];
  const state = $("status-state");
  const detail = $("status-detail");
  const dial = $("dial");

  document.querySelectorAll(".hours tr").forEach((row) => {
    const th = row.querySelector("th");
    if (Number(row.dataset.day) === day) {
      row.setAttribute("data-today", "");
      th.setAttribute("aria-current", "date");
    } else {
      row.removeAttribute("data-today");
      th.removeAttribute("aria-current");
    }
  });

  const isOpen = today && minutes >= toMin(today[0]) && minutes < toMin(today[1]);
  let labels = today;

  if (isOpen) {
    const p = (minutes - toMin(today[0])) / (toMin(today[1]) - toMin(today[0]));
    moveSun(200 - 170 * Math.cos(Math.PI * p), 200 - 170 * Math.sin(Math.PI * p));
    if (state) state.textContent = "Nu open";
    if (detail) detail.textContent = `Open tot ${today[1]} uur`;
    if (dial) dial.dataset.state = "open";
  } else {
    const next = nextOpening(day, minutes);
    const afterClose = today && minutes >= toMin(today[1]);
    moveSun(afterClose ? 370 : 30, 245);
    labels = next ? next.hours : null;
    if (state) state.textContent = "Nu gesloten";
    if (detail && next) {
      const when = next.offset === 0 ? "vandaag" : next.offset === 1 ? "morgen" : DAY_NAMES[next.day];
      detail.textContent = `Open ${when} om ${next.hours[0]} uur`;
    }
    if (dial) dial.dataset.state = "closed";
  }

  if ($("dial-open") && labels) {
    $("dial-open").textContent = labels[0];
    $("dial-close").textContent = labels[1];
  }
  first = false;
}

update();
setInterval(update, 60 * 1000);

// Mobiel menu
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
if (toggle && nav) {
  const set = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  };
  toggle.addEventListener("click", () => set(toggle.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      set(false);
      toggle.focus();
    }
  });
}

// Blokken komen één keer binnen terwijl je scrolt
const REVEAL = ".reveal, .kaart h2, .over-body > *, .collage .ph, .avond h2, .hours tr, .facts li, .contact-grid > *, .page-head > .rail > *, .steps li, .prose-grid > *, .cat-head, .cat .ph.cat-photo, .item, .contact-page > *, .afhaal-foto";
const reveals = document.querySelectorAll(REVEAL);
if (reveals.length) {
  if (!("IntersectionObserver" in window) || reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });
    reveals.forEach((el) => {
      const index = [...el.parentElement.children].indexOf(el);
      el.style.setProperty("--i", Math.min(index, 6));
      io.observe(el);
    });
  }
}

// Menukaart: markeer de categorie in beeld
const links = [...document.querySelectorAll(".cat-nav a")];
if (links.length && "IntersectionObserver" in window) {
  const byId = Object.fromEntries(links.map((a) => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.removeAttribute("aria-current"));
      byId[entry.target.id]?.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-25% 0px -65% 0px" });
  document.querySelectorAll(".cat").forEach((s) => spy.observe(s));
}
