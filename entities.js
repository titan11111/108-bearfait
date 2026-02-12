// ============================================================
//  Part 6: Projectile, Player, Enemy, Boss, Coin, Potion, PowerUp
// ============================================================

class Projectile {
  constructor(x, y, vx, vy, type, damage, owner) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.w = (type === 'swordBeam') ? 16 : (type === 'laser') ? 10 : (type === 'skull') ? 10 : 8;
    this.h = (type === 'swordBeam') ? 10 : (type === 'laser') ? 6 : (type === 'skull') ? 10 : 8;
    this.type = type;
    this.damage = damage || 1;
    this.owner = owner;
    this.alive = true;
    this.life = 2.5;
  }
  update(dt) {
    if (!this.alive) return;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0 || this.x < -50 || this.x > Game.worldWidth + 50 || this.y > FALL_DEATH_Y) {
      this.alive = false;
    }
  }
  draw(ctx, camX) {
    if (!this.alive) return;
    let img;
    switch (this.type) {
      case 'swordBeam': img = Assets.projectile.swordBeam; break;
      case 'fireball':  img = Assets.projectile.fireball; break;
      case 'ice':       img = Assets.projectile.ice; break;
      case 'laser':     img = Assets.projectile.laser; break;
      case 'skull':     img = Assets.projectile.skull; break;
      default:          img = Assets.projectile.boss;
    }
    ctx.save();
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y);
    if (this.vx < 0) {
      ctx.translate(sx + this.w / 2, sy + this.h / 2);
      ctx.scale(-1, 1);
      ctx.drawImage(img, -this.w / 2, -this.h / 2);
    } else {
      ctx.drawImage(img, sx, sy);
    }
    ctx.restore();
  }
}

// ============================================================
//  Player - 剣標準装備 + チャージ攻撃
// ============================================================
class Player {
  constructor(x, y) {
    this.x = x * TILE;
    this.y = y * TILE;
    this.w = 14; this.h = 15;
    this.vx = 0; this.vy = 0;
    this.speed = 120;
    this.jumpForce = -330;
    this.gravity = 700;
    this.grounded = false;
    this.facing = 1;
    this.hp = 6; this.maxHp = 6;
    this.state = 'idle';
    this.animFrame = 0; this.animTimer = 0;
    this.slashTimer = 0;
    this.slashCooldown = 0;
    this.slashDamage = 1;
    this.charging = false;
    this.chargeTime = 0;
    this.chargeThreshold = 0.8;
    this.chargeReady = false;
    this.chargeReleaseTimer = 0;
    this.chargeBeamDamage = 3;
    this.damageTimer = 0;
    this.invincible = 0;
    this.dead = false;
    this.powered = false;
    this.powerTimer = 0;
    this.powerDuration = 20;
    this.ridingPlatform = null;
  }

  update(dt) {
    if (this.dead) return;
    if (this.invincible > 0) this.invincible -= dt;

    if (this.powered) {
      this.powerTimer -= dt;
      if (this.powerTimer <= 0) this.powered = false;
    }

    if (this.damageTimer > 0) {
      this.damageTimer -= dt;
      this.vy += this.gravity * dt;
      if (this.vy > 500) this.vy = 500;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      if (this.damageTimer <= 0) this.state = 'idle';
      if (this.y > FALL_DEATH_Y) this.takeDamage(99);
      return;
    }

    if (this.slashTimer > 0) {
      this.slashTimer -= dt;
      if (this.slashTimer <= 0 && !this.charging) this.state = 'idle';
    }
    if (this.slashCooldown > 0) this.slashCooldown -= dt;
    if (this.chargeReleaseTimer > 0) {
      this.chargeReleaseTimer -= dt;
      if (this.chargeReleaseTimer <= 0) this.state = 'idle';
    }

    let moveX = 0;
    if (Input.isDown('ArrowLeft') || Input.isDown('KeyA')) { moveX = -1; this.facing = -1; }
    if (Input.isDown('ArrowRight') || Input.isDown('KeyD')) { moveX = 1; this.facing = 1; }

    this.vx = moveX * this.speed * (this.charging ? 0.4 : 1);

    if ((Input.wasPressed('Space') || Input.wasPressed('ArrowUp') || Input.wasPressed('KeyW')) && this.grounded) {
      this.vy = this.jumpForce;
      this.grounded = false;
      this.ridingPlatform = null;
      if (window.SE) window.SE.jump();
      Particles.emit(this.x + this.w / 2, this.y + this.h, 5, ['#8b7355', '#a0916a'], 8, 60);
    }

    const atkDown = Input.isDown('KeyZ') || Input.isDown('KeyJ');
    const atkPressed = Input.wasPressed('KeyZ') || Input.wasPressed('KeyJ');

    if (atkPressed && this.slashCooldown <= 0 && !this.charging && this.chargeReleaseTimer <= 0) {
      this.slashTimer = 0.2;
      this.slashCooldown = 0.3;
      this.state = 'slash';
      this.charging = true;
      this.chargeTime = 0;
      this.chargeReady = false;
      if (window.SE) window.SE.slash();
    }

    if (this.charging && atkDown) {
      this.chargeTime += dt;
      if (this.chargeTime >= this.chargeThreshold && !this.chargeReady) {
        this.chargeReady = true;
        Camera.shake(1.5, 0.15);
        Particles.emit(this.x + this.w / 2, this.y + 2, 6, ['#ffcc00', '#ffffff', '#ffaa00'], 8, 50);
      }
      if (this.chargeTime > this.slashTimer) {
        this.state = 'charge';
      }
    }

    if (this.charging && !atkDown) {
      if (this.chargeReady) {
        this.state = 'chargeRelease';
        this.chargeReleaseTimer = 0.25;
        const dmg = this.powered ? this.chargeBeamDamage + 2 : this.chargeBeamDamage;
        const spd = 280;
        const px = this.facing > 0 ? this.x + this.w : this.x - 16;
        const py = this.y + 2;
        Game.projectiles.push(new Projectile(px, py, this.facing * spd, 0, 'swordBeam', dmg, 'player'));
        if (window.SE) window.SE.swordBeam();
        Camera.shake(3, 0.2);
        Particles.emit(px + 8, py + 5, 10, ['#ffdd44', '#ffffff', '#ffaa00'], 10, 80);
      }
      this.charging = false;
      this.chargeTime = 0;
      this.chargeReady = false;
    }

    this.vy += this.gravity * dt;
    if (this.vy > 500) this.vy = 500;

    if (this.ridingPlatform) {
      this.x += (this.ridingPlatform.x - this.ridingPlatform.prevX);
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.x < 0) this.x = 0;
    if (this.x > Game.worldWidth - this.w) this.x = Game.worldWidth - this.w;
    if (this.y > FALL_DEATH_Y) { this.takeDamage(99); return; }

    if (this.chargeReleaseTimer <= 0 && this.slashTimer <= 0 && !this.charging && this.damageTimer <= 0) {
      if (!this.grounded) {
        this.state = this.vy < 0 ? 'jump' : 'fall';
      } else if (Math.abs(this.vx) > 10) {
        this.state = 'run';
      } else {
        this.state = 'idle';
      }
    }

    this.animTimer += dt;
    if (this.animTimer > 0.12) { this.animTimer = 0; this.animFrame++; }
  }

