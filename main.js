// ============================================================
//  main.js — Full replacement
//  Part 8: Level loading, screens, game loop
//  + Prologue / Epilogue / Title background integration
// ============================================================

function loadLevel(index) {
  if (index >= Levels.length) {
    Game.state = 'allclear';
    showAllClear();
    return;
  }
  Game.currentLevel = index;
  const level = Levels[index];
  level.generate();

  Game.worldWidth = level.width * TILE;
  Game.tiles = level.tiles;
  Game.goalPos = level.goalPos;
  Game.theme = level.theme || 'grass';
  Game.player = new Player(level.playerStart.x, level.playerStart.y);
  Game.enemies = level.enemies.map(e => new Enemy(e.type, e.x, e.y, e.patrolRange));
  Game.coins = level.coins.map(c => new Coin(c.x, c.y));
  Game.potions = (level.potions || []).map(p => new Potion(p.x, p.y));
  Game.powerUps = (level.powerUps || []).map(pu => new PowerUp(pu.x, pu.y));
  Game.projectiles = [];
  Game.movingPlatforms = (level.movingPlatforms || []).map(
    m => new MovingPlatform(m.x, m.y, m.rangeX, m.rangeY, m.speed));
  Game.crumblePlatforms = (level.crumblePlatforms || []).map(
    c => new CrumblePlatform(c.x, c.y));

  if (level.bossType && level.bossPos) {
    Game.boss = new Boss(level.bossType, level.bossPos.x, level.bossPos.y, level.bossFloorY, level.bossName);
    Game.bossDefeated = false;
  } else {
    Game.boss = null;
    Game.bossDefeated = true;
  }

  Game.bossPhase = 1;
  Game.bossPhaseTransition = 0;
  Game.bossPhase2Spawned = false;

  document.getElementById('bossBar').style.display = 'none';

  Game.score = Game.totalScore;
  Particles.list = [];
  Camera.x = 0; Camera.shakeTimer = 0;
  generateBG();
  Game.state = 'playing';
}

function showGameOver() {
  document.getElementById('gameOverScreen').style.display = 'flex';
  document.getElementById('goScore').textContent = 'SCORE: ' + Game.score;
  document.getElementById('bossBar').style.display = 'none';
}

function showClear() {
  document.getElementById('clearScreen').style.display = 'flex';
  document.getElementById('clearScore').textContent = 'SCORE: ' + Game.score;
  document.getElementById('bossBar').style.display = 'none';
  Game.totalScore = Game.score;
}

function showAllClear() {
  document.getElementById('bossBar').style.display = 'none';
  Game.state = 'epilogue';
  if (window.BGM && window.BGM.playEnding) window.BGM.playEnding();
  StoryScreens.startEpilogue(function () {
    Game.state = 'allclear';
    document.getElementById('allClearScreen').style.display = 'flex';
    document.getElementById('allClearScore').textContent = 'TOTAL SCORE: ' + Game.totalScore;
  });
}

function hideScreens() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('clearScreen').style.display = 'none';
  document.getElementById('allClearScreen').style.display = 'none';
  document.getElementById('bossBar').style.display = 'none';
}

// ---- Stage 6 Phase Transition Handler ----
function updateBossPhaseTransition(dt) {
  if (Game.bossPhaseTransition <= 0) return;

  Game.bossPhaseTransition -= dt;

  if (Game.bossPhaseTransition < 1.0 && !Game.bossPhase2Spawned) {
    Game.bossPhase2Spawned = true;
    const level = Levels[Game.currentLevel];
    if (level.bossPhase2Type) {
      Game.boss = new Boss(
        level.bossPhase2Type,
        level.bossPos.x,
        level.bossPos.y,
        level.bossFloorY,
        level.bossPhase2Name || 'DEMON KING'
      );
      Game.boss.active = true;
      document.getElementById('bossBar').style.display = 'block';
      document.getElementById('bossName').textContent = Game.boss.name;
      document.getElementById('bossBarInner').style.width = '100%';
      Camera.shake(5, 0.6);
      Particles.emit(Game.boss.x + Game.boss.w / 2, Game.boss.y + Game.boss.h / 2, 25,
        ['#ff4444', '#ffcc00', '#ff8800', '#e8c830', '#dd2525'], 24, 140);
    }
  }

  if (Game.bossPhaseTransition <= 0) {
    Game.bossPhaseTransition = 0;
  }
}

