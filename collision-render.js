// ============================================================
//  Part 7: Collision, Background, drawTiles, drawUI
// ============================================================
// 落下着地判定で「次フレームの予測」に使う係数（60fps 想定）
const PREDICT_DT = 1 / 60;

function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function resolveCollisions() {
  const p = Game.player;
  if (p.dead) return;

  p.grounded = false;
  p.ridingPlatform = null;

  // ---- Static tiles ----
  for (const tile of Game.tiles) {
    const tx = tile.x * TILE;
    const ty = tile.y * TILE;
    const tw = TILE;
    const th = tile.type === 'platform' ? 8 : TILE;

    if (tile.type === 'spike' || tile.type === 'lavaTop') {
      if (aabb(p, {x: tx + 2, y: ty + 4, w: tw - 4, h: th - 4})) p.takeDamage(1);
      continue;
    }
    if (tile.type === 'platform') {
      if (p.vy >= 0 && p.y + p.h <= ty + 8 && p.y + p.h + p.vy * PREDICT_DT >= ty) {
        if (p.x + p.w > tx && p.x < tx + tw) {
          p.y = ty - p.h; p.vy = 0; p.grounded = true;
        }
      }
      continue;
    }
    if (!aabb(p, {x: tx, y: ty, w: tw, h: th})) continue;
    const overlapX = Math.min(p.x + p.w - tx, tx + tw - p.x);
    const overlapY = Math.min(p.y + p.h - ty, ty + th - p.y);
    if (overlapX < overlapY) {
      if (p.x + p.w / 2 < tx + tw / 2) p.x = tx - p.w; else p.x = tx + tw;
      p.vx = 0;
    } else {
      if (p.y + p.h / 2 < ty + th / 2) { p.y = ty - p.h; p.vy = 0; p.grounded = true; }
      else { p.y = ty + th; p.vy = 0; }
    }
  }

  // ---- Moving Platforms ----
  for (const mp of Game.movingPlatforms) {
    if (p.vy >= 0 && p.y + p.h <= mp.y + 8 && p.y + p.h + p.vy * PREDICT_DT >= mp.y) {
      if (p.x + p.w > mp.x && p.x < mp.x + mp.w) {
        p.y = mp.y - p.h; p.vy = 0; p.grounded = true; p.ridingPlatform = mp;
      }
    }
  }

  // ---- Crumble Platforms ----
  for (const cp of Game.crumblePlatforms) {
    if (cp.state === 'gone') continue;
    if (p.vy >= 0 && p.y + p.h <= cp.y + 8 && p.y + p.h + p.vy * PREDICT_DT >= cp.y) {
      if (p.x + p.w > cp.x && p.x < cp.x + cp.w) {
        p.y = cp.y - p.h; p.vy = 0; p.grounded = true; cp.touch();
      }
    }
  }

  // ---- 剣の当たり判定 ----
  const slashBox = p.getSlashBox();

  // ---- Enemies（当たり判定は scaleEntitiesForDisplay でスケール済みの w,h を使用、表示と一致） ----
  for (const enemy of Game.enemies) {
    if (!enemy.alive) continue;
    const eb = {x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h};
    if (slashBox && aabb(slashBox, eb)) {
      enemy.takeDamage(slashBox.damage);
      continue;
    }
    if (aabb(p, eb)) {
      if (p.vy > 0 && p.y + p.h < enemy.y + enemy.h * 0.4 + 6) {
        enemy.takeDamage(1);
        p.vy = -220;
        Game.score += 50;
        continue;
      }
      p.takeDamage(1);
    }
  }

  // ---- Boss ----
  if (Game.boss && Game.boss.alive && Game.boss.active) {
    const b = Game.boss;
    const bb = {x: b.x, y: b.y, w: b.w, h: b.h};
    if (slashBox && aabb(slashBox, bb)) {
      b.takeDamage(slashBox.damage);
    }
    if (aabb(p, bb)) {
      if (p.vy > 0 && p.y + p.h < b.y + b.h * 0.3 + 6) {
        b.takeStompDamage();
        p.vy = -280;
        Game.score += 100;
        Particles.emit(b.x + b.w / 2, b.y, 8, ['#ffcc00', '#fff'], 10, 60);
      } else {
        p.takeDamage(1);
      }
    }
  }

  // ---- Player projectiles ----
  for (const proj of Game.projectiles) {
    if (!proj.alive || proj.owner !== 'player') continue;
    const pb = {x: proj.x, y: proj.y, w: proj.w, h: proj.h};
    for (const enemy of Game.enemies) {
      if (!enemy.alive) continue;
      if (aabb(pb, {x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h})) {
        enemy.takeDamage(proj.damage);
        proj.alive = false;
        Particles.emit(proj.x, proj.y, 4, ['#ffdd44', '#fff'], 6, 40);
        break;
      }
    }
    if (proj.alive && Game.boss && Game.boss.alive && Game.boss.active) {
      if (aabb(pb, {x: Game.boss.x, y: Game.boss.y, w: Game.boss.w, h: Game.boss.h})) {
        Game.boss.takeDamage(proj.damage);
        proj.alive = false;
        Particles.emit(proj.x, proj.y, 6, ['#ffdd44', '#ffaa00', '#fff'], 8, 50);
      }
    }
    if (proj.alive) {
      for (const tile of Game.tiles) {
        if (tile.type === 'platform' || tile.type === 'spike' || tile.type === 'lavaTop') continue;
        const tx = tile.x * TILE; const ty = tile.y * TILE;
        if (aabb(pb, {x: tx, y: ty, w: TILE, h: TILE})) {
          proj.alive = false;
          Particles.emit(proj.x, proj.y, 3, ['#ffcc00', '#fff'], 4, 30);
          break;
        }
      }
    }
  }

  // ---- Boss projectiles vs player ----
  for (const proj of Game.projectiles) {
    if (!proj.alive || proj.owner !== 'boss') continue;
    if (aabb({x: proj.x, y: proj.y, w: proj.w, h: proj.h}, p)) {
      p.takeDamage(proj.damage);
      proj.alive = false;
      Particles.emit(proj.x, proj.y, 4, ['#ff4444', '#ffaa00'], 6, 40);
    }
    for (const tile of Game.tiles) {
      if (tile.type === 'platform' || tile.type === 'spike' || tile.type === 'lavaTop') continue;
      const tx = tile.x * TILE; const ty = tile.y * TILE;
      if (aabb({x: proj.x, y: proj.y, w: proj.w, h: proj.h}, {x: tx, y: ty, w: TILE, h: TILE})) {
        proj.alive = false; break;
      }
    }
  }

  // ---- Coins / Potions / PowerUps ----
  for (const coin of Game.coins) {
    if (coin.collected) continue;
    if (aabb(p, coin)) {
      coin.collected = true; Game.score += 50;
      if (window.SE) window.SE.coin();
      Particles.emit(coin.x + 5, coin.y + 5, 6, ['#ffcc00', '#ffdd44', '#fff'], 6, 60);
    }
  }
  for (const pot of Game.potions) {
    if (pot.collected) continue;
    if (aabb(p, pot)) {
      pot.collected = true;
      p.hp = Math.min(p.hp + 2, p.maxHp);
      if (window.SE) window.SE.potion();
      Particles.emit(pot.x + 5, pot.y + 7, 8, ['#ff4488', '#ff88bb', '#fff'], 8, 70);
    }
  }
  for (const pu of Game.powerUps) {
    if (pu.collected) continue;
    if (aabb(p, pu)) {
      pu.collected = true;
      p.powered = true; p.powerTimer = p.powerDuration;
      if (window.SE) window.SE.powerUp();
      Camera.shake(2, 0.3);
      Particles.emit(pu.x + 6, pu.y + 6, 12, ['#ff6600', '#ffcc00', '#fff'], 10, 100);
    }
  }

  // ---- Goal (ボス撃破後のみ) — 到達で CLEAR 状態へ ----
  if (Game.goalPos && Game.bossDefeated) {
    const gx = Game.goalPos.x * TILE;
    const gy = Game.goalPos.y * TILE;
    if (aabb(p, {x: gx, y: gy, w: 16, h: 32})) {
      if (window.SE) window.SE.clear();
      Game.state = GameStates.CLEAR;
      showClear();
    }
  }

  Game.projectiles = Game.projectiles.filter(pr => pr.alive);
}

