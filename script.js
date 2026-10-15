/* 1. Печатающаяся строка под должностью */
const phrases = [
  "HTML · CSS · JavaScript · PHP",
  "Figma и Photoshop",
  "Telegram-боты на Node.js",
  "Люблю быстрые прототипы"
];
const typingEl = document.getElementById("typing");
let p = 0, c = 0, deleting = false;

function type() {
  const word = phrases[p];
  typingEl.textContent = word.slice(0, c);
  if (!deleting && c < word.length) { c++; return setTimeout(type, 70); }
  if (!deleting) { deleting = true; return setTimeout(type, 1400); }
  if (c > 0) { c--; return setTimeout(type, 35); }
  deleting = false;
  p = (p + 1) % phrases.length;
  setTimeout(type, 300);
}
type();

/* 2. Смена цвета аватарки по клику */
const avatar = document.getElementById("avatar");
const colors = ["#c9b8ff", "#ffb27a", "#b6f2a0", "#8ab4ff", "#ff9ccb", "#5eead4"];
let ci = 0;
avatar.addEventListener("click", () => {
  ci = (ci + 1) % colors.length;
  document.documentElement.style.setProperty("--avatar", colors[ci]);
});

/* 3. Уведомление */
const toast = document.getElementById("toast");
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* 4. Копирование почты */
document.getElementById("copyMail").addEventListener("click", async (e) => {
  const mail = e.currentTarget.dataset.mail;
  try {
    await navigator.clipboard.writeText(mail);
    showToast("Почта скопирована");
  } catch {
    showToast("Не получилось скопировать. Выдели почту вручную");
  }
});

/* 5. Конфетти */
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let pieces = [];
let running = false;
const palette = ["#ff5fa2", "#5eead4", "#ffd84d", "#8ab4ff", "#b6f2a0", "#ffb27a"];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

function burst(e) {
  // автозапуск при загрузке уважает «уменьшить движение»,
  // а нажатие на кнопку всегда запускает конфетти
  const byClick = e && e.type === "click";
  if (!byClick && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 140; i++) {
    pieces.push({
      x: innerWidth / 2,
      y: innerHeight * 0.7,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 18 - 4,
      size: Math.random() * 8 + 6,
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.3,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }
  if (!running) { running = true; animate(); }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((q) => {
    q.vy += 0.4;
    q.x += q.vx;
    q.y += q.vy;
    q.rot += q.vr;
    ctx.save();
    ctx.translate(q.x, q.y);
    ctx.rotate(q.rot);
    ctx.fillStyle = q.color;
    ctx.fillRect(-q.size / 2, -q.size / 2, q.size, q.size * 0.6);
    ctx.restore();
  });
  pieces = pieces.filter((q) => q.y < canvas.height + 40);
  if (pieces.length) requestAnimationFrame(animate);
  else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

document.getElementById("confetti").addEventListener("click", burst);

/* 6. Пасхалка: конфетти при загрузке страницы */
window.addEventListener("load", () => setTimeout(burst, 600));

/* 7. Параллакс фигур и подсветка точек у курсора */
if (matchMedia("(hover:hover)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const root = document.documentElement;
  addEventListener("pointermove", (e) => {
    root.style.setProperty("--px", (e.clientX / innerWidth - 0.5) * 2);
    root.style.setProperty("--py", (e.clientY / innerHeight - 0.5) * 2);
    root.style.setProperty("--mx", e.clientX + "px");
    root.style.setProperty("--my", e.clientY + "px");
  });
}

/* 8. Полоса прокрутки сверху */
const bar = document.getElementById("progressBar");
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const pct = max > 0 ? (scrollY / max) * 100 : 0;
  bar.style.width = pct + "%";
  bar.classList.toggle("on", pct > 0.5);
}
addEventListener("scroll", () => requestAnimationFrame(updateProgress), { passive: true });
addEventListener("resize", updateProgress);
updateProgress();