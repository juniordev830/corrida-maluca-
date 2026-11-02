const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = 480;
  canvas.height = 640;
}
resizeCanvas();

const LANES = 3;
const laneWidth = canvas.width / LANES;

const player = {
  lane: 1,
  x: 0,
  y: canvas.height - 120,
  w: 46,
  h: 76,
  color: '#ff6b6b'
};

function laneX(lane) {
  return lane * laneWidth + laneWidth / 2 - player.w / 2;
}
player.x = laneX(player.lane);

let obstacles = [];
let stars = [];
let particles = [];
let roadLines = [];
let score = 0;
let memoryStore = {};
let highScore = Number.parseInt(localStorage_get('corridaMalucaHighScore'), 10) || 0;
let speed = 4;
let baseSpeed = 4;
let running = false;
let paused = false;
let gameOverFlag = false;
let frame = 0;
let spawnTimer = 0;
let starTimer = 0;

// Mantém o jogo funcional mesmo quando o navegador bloqueia o armazenamento.
function localStorage_get(key) {
  try { return window.localStorage.getItem(key) ?? memoryStore[key] ?? 0; }
  catch { return memoryStore[key] ?? 0; }
}
function localStorage_set(key, val) {
  memoryStore[key] = val;
  try { window.localStorage.setItem(key, String(val)); } catch { /* fallback em memória */ }
}

document.getElementById('highScore').textContent = highScore;

for (let i = 0; i < 8; i++) {
  roadLines.push({ y: i * 90 });
}

const carColors = ['#4a90d9', '#f4a940', '#9b59b6', '#2ecc71', '#e74c3c'];

// Obstáculos de formas diferentes, todos na grade de três faixas.
function spawnObstacle() {
  const lane = Math.floor(Math.random() * LANES);
  const chance = Math.random();
  const kind = chance < 0.5 ? 'car' : chance < 0.7 ? 'cone' : chance < 0.88 ? 'barrier' : 'pothole';
  const sizes = {
    car: { w: 46, h: 76 },
    cone: { w: 38, h: 48 },
    barrier: { w: 88, h: 38 },
    pothole: { w: 76, h: 34 }
  };
  const { w, h } = sizes[kind];
  obstacles.push({
    kind,
    lane,
    x: lane * laneWidth + (laneWidth - w) / 2,
    y: -100,
    w,
    h,
    color: carColors[Math.floor(Math.random() * carColors.length)]
  });
}

function spawnStar() {
  const lane = Math.floor(Math.random() * LANES);
  stars.push({
    lane: lane,
    x: laneX(lane) + player.w / 2,
    y: -60,
    r: 14,
    collected: false
  });
}

function spawnParticles(x, y, color) {
  for (let i = 0; i < 14; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 30,
      color
    });
  }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function drawRoundedCar(x, y, w, h, color, windowColor) {
  ctx.save();
  ctx.fillStyle = color;
  const r = 10;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = windowColor || 'rgba(255,255,255,0.6)';
  ctx.fillRect(x + 8, y + 12, w - 16, 18);
  ctx.fillRect(x + 8, y + h - 34, w - 16, 18);

  ctx.fillStyle = '#222';
  ctx.fillRect(x - 3, y + 10, 5, 14);
  ctx.fillRect(x + w - 2, y + 10, 5, 14);
  ctx.fillRect(x - 3, y + h - 24, 5, 14);
  ctx.fillRect(x + w - 2, y + h - 24, 5, 14);
  ctx.restore();
}