// ---- Background ----
function generateBG() {
  Game.bgStars = [];
  for (let i = 0; i < 60; i++) {
    Game.bgStars.push({ x: Math.random() * Game.worldWidth, y: Math.random() * BASE_H * 0.6, size: Math.random() * 1.5 + 0.5, brightness: Math.random() * 0.5 + 0.5 });
  }
  Game.bgMountains = [];
  for (let x = 0; x < Game.worldWidth; x += 40 + Math.random() * 30) {
    Game.bgMountains.push({x, h: 40 + Math.random() * 60, w: 60 + Math.random() * 40});
  }
  Game.bgTrees = [];
  for (let x = 0; x < Game.worldWidth; x += 20 + Math.random() * 25) {
    Game.bgTrees.push({x, h: 20 + Math.random() * 30});
  }
}

function drawBackground(camX) {
  let grd = ctx.createLinearGradient(0, 0, 0, BASE_H);
  const theme = Game.theme;

  if (theme === 'ice') {
    grd.addColorStop(0, '#0a1a3e'); grd.addColorStop(0.5, '#1a2a5e'); grd.addColorStop(1, '#2a3a6e');
  } else if (theme === 'metal') {
    grd.addColorStop(0, '#0a0a15'); grd.addColorStop(0.5, '#151525'); grd.addColorStop(1, '#202035');
  } else if (theme === 'castle') {
    grd.addColorStop(0, '#0a0810'); grd.addColorStop(0.5, '#1a1520'); grd.addColorStop(1, '#252030');
  } else if (theme === 'dark') {
    grd.addColorStop(0, '#0a0008'); grd.addColorStop(0.5, '#150010'); grd.addColorStop(1, '#200818');
  } else {
    grd.addColorStop(0, '#0a0a2e'); grd.addColorStop(0.5, '#1a1a4e'); grd.addColorStop(1, '#2a2a5e');
  }
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, BASE_W, BASE_H);

  ctx.fillStyle = '#ffffff';
  for (const star of Game.bgStars) {
    const sx = star.x - camX * 0.05;
    const wrapped = ((sx % BASE_W) + BASE_W) % BASE_W;
    ctx.globalAlpha = star.brightness * (0.5 + Math.sin(Date.now() * 0.003 + star.x) * 0.3);
    ctx.fillRect(wrapped, star.y, star.size, star.size);
  }
  ctx.globalAlpha = 1;

  if (theme === 'dark') {
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 10; i++) {
      const px = ((Date.now() * 0.01 + i * 200) % (BASE_W + 100)) - 50;
      const py = (Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5) * BASE_H * 0.7;
      ctx.fillStyle = i % 2 === 0 ? '#ff4400' : '#cc2200';
      ctx.fillRect(px, py, 2, 2);
    }
    ctx.globalAlpha = 1;
  }

  const mtColor = theme === 'ice' ? '#1a2a4e' : theme === 'metal' ? '#151520' : theme === 'castle' ? '#1a1520' : theme === 'dark' ? '#150010' : '#1a1a3e';
  ctx.fillStyle = mtColor;
  for (const mt of Game.bgMountains) {
    const sx = mt.x - camX * 0.15;
    ctx.beginPath(); ctx.moveTo(sx, BASE_H - 60); ctx.lineTo(sx + mt.w / 2, BASE_H - 60 - mt.h); ctx.lineTo(sx + mt.w, BASE_H - 60); ctx.fill();
  }

  const treeLeaf = theme === 'ice' ? '#1a3a4a' : theme === 'metal' ? '#1a2030' : theme === 'castle' ? '#1a1518' : theme === 'dark' ? '#100010' : '#0d2b0d';
  const treeTrunk = theme === 'ice' ? '#3a4a5a' : theme === 'metal' ? '#2a2a35' : theme === 'castle' ? '#2a1a15' : theme === 'dark' ? '#1a0510' : '#2a1a0a';
  for (const tree of Game.bgTrees) {
    const sx = tree.x - camX * 0.35;
    const by = BASE_H - 45;
    ctx.fillStyle = treeTrunk; ctx.fillRect(sx + 3, by - tree.h + 10, 4, tree.h - 10);
    ctx.fillStyle = treeLeaf;
    if (theme === 'metal') {
      ctx.fillRect(sx, by - tree.h, 10, tree.h);
      ctx.fillStyle = '#2a3040'; ctx.fillRect(sx + 1, by - tree.h + 2, 8, 4);
    } else if (theme === 'dark') {
      ctx.fillRect(sx + 1, by - tree.h, 8, 12);
      ctx.fillStyle = '#0a0005';
      ctx.fillRect(sx - 2, by - tree.h + 5, 4, 2);
      ctx.fillRect(sx + 8, by - tree.h + 3, 5, 2);
    } else {
      ctx.fillRect(sx - 2, by - tree.h, 14, 15);
      ctx.fillRect(sx, by - tree.h - 5, 10, 8);
    }
  }
}

