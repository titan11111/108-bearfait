// ============================================================
//  Part 5: Input, Particle, Camera, MovingPlatform,
//          CrumblePlatform, Game state（Levels は levels.js）
// ============================================================

const Input = {
  keys: {},
  justPressed: {},
  init() {
    window.addEventListener('keydown', e => {
      if (!this.keys[e.code]) this.justPressed[e.code] = true;
      this.keys[e.code] = true;
      if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
    this._setupTouch('btnLeft', 'ArrowLeft');
    this._setupTouch('btnRight', 'ArrowRight');
    this._setupTouch('btnJump', 'Space');
    this._setupTouch('btnAttack', 'KeyZ');
  },
  _setupTouch(id, code) {
    const el = document.getElementById(id);
    if (!el) return;
    const down = function(e) { e.preventDefault(); if (!this.keys[code]) this.justPressed[code] = true; this.keys[code] = true; };
    const up = function(e) { e.preventDefault(); this.keys[code] = false; };
    el.addEventListener('touchstart', down.bind(this));
    el.addEventListener('touchend', up.bind(this));
    el.addEventListener('touchcancel', up.bind(this));
  },
  clear() { this.justPressed = {}; },
  isDown(code) { return !!this.keys[code]; },
  wasPressed(code) { return !!this.justPressed[code]; }
};

class Particle {
  constructor(x, y, vx, vy, color, life, size) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.color = color; this.life = this.maxLife = life; this.size = size || 2;
  }
  update(dt) { this.x += this.vx * dt; this.y += this.vy * dt; this.vy += 200 * dt; this.life -= dt; }
  draw(ctx, camX) {
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - camX, this.y, this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

const Particles = {
  list: [],
  emit(x, y, count, colors, spread, speed) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const sp = (Math.random() * 0.5 + 0.5) * (speed || 100);
      this.list.push(new Particle(
        x + (Math.random() - 0.5) * (spread || 10), y + (Math.random() - 0.5) * (spread || 10),
        Math.cos(angle) * sp, Math.sin(angle) * sp - 50,
        colors[Math.floor(Math.random() * colors.length)],
        0.3 + Math.random() * 0.4, 1 + Math.random() * 2
      ));
    }
  },
  update(dt) { this.list = this.list.filter(p => { p.update(dt); return p.life > 0; }); },
  draw(ctx, camX) { this.list.forEach(p => p.draw(ctx, camX)); }
};

const Camera = {
  x: 0, shakeTimer: 0, shakeIntensity: 0,
  shake(i, d) { this.shakeIntensity = i; this.shakeTimer = d; },
  update(targetX, dt, worldWidth) {
    this.x += (targetX - BASE_W / 2 - this.x) * 5 * dt;
    this.x = Math.max(0, Math.min(this.x, worldWidth - BASE_W));
    if (this.shakeTimer > 0) this.shakeTimer -= dt;
  },
  getOffset() {
    let o = this.x;
    if (this.shakeTimer > 0) o += (Math.random() - 0.5) * this.shakeIntensity;
    return o;
  }
};

class MovingPlatform {
  constructor(x, y, rangeX, rangeY, speed) {
    this.startX = x * TILE; this.startY = y * TILE;
    this.x = this.startX; this.y = this.startY;
    this.w = TILE; this.h = 8;
    this.rangeX = (rangeX || 0) * TILE; this.rangeY = (rangeY || 0) * TILE;
    this.speed = speed || 40; this.phase = 0;
    this.prevX = this.x; this.prevY = this.y;
  }
  update(dt) {
    this.prevX = this.x; this.prevY = this.y;
    this.phase += dt * this.speed * 0.04;
    this.x = this.startX + Math.sin(this.phase) * this.rangeX;
    this.y = this.startY + Math.sin(this.phase * 0.7) * this.rangeY;
  }
  draw(ctx, camX) {
    ctx.drawImage(Assets.tiles.movingPlatform, Math.round(this.x - camX), Math.round(this.y));
  }
}

class CrumblePlatform {
  constructor(x, y) {
    this.x = x * TILE; this.y = y * TILE;
    this.w = TILE; this.h = 8; this.state = 'solid'; this.timer = 0;
  }
  touch() { if (this.state === 'solid') { this.state = 'shaking'; this.timer = 0.5; } }
  update(dt) {
    if (this.state === 'shaking') {
      this.timer -= dt;
      if (this.timer <= 0) { this.state = 'gone'; this.timer = 3.0; Particles.emit(this.x + 8, this.y + 4, 6, ['#997755','#bbaa88','#665533'], 10, 60); }
    } else if (this.state === 'gone') {
      this.timer -= dt;
      if (this.timer <= 0) this.state = 'solid';
    }
  }
  draw(ctx, camX) {
    if (this.state === 'gone') return;
    const sx = Math.round(this.x - camX); const sy = Math.round(this.y);
    if (this.state === 'shaking') ctx.drawImage(Assets.tiles.crumblePlatformFading, sx + (Math.random() - 0.5) * 2, sy);
    else ctx.drawImage(Assets.tiles.crumblePlatform, sx, sy);
  }
}

// Levels は levels.js で定義（役割: ステージデータのみ）


// ============================================================
//  Game State
// ============================================================
let Game = {
  state: 'start',
  currentLevel: 0,
  score: 0,
  totalScore: 0,
  player: null,
  enemies: [],
  coins: [],
  potions: [],
  powerUps: [],
  projectiles: [],
  boss: null,
  tiles: [],
  goalPos: null,
  worldWidth: 0,
  bgStars: [],
  bgMountains: [],
  bgTrees: [],
  movingPlatforms: [],
  crumblePlatforms: [],
  theme: 'grass',
  bossDefeated: false,
  // Stage 6 two-phase boss
  bossPhase: 1,           // 1 = shadow, 2 = true form
  bossPhaseTransition: 0, // transition timer
  bossPhase2Spawned: false
};