  takeDamage(amount) {
    if (this.dead || this.invincible > 0 || this.damageTimer > 0) return;
    this.hp -= amount;
    this.damageTimer = 0.4;
    this.invincible = 1.2;
    this.state = 'damage';
    this.vy = -150;
    this.vx = -this.facing * 80;
    this.ridingPlatform = null;
    this.charging = false; this.chargeTime = 0; this.chargeReady = false;
    if (window.SE) window.SE.playerDamage();
    Camera.shake(4, 0.3);
    Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 8, ['#ff4444', '#ff8844', '#ffffff'], 10, 80);
    if (this.hp <= 0) {
      this.hp = 0; this.dead = true;
      if (window.SE) window.SE.gameOver();
      Game.state = GameStates.GAMEOVER;
      showGameOver();
    }
  }

  getSlashBox() {
    if (this.slashTimer <= 0) return null;
    const range = this.powered ? 24 : 18;
    const dmg = this.powered ? this.slashDamage + 1 : this.slashDamage;
    return {
      x: this.facing > 0 ? this.x + this.w : this.x - range,
      y: this.y - 2,
      w: range,
      h: this.h + 4,
      damage: dmg
    };
  }

  draw(ctx, camX) {
    if (this.dead) return;
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y);
    if (this.invincible > 0 && Math.floor(this.invincible * 10) % 2 === 0) return;

    ctx.save();
    let img;
    const f = this.animFrame;
    switch (this.state) {
      case 'idle': img = Assets.player.idle[f % 4]; break;
      case 'run': img = Assets.player.run[f % 4]; break;
      case 'jump': img = Assets.player.jump; break;
      case 'fall': img = Assets.player.fall; break;
      case 'slash': img = Assets.player.slash; break;
      case 'charge': img = Assets.player.charge[f % 2]; break;
      case 'chargeRelease': img = Assets.player.chargeRelease; break;
      case 'damage': img = Assets.player.damage; break;
      default: img = Assets.player.idle[0];
    }

    if (this.facing < 0) {
      ctx.translate(sx + img.width / 2, sy);
      ctx.scale(-1, 1);
      ctx.drawImage(img, -img.width / 2, 0);
    } else {
      ctx.drawImage(img, sx, sy);
    }
    ctx.restore();

    if (this.powered) {
      ctx.globalAlpha = 0.15 + Math.sin(Date.now() * 0.01) * 0.1;
      ctx.fillStyle = '#ff8800';
      ctx.fillRect(sx - 2, sy - 2, this.w + 4, this.h + 4);
      ctx.globalAlpha = 1;
    }

    if (this.charging && this.chargeTime > 0) {
      const maxW = 20;
      const ratio = Math.min(this.chargeTime / this.chargeThreshold, 1);
      const bx = sx - 3;
      const by = sy - 6;
      ctx.fillStyle = '#333';
      ctx.fillRect(bx, by, maxW, 3);
      ctx.fillStyle = ratio >= 1 ? '#ffcc00' : '#88aaff';
      ctx.fillRect(bx, by, maxW * ratio, 3);
      if (ratio >= 1) {
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.02) * 0.3;
        ctx.fillRect(bx, by, maxW, 3);
        ctx.globalAlpha = 1;
      }
    }

    if (this.slashTimer > 0 && !this.charging) {
      const sb = this.getSlashBox();
      if (sb) {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = this.powered ? '#ffcc44' : '#ccddff';
        ctx.fillRect(sb.x - camX, sb.y, sb.w, sb.h);
        ctx.globalAlpha = 1;
      }
    }
  }
}