// ============================================================
//  タイルタイプ → Assets画像 マッピング
//  Levelsのgenerate()で使うタイルtype名を全てAssetsに正しく変換
// ============================================================
const TILE_ASSET_MAP = {
  'grass':     'grassTop',
  'grassTop':  'grassTop',
  'dirt':      'dirt',
  'platform':  'platform',
  'spike':     'spike',
  'iceTop':    'iceTop',
  'iceBlock':  'iceBlock',
  'metalTop':  'metalTop',
  'metalBlock':'metalBlock',
  'castleTop': 'castleTop',
  'castleBlock':'castleBlock',
  'darkTop':   'darkTop',
  'darkBlock': 'darkBlock',
  'lavaTop':   'lavaTop'
};

function drawTiles(camX) {
  const startCol = Math.floor(camX / TILE) - 1;
  const endCol = startCol + Math.ceil(BASE_W / TILE) + 2;
  for (const tile of Game.tiles) {
    if (tile.x < startCol || tile.x > endCol) continue;
    const sx = tile.x * TILE - camX;
    const sy = tile.y * TILE;

    // マッピングテーブルでアセット名を取得
    const assetKey = TILE_ASSET_MAP[tile.type];
    if (assetKey && Assets.tiles[assetKey]) {
      ctx.drawImage(Assets.tiles[assetKey], sx, sy);
    } else {
      // フォールバック: 直接キーで試す
      if (Assets.tiles[tile.type]) {
        ctx.drawImage(Assets.tiles[tile.type], sx, sy);
      } else {
        // どれにも一致しない場合、デバッグ用に色付きブロック描画
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(sx, sy, TILE, TILE);
        ctx.fillStyle = '#fff';
        ctx.font = '6px monospace';
        ctx.fillText(tile.type.substring(0, 4), sx + 1, sy + 10);
      }
    }
  }
}