function drawObstacle(o) {
  if (o.kind === 'car' || !o.kind) {
    drawRoundedCar(o.x, o.y, o.w, o.h, o.color);
    return;
  }
  ctx.save();
  if (o.kind === 'cone') {
    ctx.fillStyle = '#273249';
    ctx.fillRect(o.x - 6, o.y + o.h - 9, o.w + 12, 9);
    ctx.fillStyle = '#ff8e2b';
    ctx.beginPath();
    ctx.moveTo(o.x + o.w / 2, o.y);
    ctx.lineTo(o.x + o.w, o.y + o.h - 9);
    ctx.lineTo(o.x, o.y + o.h - 9);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff4dd';
    ctx.fillRect(o.x + 10, o.y + o.h * 0.57, o.w - 20, 7);
  } else if (o.kind === 'barrier') {
    ctx.fillStyle = '#ffda43';
    ctx.fillRect(o.x, o.y + 5, o.w, o.h - 10);
    ctx.fillStyle = '#17233e';
    for (let i = 6; i < o.w - 3; i += 20) {
      ctx.fillRect(o.x + i, o.y + 7, 8, o.h - 14);
    }
    ctx.fillStyle = '#fff9e5';
    ctx.fillRect(o.x + 4, o.y + 5, o.w - 8, 3);
  } else if (o.kind === 'pothole') {
    ctx.fillStyle = '#1b2334';
    ctx.beginPath();
    ctx.ellipse(o.x + o.w / 2, o.y + o.h / 2, o.w / 2, o.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e0d6f5';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#353d52';
    ctx.beginPath();
    ctx.ellipse(o.x + o.w / 2 - 7, o.y + o.h / 2 - 3, o.w / 4, o.h / 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function update() {
  if (!running || paused || gameOverFlag) return;
  frame++;

  score += 0.12;
  speed = baseSpeed + Math.min(score / 200, 5);

  roadLines.forEach(l => {
    l.y += speed;
    if (l.y > canvas.height) l.y -= canvas.height + 90 * 8;
  });

  spawnTimer++;
  const spawnInterval = Math.max(55 - Math.floor(score / 8), 26);
  if (spawnTimer > spawnInterval) {
    spawnTimer = 0;
    spawnObstacle();
  }

  starTimer++;
  if (starTimer > 90) {
    starTimer = 0;
    if (Math.random() < 0.7) spawnStar();
  }

  const targetX = laneX(player.lane);
  player.x += (targetX - player.x) * 0.25;

  obstacles.forEach(o => o.y += speed);
  obstacles = obstacles.filter(o => o.y < canvas.height + 100);

  stars.forEach(s => s.y += speed);
  stars = stars.filter(s => s.y < canvas.height + 60 && !s.collected);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
  });
  particles = particles.filter(p => p.life > 0);

  for (const o of obstacles) {
    if (rectsOverlap(player, o)) {
      endGame();
      return;
    }
  }

  for (const s of stars) {
    const dx = (player.x + player.w / 2) - s.x;
    const dy = (player.y + player.h / 2) - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < s.r + 26 && !s.collected) {
      s.collected = true;
      score += 15;
      spawnParticles(s.x, s.y, '#ffe66d');
    }
  }

  document.getElementById('score').textContent = Math.floor(score);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#7d86af');
  grad.addColorStop(1, '#475875');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#24c97e';
  ctx.fillRect(0, 0, 8, canvas.height);
  ctx.fillRect(canvas.width - 8, 0, 8, canvas.height);

  ctx.strokeStyle = '#f4f4f4';
  ctx.lineWidth = 4;
  ctx.setLineDash([30, 30]);
  for (let lane = 1; lane < LANES; lane++) {
    ctx.beginPath();
    ctx.moveTo(lane * laneWidth, 0);
    ctx.lineTo(lane * laneWidth, canvas.height);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  stars.forEach(s => {
    if (s.collected) return;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.fillStyle = '#ffe66d';
    ctx.strokeStyle = '#f4a940';
    ctx.lineWidth = 2;
    drawStar(0, 0, 5, s.r, s.r / 2.2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });

  obstacles.forEach(drawObstacle);

  if (running) {
    drawRoundedCar(player.x, player.y, player.w, player.h, player.color, 'rgba(200,230,255,0.8)');
  }

  particles.forEach(p => {
    ctx.globalAlpha = Math.max(p.life / 30, 0);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawStar(cx, cy, spikes, outerR, innerR) {
  let rot = (Math.PI / 2) * 3;
  let x = cx, y = cy;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerR;
    y = cy + Math.sin(rot) * outerR;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerR;
    y = cy + Math.sin(rot) * innerR;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
}

// Fixed 60 Hz simulation, independent of display refresh rate.
const STEP_MS = 1000 / 60;
let previousTimestamp = null;
let accumulatedMs = 0;
function loop(timestamp) {
  if (Number.isFinite(timestamp)) {
    if (previousTimestamp !== null) accumulatedMs += Math.min(100, Math.max(0, timestamp - previousTimestamp));
    previousTimestamp = timestamp;
    while (accumulatedMs + 1e-7 >= STEP_MS) {
      update();
      accumulatedMs -= STEP_MS;
    }
  }
  draw();
  requestAnimationFrame(loop);
}

function startGame() {
  obstacles = [];
  stars = [];
  particles = [];
  score = 0;
  speed = baseSpeed;
  player.lane = 1;
  player.x = laneX(1);
  frame = 0;
  spawnTimer = 0;
  starTimer = 0;
  gameOverFlag = false;
  paused = false;
  running = true;
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('score').textContent = 0;
}

function endGame() {
  running = false;
  gameOverFlag = true;
  spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#ff6b6b');
  const finalScore = Math.floor(score);
  if (finalScore > highScore) {
    highScore = finalScore;
    localStorage_set('corridaMalucaHighScore', highScore);
    document.getElementById('highScore').textContent = highScore;
  }
  setTimeout(() => {
    document.getElementById('overlayTitle').textContent = 'Bateu! 💥';
    document.getElementById('overlayText').textContent = 'Pontuação final: ' + finalScore + '. Toque em jogar de novo para tentar bater o recorde!';
    document.getElementById('startBtn').textContent = 'Jogar de novo';
    document.getElementById('overlay').style.display = 'flex';
  }, 400);
}

function togglePause() {
  if (!running || gameOverFlag) return;
  paused = !paused;
  document.getElementById('overlay').style.display = paused ? 'flex' : 'none';
  if (paused) {
    document.getElementById('overlayTitle').textContent = 'Pausado';
    document.getElementById('overlayText').textContent = 'Toque em continuar para voltar à corrida.';
    document.getElementById('startBtn').textContent = 'Continuar';
  }
}

document.getElementById('startBtn').addEventListener('click', () => {
  if (paused) {
    paused = false;
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('startBtn').textContent = 'Continuar';
  } else {
    startGame();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (running && !gameOverFlag) togglePause();
    return;
  }

  // Ignore steering while the start/game-over overlay is visible or the game is paused.
  if (!running || paused || gameOverFlag) return;

  if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    e.preventDefault();
    player.lane = Math.max(0, player.lane - 1);
  } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    e.preventDefault();
    player.lane = Math.min(LANES - 1, player.lane + 1);
  }
});

document.getElementById('btnLeft').addEventListener('click', () => {
  if (running && !paused && !gameOverFlag) player.lane = Math.max(0, player.lane - 1);
});
document.getElementById('btnRight').addEventListener('click', () => {
  if (running && !paused && !gameOverFlag) player.lane = Math.min(LANES - 1, player.lane + 1);
});
document.getElementById('btnPause').addEventListener('click', togglePause);

let touchStartX = null;
canvas.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});
canvas.addEventListener('touchend', (e) => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  touchStartX = null;
  if (!running || paused || gameOverFlag) return;
  if (dx > 30) player.lane = Math.min(LANES - 1, player.lane + 1);
  else if (dx < -30) player.lane = Math.max(0, player.lane - 1);
});

draw();
loop();