// ============================================================
//  Enemy (+ new types for stages 4-6)
// ============================================================
class Enemy {
  constructor(type, x, y, patrolRange) {
    this.type = type;
    this.x = x * TILE; this.y = y * TILE;
    this.startX = this.x;
    this.w = (type === 'daruma') ? 28 : (type === 'skull') ? 30 : 14;
    this.h = (type === 'slime') ? 12 : (type === 'daruma') ? 24 : (type === 'skull') ? 28 : 14;
    this.patrolRange = patrolRange * TILE;
    this.speed = type === 'slime' ? 30 : type === 'mechDrone' ? 40 : type === 'skeleton' ? 35 : type === 'demonImp' ? 45 : type === 'skull' ? 38 : type === 'daruma' ? 60 : 50;
    this.dir = 1; this.alive = true;
    this.animFrame = 0; this.animTimer = 0;
    this.hp = (type === 'skeleton' || type === 'demonImp') ? 2 : 1;
    this.yBase = this.y;
    this.floatPhase = Math.random() * Math.PI * 2;
    this.scoreValue = type === 'slime' ? 100 : type === 'mechDrone' ? 200 : type === 'skeleton' ? 250 : type === 'demonImp' ? 300 : type === 'skull' ? 180 : type === 'daruma' ? 100 : 150;
    // 骸骨: ジグザグ用（上下に切り替え）
    this.zigzagDir = 1;
    this.zigzagTimer = 0;
    this.zigzagAmplitude = 24;
    // スケルトン: ダッシュ用（急に主人公に向かって突進）
    this.dashTimer = 1.2 + Math.random() * 1.2;
    this.dashCooldown = 2.5;
    this.dashDuration = 0;
    this.dashSpeed = 220;
    // デーモンインブ: ふわふわ浮遊＋主人公に寄る用
    this.floatPhaseY = Math.random() * Math.PI * 2;
    this.floatPhaseX = Math.random() * Math.PI * 2;
    this.homingSpeed = 28;
    // だるま: 転がり回転用
    this.angle = type === 'daruma' ? 0 : null;
  }
  update(dt) {
    if (!this.alive) return;
    this.animTimer += dt;
    if (this.animTimer > 0.2) { this.animTimer = 0; this.animFrame++; }

    const player = Game.player;
    const playerCx = player ? player.x + player.w / 2 : this.x + this.w / 2;
    const playerCy = player ? player.y + player.h / 2 : this.y + this.h / 2;

    // スケルトン: ダッシュ中は高速突進、それ以外はパトロール
    if (this.type === 'skeleton') {
      if (this.dashDuration > 0) {
        this.x += this.dashSpeed * this.dir * dt;
        this.dashDuration -= dt;
        if (this.dashDuration <= 0) this.dashTimer = this.dashCooldown;
      } else {
        this.dashTimer -= dt;
        if (this.dashTimer <= 0 && player) {
          const cx = this.x + this.w / 2;
          const dist = Math.abs(playerCx - cx);
          if (dist < 240 && dist > 20) {
            this.dir = playerCx > cx ? 1 : -1;
            this.dashDuration = 0.4;
            this.dashTimer = this.dashCooldown;
          } else {
            this.dashTimer = 0.8;
          }
        }
        if (this.dashDuration <= 0) {
          this.x += this.speed * this.dir * dt;
          if (this.x > this.startX + this.patrolRange) this.dir = -1;
          if (this.x < this.startX - this.patrolRange) this.dir = 1;
        }
      }
    } else if (this.type === 'demonImp') {
      // デーモンインブ: ふわふわ浮遊 ＋ 少し主人公に寄る
      this.floatPhaseY += dt * 2.8;
      this.floatPhaseX += dt * 1.5;
      const wobbleY = Math.sin(this.floatPhaseY) * 12 + Math.sin(this.floatPhaseY * 2.3) * 4;
      const wobbleX = Math.sin(this.floatPhaseX) * 6;
      this.yBase += (playerCy - (this.yBase + this.h / 2)) * 0.06 * dt;
      this.y = this.yBase + wobbleY;
      this.x += this.speed * this.dir * dt * 0.35;
      const cx = this.x + this.w / 2;
      const dx = playerCx - cx;
      const distX = Math.abs(dx);
      if (distX < 200 && player) {
        const pull = 1 - distX / 200;
        this.x += (dx / (distX || 1)) * this.homingSpeed * pull * dt;
      }
      this.x += wobbleX * dt * 10;
      if (this.x > this.startX + this.patrolRange) this.dir = -1;
      if (this.x < this.startX - this.patrolRange) this.dir = 1;
    } else {
      this.x += this.speed * this.dir * dt;
      if (this.x > this.startX + this.patrolRange) this.dir = -1;
      if (this.x < this.startX - this.patrolRange) this.dir = 1;
      // だるま: 移動量に応じて回転（転がり表現）
      if (this.type === 'daruma') {
        const vx = this.speed * this.dir;
        const radius = 14;
        this.angle -= (vx * dt) / radius;
      }
    }

    if (this.type === 'bat') {
      this.floatPhase += dt * 3;
      this.y = this.yBase + Math.sin(this.floatPhase) * 10;
    }
    if (this.type === 'mechDrone') {
      this.floatPhase += dt * 2;
      this.y = this.yBase + Math.sin(this.floatPhase) * 4;
    }
    // 骸骨: ジグザグに上下移動（一定時間で向き反転）
    if (this.type === 'skull') {
      this.zigzagTimer += dt;
      if (this.zigzagTimer > 0.35) {
        this.zigzagTimer = 0;
        this.zigzagDir *= -1;
      }
      this.y += this.zigzagDir * 55 * dt;
      const half = this.zigzagAmplitude * 0.5;
      if (this.y > this.yBase + half) { this.y = this.yBase + half; this.zigzagDir = -1; }
      if (this.y < this.yBase - half) { this.y = this.yBase - half; this.zigzagDir = 1; }
    }
  }
  takeDamage(dmg) {
    this.hp -= (dmg || 1);
    if (this.hp <= 0) {
      this.alive = false;
      if (window.SE) window.SE.enemyDefeat();
      Game.score += this.scoreValue;
      const colors = {
        slime: ['#33cc33', '#66ff66', '#fff'],
        bat: ['#8844cc', '#aa66ff', '#fff'],
        mechDrone: ['#00cccc', '#88dddd', '#fff'],
        skeleton: ['#ddddcc', '#aaaaaa', '#fff'],
        demonImp: ['#cc3333', '#ff6644', '#ffcc00'],
        skull: ['#ffffff', '#cccccc', '#333333'],
        daruma: ['#cc2222', '#ff4444', '#ffcc00']
      };
      Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 12,
        colors[this.type] || ['#fff'], 12, 100);
    }
  }
  draw(ctx, camX) {
    if (!this.alive) return;
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y);
    let imgs = Assets.enemy[this.type];
    if (!imgs || imgs.length === 0) imgs = Assets.enemy.slime;
    const img = imgs[this.animFrame % imgs.length];
    const iw = img.width || 16;
    const ih = img.height || 16;
    ctx.save();

    if (this.type === 'daruma') {
      // だるま: 転がり表現（移動量に応じて回転）、中心基準で描画
      const cx = sx + this.w / 2;
      const cy = sy + this.h / 2;
      ctx.translate(cx, cy);
      ctx.rotate(this.angle);
      const sw = Math.min(28, img.width || iw);
      const sh = Math.min(24, img.height || ih);
      ctx.drawImage(img, 0, 0, sw, sh, -this.w / 2, -this.h / 2, this.w, this.h);
    } else if (this.type === 'skull') {
      // スカル: 2コマ（口閉じ・口開け）アニメーション、左向きベース（右移動時は反転）
      const frame = this.animFrame % 2;
      const sw = 30, sh = 28;
      const srcX = (img.width >= 60) ? frame * sw : 0;
      if (this.dir > 0) {
        ctx.translate(sx + this.w / 2, sy);
        ctx.scale(-1, 1);
        ctx.drawImage(img, srcX, 0, sw, sh, -this.w / 2, 0, this.w, this.h);
      } else {
        ctx.drawImage(img, srcX, 0, sw, sh, sx, sy, this.w, this.h);
      }
    } else {
      if (this.dir < 0) {
        ctx.translate(sx + iw / 2, sy);
        ctx.scale(-1, 1);
        ctx.drawImage(img, -iw / 2, 0, iw, ih);
      } else {
        ctx.drawImage(img, sx, sy, iw, ih);
      }
    }
    ctx.restore();
  }
}