// ---- UI レイアウト定数 ----
const UI = {
  barX: 10, barY: 10, barW: 80, barH: 10,
  scorePanelW: 108, scorePanelH: 34, scorePanelPadding: 6,
  scoreFontSize: 13, powerBarW: 60, powerBarH: 5
};

function drawHpBar() {
  const { barX, barY, barW, barH } = UI;
  ctx.fillStyle = '#333'; ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
  const hpRatio = Game.player.hp / Game.player.maxHp;
  ctx.fillStyle = '#cc2222'; ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = hpRatio > 0.3 ? '#44cc44' : '#cccc22';
  ctx.fillRect(barX, barY, barW * hpRatio, barH);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
  ctx.strokeRect(barX - 1, barY - 1, barW + 2, barH + 2);
  ctx.fillStyle = '#fff'; ctx.font = '9px monospace';
  ctx.fillText('HP', barX + 2, barY + 8);
}

function drawScorePanel() {
  const { barX, barY } = UI;
  const { scorePanelW, scorePanelH, scorePanelPadding, scoreFontSize } = UI;
  const x = barX;
  const y = barY + 20;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(x, y - 2, scorePanelW, scorePanelH);
  ctx.strokeStyle = 'rgba(255, 204, 0, 0.55)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y - 2, scorePanelW, scorePanelH);
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 2;
  ctx.font = 'bold ' + scoreFontSize + 'px monospace';
  ctx.fillStyle = '#ffcc00';
  ctx.fillText('SCORE: ' + Game.score, x + scorePanelPadding, y + 11);
  const collected = Game.coins.filter(c => c.collected).length;
  ctx.fillStyle = '#ffdd77';
  ctx.fillText('COINS: ' + collected + '/' + Game.coins.length, x + scorePanelPadding, y + 26);
  ctx.shadowBlur = 0;
  return y + scorePanelH;
}