// ---- Game Loop ----
let lastTime = 0;

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;
  const time = timestamp;

  // ======== Prologue ========
  if (Game.state === 'prologue') {
    StoryScreens.updatePrologue(dt, time);
    Input.clear();
    requestAnimationFrame(gameLoop);
    return;
  }

  // ======== Epilogue ========
  if (Game.state === 'epilogue') {
    StoryScreens.updateEpilogue(dt, time);
    Input.clear();
    requestAnimationFrame(gameLoop);
    return;
  }

  // ======== Title (start) — draw rich Canvas background behind HTML overlay ========
  if (Game.state === 'start') {
    StoryScreens.drawTitle(time);
    Input.clear();
    requestAnimationFrame(gameLoop);
    return;
  }

  // ======== Playing ========
  if (Game.state === 'playing') {
    // Phase transition (Stage 6)
    if (Game.bossPhaseTransition > 0) {
      updateBossPhaseTransition(dt);
      Particles.update(dt);
      Camera.update(Game.player.x + Game.player.w / 2, dt, Game.worldWidth);
      const camX = Camera.getOffset();
      drawBackground(camX);
      drawTiles(camX);
      Game.movingPlatforms.forEach(mp => mp.draw(ctx, camX));
      Game.crumblePlatforms.forEach(cp => cp.draw(ctx, camX));
      if (Game.goalPos) ctx.drawImage(Assets.flag, Game.goalPos.x * TILE - camX, Game.goalPos.y * TILE);
      Game.coins.forEach(c => c.draw(ctx, camX));
      Game.potions.forEach(p => p.draw(ctx, camX));
      Game.powerUps.forEach(pu => pu.draw(ctx, camX));
      Game.enemies.forEach(e => e.draw(ctx, camX));
      if (Game.boss && Game.boss.alive) Game.boss.draw(ctx, camX);
      Game.player.draw(ctx, camX);
      Particles.draw(ctx, camX);
      drawUI();
      Input.clear();
      requestAnimationFrame(gameLoop);
      return;
    }

    Game.player.update(dt);
    Game.movingPlatforms.forEach(mp => mp.update(dt));
    Game.crumblePlatforms.forEach(cp => cp.update(dt));
    resolveCollisions();
    Game.enemies.forEach(e => e.update(dt));
    Game.coins.forEach(c => c.update(dt));
    Game.potions.forEach(p => p.update(dt));
    Game.powerUps.forEach(pu => pu.update(dt));
    Game.projectiles.forEach(pr => pr.update(dt));
    if (Game.boss) Game.boss.update(dt);
    Particles.update(dt);
    Camera.update(Game.player.x + Game.player.w / 2, dt, Game.worldWidth);

    const camX = Camera.getOffset();
    drawBackground(camX);
    drawTiles(camX);
    Game.movingPlatforms.forEach(mp => mp.draw(ctx, camX));
    Game.crumblePlatforms.forEach(cp => cp.draw(ctx, camX));
    if (Game.goalPos) {
      const flagAlpha = Game.bossDefeated ? 1 : 0.3;
      ctx.globalAlpha = flagAlpha;
      ctx.drawImage(Assets.flag, Game.goalPos.x * TILE - camX, Game.goalPos.y * TILE);
      ctx.globalAlpha = 1;
    }
    Game.coins.forEach(c => c.draw(ctx, camX));
    Game.potions.forEach(p => p.draw(ctx, camX));
    Game.powerUps.forEach(pu => pu.draw(ctx, camX));
    Game.enemies.forEach(e => e.draw(ctx, camX));
    if (Game.boss) Game.boss.draw(ctx, camX);
    Game.projectiles.forEach(pr => pr.draw(ctx, camX));
    Game.player.draw(ctx, camX);
    Particles.draw(ctx, camX);
    drawUI();
  }

  Input.clear();
  requestAnimationFrame(gameLoop);
}

// ============================================================
//  Initialization
// ============================================================
Assets.load();
Assets.loadImageEnemies(function() { /* skeleton / skull / daruma の画像読み込み完了 */ });
Input.init();

// ---- Start Button → オープニングBGM → Prologue → Stage 1 ----
document.getElementById('startBtn').addEventListener('click', function () {
  hideScreens();
  Game.totalScore = 0;
  Game.state = 'prologue';
  if (window.BGM && window.BGM.playOpening) window.BGM.playOpening();
  StoryScreens.startPrologue(function () {
    loadLevel(0);
  });
});

// ---- Retry Button（ゲームオーバーしたステージから再開、スコアは直前まで維持） ----
document.getElementById('retryBtn').addEventListener('click', function () {
  hideScreens();
  loadLevel(Game.currentLevel);
});

// ---- Next Stage Button ----
document.getElementById('nextBtn').addEventListener('click', function () {
  hideScreens();
  loadLevel(Game.currentLevel + 1);
});

// ---- Restart Button (from All Clear) → オープニングBGM → Prologue again ----
document.getElementById('restartBtn').addEventListener('click', function () {
  hideScreens();
  Game.totalScore = 0;
  Game.state = 'prologue';
  if (window.BGM && window.BGM.playOpening) window.BGM.playOpening();
  StoryScreens.startPrologue(function () {
    loadLevel(0);
  });
});

// ---- Kick off the loop ----
requestAnimationFrame(gameLoop);