// ============================================================
//  Boss (supports all 7 types including 2-phase stage 6)
// ============================================================
class Boss {
  constructor(type, x, y, floorY, name) {
    this.type = type;
    this.name = name || 'BOSS';
    this.alive = true;
    this.active = false;

    this.drawW = 80; this.drawH = 80;

    // Type-specific config
    if (type === 'golem') {
      this.w = 48; this.h = 64; this.maxHp = 12; this.hp = 12;
      this.speed = 35; this.attackRate = 2.2; this.patrolRange = 4 * TILE;
      this.chargeTimer = 0; this.charging = false;
    } else if (type === 'dragon') {
      this.w = 52; this.h = 60; this.maxHp = 16; this.hp = 16;
      this.speed = 45; this.attackRate = 1.8; this.patrolRange = 5 * TILE;
      this.floatPhase = 0;
    } else if (type === 'iceWizard') {
      this.w = 42; this.h = 60; this.maxHp = 20; this.hp = 20;
      this.speed = 30; this.attackRate = 1.4; this.patrolRange = 6 * TILE;
      this.teleportTimer = 5.0;
    } else if (type === 'robot') {
      this.w = 48; this.h = 60; this.maxHp = 24; this.hp = 24;
      this.speed = 25; this.attackRate = 1.2; this.patrolRange = 5 * TILE;
      this.laserBurstTimer = 0; this.laserBurstCount = 0;
      this.shieldActive = false; this.shieldTimer = 0;
    } else if (type === 'knight') {
      this.w = 48; this.h = 64; this.maxHp = 28; this.hp = 28;
      this.speed = 55; this.attackRate = 1.0; this.patrolRange = 6 * TILE;
      this.dashTimer = 0; this.dashing = false; this.dashDir = 1;
      this.comboCount = 0; this.comboTimer = 0;
    } else if (type === 'shadowKing') {
      this.w = 50; this.h = 65; this.maxHp = 30; this.hp = 30;
      this.speed = 20; this.attackRate = 1.6; this.patrolRange = 5 * TILE;
      this.floatPhase = 0;
      this.entranceTimer = 2.0; // 上から降下演出
      this.entranceDone = false;
    } else if (type === 'demonKing') {
      this.w = 54; this.h = 68; this.maxHp = 40; this.hp = 40;
      this.speed = 30; this.attackRate = 1.0; this.patrolRange = 6 * TILE;
      this.skullThrowTimer = 0;
      this.rageMode = false; this.rageTimer = 0;
      this.floatPhase = 0;
    }

    this.x = x * TILE;
    this.floorY = floorY * TILE;
    this.y = this.floorY - this.h;
    this.startX = this.x;
    this.startY = this.y;

    this.drawOffX = (this.w - this.drawW) / 2;
    this.drawOffY = this.h - this.drawH;

    this.dir = -1;
    this.attackCooldown = 0;
    this.animFrame = 0; this.animTimer = 0;
    this.damageFlash = 0;
    this.stompInvincible = 0;
  }