function drawPowerBar(powerY) {
  const { barX, powerBarW, powerBarH } = UI;
  const pratio = Game.player.powerTimer / Game.player.powerDuration;
  ctx.fillStyle = '#333'; ctx.fillRect(barX, powerY, powerBarW, powerBarH);
  ctx.fillStyle = '#ff8800'; ctx.fillRect(barX, powerY, powerBarW * pratio, powerBarH);
  ctx.strokeStyle = '#ffcc00'; ctx.strokeRect(barX, powerY, powerBarW, powerBarH);
  ctx.fillStyle = '#ffcc00'; ctx.font = '7px monospace';
  ctx.fillText('POWER', barX + 1, powerY + 11);
}

function drawUI() {
  const { barX, barY } = UI;
  drawHpBar();
  const scorePanelBottom = drawScorePanel();
  if (Game.player.powered) drawPowerBar(scorePanelBottom);
  ctx.fillStyle = '#555'; ctx.font = '7px monospace';
  ctx.fillText('[Z]剣  [Z長押し]溜め撃ち', barX, BASE_H - 6);
  ctx.fillStyle = '#888'; ctx.font = '10px monospace';
  ctx.fillText('STAGE ' + (Game.currentLevel + 1), BASE_W - 60, barY + 10);

  // Phase transition overlay for Stage 6（影の王→DEMON KING 覚醒：雷・恐怖演出）
  if (Game.bossPhaseTransition > 0) {
    const progress = 1 - (Game.bossPhaseTransition / 2.0);
    const t = Date.now() * 0.012;
    const flicker = 0.7 + Math.sin(t * 7) * 0.15 + Math.sin(t * 13) * 0.08;

    if (progress < 0.5) {
      ctx.globalAlpha = progress * 2 * flicker;
      ctx.fillStyle = '#1a0a0a';
      ctx.fillRect(0, 0, BASE_W, BASE_H);
      ctx.globalAlpha = progress * 1.5;
      ctx.fillStyle = '#330000';
      ctx.fillRect(0, 0, BASE_W, BASE_H);
      drawLightningBolt(ctx, progress, t, 0.4);
    } else {
      ctx.globalAlpha = (1 - progress) * 2 * flicker;
      ctx.fillStyle = '#0a0000';
      ctx.fillRect(0, 0, BASE_W, BASE_H);
      ctx.globalAlpha = (1 - progress) * 1.2;
      ctx.fillStyle = '#220000';
      ctx.fillRect(0, 0, BASE_W, BASE_H);
      drawLightningBolt(ctx, 1 - progress, t, 0.7);
    }
    ctx.globalAlpha = 1;

    ctx.font = 'bold 14px monospace';
    ctx.globalAlpha = Math.min(progress * 3, 1);
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 8;
    if (progress < 0.5) {
      ctx.fillStyle = '#ff4444';
      ctx.fillText('影が...消える...!', BASE_W / 2, BASE_H / 2 - 10);
      ctx.fillStyle = 'rgba(255,80,80,0.5)';
      ctx.font = '10px monospace';
      ctx.fillText('何かが...近づく...', BASE_W / 2, BASE_H / 2 + 15);
    } else {
      ctx.fillStyle = '#ffcc00';
      ctx.fillText('DEMON KING 覚醒！', BASE_W / 2, BASE_H / 2 - 10);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#ff8844';
      ctx.fillText('本気を出す...！', BASE_W / 2, BASE_H / 2 + 10);
    }
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }
}

/** 雷エフェクト（影の王→DEMON KING 演出用） */
function drawLightningBolt(ctx, intensity, seed, opacity) {
  if (intensity < 0.1) return;
  const count = Math.floor(1 + Math.sin(seed) * 1.5 + Math.cos(seed * 2) * 0.5) + 1;
  for (let i = 0; i < count; i++) {
    const xBase = (BASE_W * (0.2 + (i * 0.3) + Math.sin(seed + i) * 0.2));
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,' + Math.min(intensity * opacity * (0.6 + Math.sin(seed * 11 + i) * 0.3), 1) + ')';
    ctx.lineWidth = 2;
    let x = xBase;
    let y = 0;
    ctx.moveTo(x, y);
    for (let step = 0; step < 12; step++) {
      y += BASE_H / 12 + (Math.sin(seed * 7 + step) * 8);
      x = xBase + (Math.sin(seed * 13 + step * 2) * 60) + (step % 2) * 20;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}