  update(dt) {
    if (!this.alive) return;

    if (!this.active) {
      if (Math.abs(Game.player.x - this.x) < BASE_W * 0.55) {
        this.active = true;
        document.getElementById('bossBar').style.display = 'block';
        document.getElementById('bossName').textContent = this.name;
        Camera.shake(3, 0.5);
      }
      return;
    }

    this.animTimer += dt;
    if (this.animTimer > 0.25) { this.animTimer = 0; this.animFrame++; }
    if (this.damageFlash > 0) this.damageFlash -= dt;
    if (this.stompInvincible > 0) this.stompInvincible -= dt;
    this.attackCooldown -= dt;

    const px = Game.player.x;
    const py = Game.player.y;

    switch (this.type) {
      case 'golem':      this._updateGolem(dt, px, py); break;
      case 'dragon':     this._updateDragon(dt, px, py); break;
      case 'iceWizard':  this._updateIceWizard(dt, px, py); break;
      case 'robot':      this._updateRobot(dt, px, py); break;
      case 'knight':     this._updateKnight(dt, px, py); break;
      case 'shadowKing': this._updateShadowKing(dt, px, py); break;
      case 'demonKing':  this._updateDemonKing(dt, px, py); break;
    }

    const ratio = Math.max(0, this.hp / this.maxHp);
    document.getElementById('bossBarInner').style.width = (ratio * 100) + '%';
  }

  // --- Golem (Stage 1) ---
  _updateGolem(dt, px, py) {
    if (this.chargeTimer > 0) {
      this.chargeTimer -= dt;
      this.x += this.dir * 100 * dt;
      if (this.chargeTimer <= 0) this.charging = false;
    } else {
      this.dir = px < this.x ? -1 : 1;
      this.x += this.speed * this.dir * dt;
      this._clampPatrol();
    }
    if (this.attackCooldown <= 0 && !this.charging) {
      this.attackCooldown = this.attackRate;
      if (Math.abs(px - this.x) < 70) {
        this.chargeTimer = 0.5; this.charging = true;
        Camera.shake(3, 0.3);
      } else {
        this._shootAt(px, py, 100, 'boss', 1);
      }
    }
  }

  // --- Dragon (Stage 2) ---
  _updateDragon(dt, px, py) {
    this.floatPhase += dt * 2;
    const floatOff = Math.sin(this.floatPhase) * 6;
    this.y = (this.floorY - this.h) + floatOff;
    this.dir = px < this.x ? -1 : 1;
    this.x += this.speed * this.dir * dt * 0.5;
    this._clampPatrol();
    if (this.attackCooldown <= 0) {
      this.attackCooldown = this.attackRate;
      const baseAngle = Math.atan2(py - (this.y + this.h * 0.4), px - this.x);
      for (let i = -1; i <= 1; i++) {
        const a = baseAngle + i * 0.2;
        Game.projectiles.push(new Projectile(
          this.x + (this.dir > 0 ? this.w : 0), this.y + this.h * 0.4,
          Math.cos(a) * 130, Math.sin(a) * 130, 'boss', 1, 'boss'));
      }
      Particles.emit(this.x + this.w / 2, this.y + this.h * 0.4, 6, ['#ff4400', '#ffcc00', '#ff8800'], 8, 60);
    }
  }

  // --- Ice Wizard (Stage 3) ---
  _updateIceWizard(dt, px, py) {
    this.dir = px < this.x ? -1 : 1;
    this.x += this.speed * this.dir * dt;
    this._clampPatrol();
    this.teleportTimer -= dt;
    if (this.teleportTimer <= 0) {
      this.teleportTimer = 4.0 + Math.random() * 2;
      Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 12, ['#44ccff', '#aaeeff', '#fff'], 14, 100);
      this.x = px + (Math.random() > 0.5 ? 50 : -50);
      this.startX = this.x;
      Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 12, ['#44ccff', '#aaeeff', '#fff'], 14, 100);
    }
    if (this.attackCooldown <= 0) {
      this.attackCooldown = this.attackRate;
      if (this.animFrame % 3 === 0) {
        const angle = Math.atan2(py - this.y, px - this.x);
        for (let i = -1; i <= 1; i++) {
          Game.projectiles.push(new Projectile(
            this.x + this.w / 2, this.y,
            Math.cos(angle + i * 0.3) * 110, Math.sin(angle + i * 0.3) * 110, 'ice', 1, 'boss'));
        }
      } else {
        for (let i = 0; i < 3; i++) {
          Game.projectiles.push(new Projectile(
            px - 30 + Math.random() * 60, this.y - 60,
            (Math.random() - 0.5) * 20, 100 + Math.random() * 40, 'ice', 1, 'boss'));
        }
      }
      Particles.emit(this.x + this.w / 2, this.y + 5, 6, ['#44ccff', '#88eeff', '#fff'], 8, 50);
    }
  }

  // --- Robot / Mech Guardian (Stage 4) ---
  _updateRobot(dt, px, py) {
    this.dir = px < this.x ? -1 : 1;

    // Shield mechanic: activates when hp < 50%, blocks frontal damage periodically
    if (this.hp < this.maxHp * 0.5) {
      this.shieldTimer -= dt;
      if (this.shieldTimer <= 0) {
        this.shieldActive = !this.shieldActive;
        this.shieldTimer = this.shieldActive ? 2.0 : 3.0;
        if (this.shieldActive) {
          Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 8, ['#00ffff', '#88ffff', '#fff'], 12, 60);
        }
      }
    }

    this.x += this.speed * this.dir * dt;
    this._clampPatrol();

    // Laser burst attack
    if (this.laserBurstCount > 0) {
      this.laserBurstTimer -= dt;
      if (this.laserBurstTimer <= 0) {
        this.laserBurstTimer = 0.15;
        this.laserBurstCount--;
        const angle = Math.atan2(py - (this.y + this.h * 0.3), px - (this.x + this.w / 2));
        Game.projectiles.push(new Projectile(
          this.x + this.w / 2, this.y + this.h * 0.3,
          Math.cos(angle) * 180, Math.sin(angle) * 180, 'laser', 1, 'boss'));
        Particles.emit(this.x + this.w / 2, this.y + this.h * 0.3, 3, ['#00ffff', '#fff'], 4, 30);
      }
    }

    if (this.attackCooldown <= 0 && this.laserBurstCount <= 0) {
      this.attackCooldown = this.attackRate;
      if (this.animFrame % 3 === 0) {
        // Laser burst: 5 rapid shots
        this.laserBurstCount = 5;
        this.laserBurstTimer = 0;
        Camera.shake(2, 0.3);
      } else {
        // Ground slam: spawn projectiles from above
        for (let i = 0; i < 4; i++) {
          Game.projectiles.push(new Projectile(
            px - 40 + Math.random() * 80, this.y - 80,
            (Math.random() - 0.5) * 30, 120 + Math.random() * 40, 'laser', 1, 'boss'));
        }
        Camera.shake(3, 0.2);
        Particles.emit(this.x + this.w / 2, this.y + this.h, 8, ['#00cccc', '#88dddd', '#fff'], 12, 80);
      }
    }
  }

  // --- Knight / Dark Knight (Stage 5) ---
  _updateKnight(dt, px, py) {
    this.dir = px < this.x ? -1 : 1;

    // Dash attack
    if (this.dashing) {
      this.dashTimer -= dt;
      this.x += this.dashDir * 200 * dt;
      if (this.dashTimer <= 0) {
        this.dashing = false;
        // Slash projectile at end of dash
        Game.projectiles.push(new Projectile(
          this.x + (this.dashDir > 0 ? this.w : -8), this.y + this.h * 0.3,
          this.dashDir * 150, 0, 'boss', 2, 'boss'));
        Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 8, ['#aaaaaa', '#cccccc', '#fff'], 10, 70);
      }
    } else {
      this.x += this.speed * this.dir * dt;
      this._clampPatrol();
    }

    // Combo system
    if (this.comboTimer > 0) this.comboTimer -= dt;

    if (this.attackCooldown <= 0 && !this.dashing) {
      this.attackCooldown = this.attackRate;
      this.comboCount++;

      if (this.comboCount % 4 === 0) {
        // Every 4th attack: dash attack
        this.dashing = true;
        this.dashTimer = 0.4;
        this.dashDir = this.dir;
        Camera.shake(4, 0.3);
        Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 6, ['#ffffff', '#aaaaaa'], 8, 60);
      } else if (this.comboCount % 3 === 0) {
        // 3-way sword wave
        const baseAngle = Math.atan2(py - (this.y + this.h * 0.3), px - this.x);
        for (let i = -1; i <= 1; i++) {
          const a = baseAngle + i * 0.25;
          Game.projectiles.push(new Projectile(
            this.x + this.w / 2, this.y + this.h * 0.3,
            Math.cos(a) * 140, Math.sin(a) * 140, 'boss', 1, 'boss'));
        }
        Particles.emit(this.x + this.w / 2, this.y + this.h * 0.3, 6, ['#aaaaaa', '#fff'], 8, 50);
      } else {
        // Single aimed shot
        this._shootAt(px, py, 160, 'boss', 1);
      }
      this.comboTimer = 3.0;
    }

    // Reset combo if timer expires
    if (this.comboTimer <= 0) this.comboCount = 0;
  }

  // --- Shadow King (Stage 6 Phase 1) ---
  _updateShadowKing(dt, px, py) {
    // Entrance: float down
    if (!this.entranceDone) {
      this.entranceTimer -= dt;
      if (this.entranceTimer > 0) {
        this.y = (this.floorY - this.h) - this.entranceTimer * 80;
        return;
      }
      this.entranceDone = true;
      this.y = this.floorY - this.h;
      Camera.shake(4, 0.5);
      Particles.emit(this.x + this.w / 2, this.y + this.h, 15, ['#111111', '#222222', '#000000'], 16, 100);
    }

    this.floatPhase += dt * 2;
    const floatOff = Math.sin(this.floatPhase) * 8;
    this.y = (this.floorY - this.h) + floatOff;

    this.dir = px < this.x ? -1 : 1;
    this.x += this.speed * this.dir * dt;
    this._clampPatrol();

    if (this.attackCooldown <= 0) {
      this.attackCooldown = this.attackRate;

      if (this.animFrame % 4 === 0) {
        // Shadow wave: ground-level projectiles
        for (let i = -2; i <= 2; i++) {
          Game.projectiles.push(new Projectile(
            this.x + this.w / 2 + i * 20, this.floorY - 12,
            i * 40, -60 - Math.abs(i) * 20, 'boss', 1, 'boss'));
        }
        Camera.shake(3, 0.3);
        Particles.emit(this.x + this.w / 2, this.floorY - 8, 10, ['#111', '#222', '#333'], 20, 80);
      } else if (this.animFrame % 3 === 0) {
        // Teleport near player then shoot
        Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 10, ['#000', '#111', '#222'], 14, 100);
        this.x = px + (Math.random() > 0.5 ? 60 : -60);
        this.startX = this.x;
        Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 10, ['#000', '#111', '#222'], 14, 100);
        // Immediate attack after teleport
        const angle = Math.atan2(py - this.y, px - this.x);
        for (let i = -1; i <= 1; i++) {
          Game.projectiles.push(new Projectile(
            this.x + this.w / 2, this.y + this.h * 0.3,
            Math.cos(angle + i * 0.3) * 120, Math.sin(angle + i * 0.3) * 120, 'boss', 1, 'boss'));
        }
      } else {
        // Aimed dark bolts
        this._shootAt(px, py, 130, 'boss', 1);
      }
    }
  }

  // --- Demon King (Stage 6 Phase 2) ---
  _updateDemonKing(dt, px, py) {
    this.floatPhase += dt * 1.5;
    const floatOff = Math.sin(this.floatPhase) * 4;
    this.y = (this.floorY - this.h) + floatOff;

    this.dir = px < this.x ? -1 : 1;
    this.x += this.speed * this.dir * dt;
    this._clampPatrol();

    // Rage mode at 40% HP
    if (!this.rageMode && this.hp < this.maxHp * 0.4) {
      this.rageMode = true;
      this.attackRate = 0.7;
      this.speed = 45;
      Camera.shake(6, 0.8);
      Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 20, ['#ff4444', '#ffcc00', '#ff8800'], 20, 120);
    }

    // Skull throw timer
    this.skullThrowTimer -= dt;

    if (this.attackCooldown <= 0) {
      this.attackCooldown = this.attackRate;

      if (this.skullThrowTimer <= 0) {
        // Skull throw: orbiting skulls fly at player
        this.skullThrowTimer = this.rageMode ? 2.5 : 4.0;
        const numSkulls = this.rageMode ? 5 : 3;
        for (let i = 0; i < numSkulls; i++) {
          const delay = i * 0.15;
          const baseAngle = Math.atan2(py - (this.y + 10), px - (this.x + this.w / 2));
          const spread = (i - Math.floor(numSkulls / 2)) * 0.2;
          const spd = 130 + Math.random() * 30;
          // Delayed spawn via setTimeout-style (using life offset)
          const p = new Projectile(
            this.x + this.w / 2, this.y + 10,
            Math.cos(baseAngle + spread) * spd,
            Math.sin(baseAngle + spread) * spd - 40,
            'skull', 2, 'boss');
          p.life = 3.0;
          Game.projectiles.push(p);
        }
        Camera.shake(3, 0.3);
        Particles.emit(this.x + this.w / 2, this.y + 10, 8, ['#e8c830', '#f0d840', '#fff'], 12, 80);
      } else if (this.animFrame % 3 === 0) {
        // Fire breath spread
        const baseAngle = Math.atan2(py - (this.y + this.h * 0.4), px - this.x);
        const count = this.rageMode ? 5 : 3;
        for (let i = 0; i < count; i++) {
          const a = baseAngle + (i - Math.floor(count / 2)) * 0.15;
          Game.projectiles.push(new Projectile(
            this.x + (this.dir > 0 ? this.w : 0), this.y + this.h * 0.4,
            Math.cos(a) * 140, Math.sin(a) * 140, 'boss', 1, 'boss'));
        }
        Particles.emit(this.x + this.w / 2, this.y + this.h * 0.4, 8, ['#ff4400', '#ffcc00', '#ff8800'], 10, 70);
      } else {
        // Ground eruption
        for (let i = 0; i < (this.rageMode ? 5 : 3); i++) {
          Game.projectiles.push(new Projectile(
            px - 40 + Math.random() * 80, this.floorY - 10,
            (Math.random() - 0.5) * 40, -120 - Math.random() * 60, 'skull', 1, 'boss'));
        }
        Camera.shake(2, 0.2);
        Particles.emit(px, this.floorY - 8, 6, ['#e8c830', '#ff4400', '#fff'], 14, 80);
      }
    }
  }

  _clampPatrol() {
    if (this.x > this.startX + this.patrolRange) this.x = this.startX + this.patrolRange;
    if (this.x < this.startX - this.patrolRange) this.x = this.startX - this.patrolRange;
  }

  _shootAt(px, py, speed, type, dmg) {
    const cx = this.x + this.w / 2;
    const cy = this.y + this.h * 0.3;
    const angle = Math.atan2(py - cy, px - cx);
    Game.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed, type, dmg, 'boss'));
  }

  takeDamage(dmg) {
    if (!this.alive || !this.active) return;
    // Robot shield check
    if (this.type === 'robot' && this.shieldActive) {
      dmg = Math.max(1, Math.floor(dmg * 0.3));
      Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 4, ['#00ffff', '#88ffff'], 6, 40);
    }
    this.hp -= (dmg || 1);
    this.damageFlash = 0.15;
    Camera.shake(2, 0.15);
    Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 8, ['#ffffff', '#ffcc00', '#ff8844'], 12, 80);
    if (this.hp <= 0) {
      this.hp = 0; this.alive = false;
      if (this.type !== 'shadowKing' && window.SE) window.SE.bossDefeat();
      Game.bossDefeated = true;
      Game.score += this.type === 'demonKing' ? 2000 : this.type === 'shadowKing' ? 800 : 500;
      document.getElementById('bossBar').style.display = 'none';
      Game.projectiles = Game.projectiles.filter(p => p.owner !== 'boss');
      Camera.shake(6, 0.8);
      const defeatColors = this.type === 'shadowKing' ? ['#111', '#222', '#333', '#000'] :
                           this.type === 'demonKing' ? ['#ff4444', '#ffcc00', '#ff8800', '#e8c830', '#ffffff'] :
                           ['#ff4444', '#ffcc00', '#ff8800', '#ffffff'];
      Particles.emit(this.x + this.w / 2, this.y + this.h / 2, 30, defeatColors, 20, 150);

      // Stage 6 phase transition: shadow -> demon king
      if (this.type === 'shadowKing') {
        Game.bossDefeated = false; // Don't open goal yet
        Game.bossPhase = 2;
        Game.bossPhaseTransition = 2.0; // 2 second transition
      }
    }
  }

  takeStompDamage() {
    if (this.stompInvincible > 0) return;
    this.takeDamage(2);
    this.stompInvincible = 0.5;
  }

  draw(ctx, camX) {
    if (!this.alive) return;
    const imgs = Assets.boss[this.type];
    const img = imgs[this.animFrame % imgs.length];
    const dx = Math.round(this.x + this.drawOffX - camX);
    const dy = Math.round(this.y + this.drawOffY);

    if (!this.active) {
      ctx.globalAlpha = 0.6;
      ctx.drawImage(img, dx, dy, this.drawW, this.drawH);
      ctx.globalAlpha = 1;
      return;
    }

    ctx.save();
    if (this.damageFlash > 0) {
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.05) * 0.3;
    }
    if (this.dir < 0) {
      ctx.translate(dx + this.drawW / 2, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(img, -this.drawW / 2, 0, this.drawW, this.drawH);
    } else {
      ctx.drawImage(img, dx, dy, this.drawW, this.drawH);
    }
    ctx.restore();

    // Robot shield visual
    if (this.type === 'robot' && this.shieldActive && this.active) {
      ctx.globalAlpha = 0.2 + Math.sin(Date.now() * 0.01) * 0.1;
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(dx + this.drawW / 2, dy + this.drawH / 2, this.drawW * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Demon King rage aura
    if (this.type === 'demonKing' && this.rageMode && this.active) {
      ctx.globalAlpha = 0.15 + Math.sin(Date.now() * 0.008) * 0.1;
      ctx.fillStyle = '#ff4400';
      ctx.fillRect(dx - 4, dy - 4, this.drawW + 8, this.drawH + 8);
      ctx.globalAlpha = 1;
    }
  }
}

// ============================================================
//  Coin, Potion, PowerUp (unchanged)
// ============================================================
class Coin {
  constructor(x, y) {
    this.x = x * TILE + 2; this.y = y * TILE + 2;
    this.w = 10; this.h = 10;
    this.collected = false;
    this.animFrame = 0; this.animTimer = 0;
    this.floatPhase = Math.random() * Math.PI * 2;
    this.baseY = this.y;
  }
  update(dt) {
    if (this.collected) return;
    this.animTimer += dt;
    if (this.animTimer > 0.1) { this.animTimer = 0; this.animFrame++; }
    this.floatPhase += dt * 2;
    this.y = this.baseY + Math.sin(this.floatPhase) * 3;
  }
  draw(ctx, camX) {
    if (this.collected) return;
    ctx.drawImage(Assets.items.coin[this.animFrame % 4], this.x - camX, this.y);
  }
}

class Potion {
  constructor(x, y) {
    this.x = x * TILE + 3; this.y = y * TILE + 1;
    this.w = 10; this.h = 14; this.collected = false;
  }
  update(dt) {}
  draw(ctx, camX) {
    if (this.collected) return;
    ctx.drawImage(Assets.items.potion, this.x - camX, this.y);
  }
}

class PowerUp {
  constructor(x, y) {
    this.x = x * TILE + 1; this.y = y * TILE + 1;
    this.w = 12; this.h = 12; this.collected = false;
    this.floatPhase = Math.random() * Math.PI * 2;
    this.baseY = this.y;
  }
  update(dt) {
    if (this.collected) return;
    this.floatPhase += dt * 3;
    this.y = this.baseY + Math.sin(this.floatPhase) * 4;
  }
  draw(ctx, camX) {
    if (this.collected) return;
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y);
    ctx.drawImage(Assets.items.powerUp, sx, sy);
    ctx.globalAlpha = 0.2 + Math.sin(Date.now() * 0.008) * 0.15;
    ctx.fillStyle = '#ff8800';
    ctx.fillRect(sx - 2, sy - 2, this.w + 4, this.h + 4);
    ctx.globalAlpha = 1;
  }
}
