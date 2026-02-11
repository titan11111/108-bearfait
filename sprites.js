// ============================================================
//  Part 4: SpriteGen + Assets
// ============================================================

const SpriteGen = {
  _c: document.createElement('canvas'),

  draw(w, h, fn) {
    this._c.width = w;
    this._c.height = h;
    const c = this._c.getContext('2d');
    c.clearRect(0, 0, w, h);
    fn(c);
    const img = new Image();
    img.src = this._c.toDataURL();
    return img;
  },

  // ---- Player sprites (same as original) ----
  playerIdle(frame) {
    return this.draw(16, 16, c => {
      const yOff = frame % 2 === 0 ? 0 : -1;
      c.fillStyle = '#553300'; c.fillRect(3, 13 + yOff, 4, 3); c.fillRect(9, 13 + yOff, 4, 3);
      c.fillStyle = '#2266cc'; c.fillRect(4, 7 + yOff, 8, 6);
      c.fillStyle = '#ffcc88'; c.fillRect(5, 2 + yOff, 6, 5);
      c.fillStyle = '#000'; c.fillRect(7, 4 + yOff, 1, 1); c.fillRect(10, 4 + yOff, 1, 1);
      c.fillStyle = '#884400'; c.fillRect(5, 1 + yOff, 6, 2); c.fillRect(4, 2 + yOff, 1, 2);
      c.fillStyle = '#cc2222'; c.fillRect(3, 8 + yOff, 1, 5); c.fillRect(2, 10 + yOff, 1, 3);
      c.fillStyle = '#ccaa44'; c.fillRect(12, 8 + yOff, 2, 1);
      c.fillStyle = '#dddddd'; c.fillRect(13, 9 + yOff, 1, 5);
      c.fillStyle = '#ffffff'; c.fillRect(13, 10 + yOff, 1, 3);
    });
  },

  playerRun(frame) {
    return this.draw(16, 16, c => {
      const f = frame % 4;
      const legOffsets = [[0,2],[1,0],[2,0],[0,1]];
      const [lL, lR] = [legOffsets[f][0], legOffsets[f][1]];
      c.fillStyle = '#553300'; c.fillRect(2, 13 - lL, 4, 3); c.fillRect(10, 13 - lR, 4, 3);
      c.fillStyle = '#2266cc'; c.fillRect(5, 7, 8, 6);
      c.fillStyle = '#ffcc88'; c.fillRect(6, 2, 6, 5);
      c.fillStyle = '#000'; c.fillRect(9, 4, 1, 1); c.fillRect(11, 4, 1, 1);
      c.fillStyle = '#884400'; c.fillRect(6, 1, 6, 2); c.fillRect(4, 2, 2, 2);
      c.fillStyle = '#cc2222'; c.fillRect(2, 8, 3, 4 + f % 2); c.fillRect(1, 10, 2, 3);
      c.fillStyle = '#ccaa44'; c.fillRect(13, 7, 2, 1);
      c.fillStyle = '#dddddd'; c.fillRect(14, 8, 1, 5);
      c.fillStyle = '#ffffff'; c.fillRect(14, 9, 1, 3);
    });
  },

  playerJump() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#553300'; c.fillRect(4, 12, 4, 2); c.fillRect(8, 12, 4, 2);
      c.fillStyle = '#2266cc'; c.fillRect(4, 6, 8, 6);
      c.fillStyle = '#ffcc88'; c.fillRect(2, 4, 2, 4); c.fillRect(12, 4, 2, 4); c.fillRect(5, 1, 6, 5);
      c.fillStyle = '#000'; c.fillRect(7, 3, 1, 1); c.fillRect(10, 3, 1, 1);
      c.fillStyle = '#884400'; c.fillRect(5, 0, 6, 2);
      c.fillStyle = '#cc2222'; c.fillRect(3, 9, 1, 5); c.fillRect(2, 11, 1, 4);
      c.fillStyle = '#ccaa44'; c.fillRect(13, 5, 2, 1);
      c.fillStyle = '#dddddd'; c.fillRect(14, 1, 1, 4);
      c.fillStyle = '#ffffff'; c.fillRect(14, 0, 1, 2);
    });
  },

  playerFall() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#553300'; c.fillRect(2, 13, 4, 3); c.fillRect(10, 13, 4, 3);
      c.fillStyle = '#2266cc'; c.fillRect(4, 7, 8, 6);
      c.fillStyle = '#ffcc88'; c.fillRect(1, 7, 3, 2); c.fillRect(12, 7, 3, 2); c.fillRect(5, 2, 6, 5);
      c.fillStyle = '#000'; c.fillRect(7, 4, 1, 2); c.fillRect(10, 4, 1, 2);
      c.fillStyle = '#884400'; c.fillRect(5, 0, 6, 3); c.fillRect(6, -1, 4, 2);
      c.fillStyle = '#cc2222'; c.fillRect(3, 6, 1, 2); c.fillRect(2, 4, 1, 3);
      c.fillStyle = '#ccaa44'; c.fillRect(13, 8, 2, 1);
      c.fillStyle = '#dddddd'; c.fillRect(14, 9, 1, 5);
    });
  },

  playerSlash() {
    return this.draw(22, 16, c => {
      c.fillStyle = '#553300'; c.fillRect(1, 13, 4, 3); c.fillRect(7, 13, 4, 3);
      c.fillStyle = '#2266cc'; c.fillRect(2, 7, 8, 6);
      c.fillStyle = '#ffcc88'; c.fillRect(3, 2, 6, 5);
      c.fillStyle = '#000'; c.fillRect(6, 4, 1, 1); c.fillRect(8, 4, 1, 1);
      c.fillStyle = '#ffcc88'; c.fillRect(10, 6, 3, 2);
      c.fillStyle = '#884400'; c.fillRect(3, 1, 6, 2);
      c.fillStyle = '#cc2222'; c.fillRect(0, 8, 2, 5);
      c.fillStyle = '#ccaa44'; c.fillRect(13, 5, 2, 2);
      c.fillStyle = '#dddddd';
      c.fillRect(15, 3, 1, 2); c.fillRect(16, 2, 1, 3); c.fillRect(17, 1, 1, 3); c.fillRect(18, 0, 1, 3);
      c.fillStyle = '#ffffff'; c.fillRect(19, 0, 1, 2); c.fillRect(20, 0, 1, 1);
      c.fillStyle = 'rgba(255,255,200,0.6)'; c.fillRect(15, 1, 6, 1); c.fillRect(16, 5, 4, 1);
    });
  },

  playerCharge(frame) {
    return this.draw(16, 16, c => {
      const pulse = frame % 2;
      c.fillStyle = '#553300'; c.fillRect(3, 13, 4, 3); c.fillRect(9, 13, 4, 3);
      c.fillStyle = '#2266cc'; c.fillRect(4, 7, 8, 6);
      c.fillStyle = '#ffcc88'; c.fillRect(5, 2, 6, 5);
      c.fillStyle = '#000'; c.fillRect(7, 4, 1, 1); c.fillRect(10, 4, 1, 1);
      c.fillStyle = '#884400'; c.fillRect(5, 1, 6, 2); c.fillRect(4, 2, 1, 2);
      c.fillStyle = '#cc2222'; c.fillRect(3, 8, 1, 5); c.fillRect(2, 10, 1, 3);
      c.fillStyle = '#ccaa44'; c.fillRect(12, 4, 2, 2);
      c.fillStyle = '#ffffff'; c.fillRect(13, 0, 1, 4); c.fillRect(12, 1, 1, 2);
      const glowColor = pulse ? '#ffcc00' : '#ffaa00';
      c.fillStyle = glowColor;
      c.fillRect(11, 0, 3, 1); c.fillRect(14, 0, 1, 3); c.fillRect(11, 3, 1, 2);
      c.globalAlpha = 0.5; c.fillRect(10, -1, 5, 1); c.fillRect(10, 5, 5, 1); c.globalAlpha = 1;
    });
  },

  playerChargeRelease() {
    return this.draw(24, 16, c => {
      c.fillStyle = '#553300'; c.fillRect(1, 13, 4, 3); c.fillRect(7, 13, 4, 3);
      c.fillStyle = '#2266cc'; c.fillRect(2, 7, 8, 6);
      c.fillStyle = '#ffcc88'; c.fillRect(3, 2, 6, 5);
      c.fillStyle = '#000'; c.fillRect(6, 4, 1, 1); c.fillRect(8, 4, 1, 1);
      c.fillStyle = '#ffcc88'; c.fillRect(10, 6, 3, 2);
      c.fillStyle = '#884400'; c.fillRect(3, 1, 6, 2);
      c.fillStyle = '#cc2222'; c.fillRect(0, 8, 2, 5);
      c.fillStyle = '#ccaa44'; c.fillRect(13, 5, 2, 2);
      c.fillStyle = '#ffffff'; c.fillRect(15, 4, 2, 4); c.fillRect(17, 3, 2, 6); c.fillRect(19, 4, 2, 4);
      c.fillStyle = '#ffcc00'; c.fillRect(21, 5, 2, 2); c.fillRect(20, 4, 1, 4);
    });
  },

  playerDamage() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#ff6666';
      c.fillRect(4, 13, 3, 3); c.fillRect(9, 12, 3, 3);
      c.fillRect(4, 7, 8, 6); c.fillRect(5, 2, 6, 5);
      c.fillStyle = '#ffaaaa'; c.fillRect(7, 4, 2, 2);
    });
  },

  // ---- Enemies ----
  slime(frame) {
    return this.draw(16, 16, c => {
      const squish = frame % 2 === 0 ? 0 : 1;
      c.fillStyle = '#33cc33'; c.fillRect(2, 8 + squish, 12, 8 - squish); c.fillRect(4, 6 + squish, 8, 2);
      c.fillStyle = '#22aa22'; c.fillRect(3, 10 + squish, 10, 4);
      c.fillStyle = '#fff'; c.fillRect(5, 9 + squish, 2, 2); c.fillRect(9, 9 + squish, 2, 2);
      c.fillStyle = '#000'; c.fillRect(6, 10 + squish, 1, 1); c.fillRect(10, 10 + squish, 1, 1);
      c.fillStyle = 'rgba(255,255,255,0.5)'; c.fillRect(4, 7 + squish, 2, 2);
    });
  },

  bat(frame) {
    return this.draw(16, 16, c => {
      const wingUp = frame % 2 === 0;
      c.fillStyle = '#6633aa'; c.fillRect(6, 7, 4, 4);
      c.fillStyle = '#8844cc';
      if (wingUp) { c.fillRect(0, 4, 6, 3); c.fillRect(10, 4, 6, 3); c.fillRect(1, 3, 4, 1); c.fillRect(11, 3, 4, 1); }
      else { c.fillRect(0, 8, 6, 3); c.fillRect(10, 8, 6, 3); c.fillRect(1, 11, 4, 1); c.fillRect(11, 11, 4, 1); }
      c.fillStyle = '#ff0000'; c.fillRect(7, 8, 1, 1); c.fillRect(9, 8, 1, 1);
      c.fillStyle = '#fff'; c.fillRect(7, 10, 1, 1); c.fillRect(9, 10, 1, 1);
    });
  },

  // Stage 4 enemy: mech drone
  mechDrone(frame) {
    return this.draw(16, 16, c => {
      const bob = frame % 2 === 0 ? 0 : -1;
      c.fillStyle = '#667788'; c.fillRect(3, 6 + bob, 10, 8);
      c.fillStyle = '#8899aa'; c.fillRect(4, 4 + bob, 8, 3);
      c.fillStyle = '#00cccc'; c.fillRect(5, 8 + bob, 2, 2); c.fillRect(9, 8 + bob, 2, 2);
      c.fillStyle = '#445566'; c.fillRect(1, 9 + bob, 2, 4); c.fillRect(13, 9 + bob, 2, 4);
      c.fillStyle = '#556677'; c.fillRect(5, 14 + bob, 3, 2); c.fillRect(8, 14 + bob, 3, 2);
      c.fillStyle = '#00ffff'; c.fillRect(7, 3 + bob, 2, 1);
    });
  },

  // Stage 5 enemy: skeleton warrior
  skeleton(frame) {
    return this.draw(16, 16, c => {
      const f = frame % 2;
      c.fillStyle = '#ddddcc'; c.fillRect(5, 2, 6, 5);
      c.fillStyle = '#000'; c.fillRect(6, 4, 2, 1); c.fillRect(9, 4, 2, 1);
      c.fillStyle = '#333'; c.fillRect(7, 6, 3, 1);
      c.fillStyle = '#ccccbb'; c.fillRect(5, 7, 6, 5);
      c.fillStyle = '#bbbbaa'; c.fillRect(4, 12, 3, 4); c.fillRect(9, 12, 3, 4);
      c.fillStyle = '#888877'; c.fillRect(11, 5 + f, 3, 1); c.fillRect(13, 4 + f, 1, 4);
      c.fillStyle = '#aaaaaa'; c.fillRect(14, 3 + f, 1, 2);
    });
  },

  // Stage 6 enemy: demon imp
  demonImp(frame) {
    return this.draw(16, 16, c => {
      const f = frame % 2;
      c.fillStyle = '#cc3333'; c.fillRect(4, 5, 8, 7);
      c.fillStyle = '#dd4444'; c.fillRect(5, 3, 6, 4);
      c.fillStyle = '#ffcc00'; c.fillRect(6, 5, 2, 2); c.fillRect(9, 5, 2, 2);
      c.fillStyle = '#000'; c.fillRect(7, 6, 1, 1); c.fillRect(10, 6, 1, 1);
      c.fillStyle = '#aa2222'; c.fillRect(4, 12, 3, 4); c.fillRect(9, 12, 3, 4);
      c.fillStyle = '#881111'; c.fillRect(4, 1, 2, 3); c.fillRect(10, 1, 2, 3);
      c.fillStyle = '#cc3333';
      if (f === 0) { c.fillRect(1, 4, 3, 5); c.fillRect(12, 4, 3, 5); }
      else { c.fillRect(0, 3, 4, 4); c.fillRect(12, 3, 4, 4); }
      c.fillStyle = '#992222'; c.fillRect(7, 12, 1, 2); c.fillRect(6, 14, 1, 2);
    });
  },

  // ---- Items ----
  coin(frame) {
    return this.draw(12, 12, c => {
      const widths = [8, 6, 4, 6]; const w = widths[frame % 4]; const x = (12 - w) / 2;
      c.fillStyle = '#ffcc00'; c.fillRect(x, 1, w, 10);
      c.fillStyle = '#ffdd44'; c.fillRect(x + 1, 2, Math.max(w - 2, 1), 8);
      c.fillStyle = '#aa8800'; if (w > 4) c.fillRect(x + w / 2 - 1, 4, 2, 4);
    });
  },
  potion() {
    return this.draw(10, 14, c => {
      c.fillStyle = '#aaaaaa'; c.fillRect(3, 0, 4, 3);
      c.fillStyle = '#888888'; c.fillRect(4, 0, 2, 1);
      c.fillStyle = '#4444ff'; c.fillRect(1, 3, 8, 10); c.fillRect(2, 13, 6, 1);
      c.fillStyle = '#ff4488'; c.fillRect(2, 6, 6, 6);
      c.fillStyle = 'rgba(255,255,255,0.4)'; c.fillRect(2, 4, 2, 4);
    });
  },
  powerUp() {
    return this.draw(14, 14, c => {
      c.fillStyle = '#ff6600'; c.fillRect(3, 3, 8, 8);
      c.fillRect(5, 1, 4, 2); c.fillRect(5, 11, 4, 2);
      c.fillRect(1, 5, 2, 4); c.fillRect(11, 5, 2, 4);
      c.fillStyle = '#ffcc00'; c.fillRect(5, 5, 4, 4);
      c.fillStyle = '#fff'; c.fillRect(6, 4, 2, 1); c.fillRect(4, 6, 1, 2);
    });
  },
  flag() {
    return this.draw(16, 32, c => {
      c.fillStyle = '#888888'; c.fillRect(2, 0, 2, 32);
      c.fillStyle = '#ff4444'; c.fillRect(4, 2, 10, 8);
      c.fillStyle = '#ffcc00'; c.fillRect(6, 4, 6, 4);
      c.fillStyle = '#ffcc00'; c.fillRect(1, 0, 4, 2);
    });
  },

  // ---- Projectiles ----
  swordBeam() {
    return this.draw(16, 10, c => {
      c.fillStyle = '#ffdd44'; c.fillRect(0, 2, 12, 6); c.fillRect(2, 1, 10, 8);
      c.fillStyle = '#ffffff'; c.fillRect(2, 3, 8, 4); c.fillRect(4, 2, 6, 6);
      c.fillStyle = '#ffeeaa'; c.fillRect(10, 3, 4, 4); c.fillRect(12, 2, 2, 6); c.fillRect(14, 3, 2, 4);
      c.fillStyle = '#fff'; c.fillRect(4, 4, 4, 2);
    });
  },
  fireball() {
    return this.draw(8, 8, c => {
      c.fillStyle = '#ff4400'; c.fillRect(1, 1, 6, 6);
      c.fillStyle = '#ffcc00'; c.fillRect(2, 2, 4, 4);
      c.fillStyle = '#fff'; c.fillRect(3, 3, 2, 2);
    });
  },
  bossProjectile() {
    return this.draw(8, 8, c => {
      c.fillStyle = '#ff2200'; c.fillRect(2, 0, 4, 8); c.fillRect(0, 2, 8, 4);
      c.fillStyle = '#ffaa00'; c.fillRect(3, 1, 2, 6); c.fillRect(1, 3, 6, 2);
    });
  },
  iceProjectile() {
    return this.draw(8, 8, c => {
      c.fillStyle = '#44ccff'; c.fillRect(2, 0, 4, 8); c.fillRect(0, 2, 8, 4);
      c.fillStyle = '#aaeeff'; c.fillRect(3, 1, 2, 6); c.fillRect(1, 3, 6, 2);
      c.fillStyle = '#fff'; c.fillRect(3, 3, 2, 2);
    });
  },
  laserProjectile() {
    return this.draw(10, 6, c => {
      c.fillStyle = '#00ffff'; c.fillRect(0, 1, 10, 4);
      c.fillStyle = '#88ffff'; c.fillRect(1, 2, 8, 2);
      c.fillStyle = '#fff'; c.fillRect(2, 2, 4, 2);
    });
  },
  skullProjectile() {
    return this.draw(10, 10, c => {
      c.fillStyle = '#e8c830'; c.fillRect(2, 1, 6, 7);
      c.fillStyle = '#f0d840'; c.fillRect(3, 2, 4, 5);
      c.fillStyle = '#2a1005'; c.fillRect(3, 3, 2, 2); c.fillRect(6, 3, 2, 2);
      c.fillStyle = '#2a1005'; c.fillRect(5, 6, 1, 1);
      c.fillStyle = '#d4a020'; c.fillRect(0, 4, 2, 2); c.fillRect(8, 4, 2, 2);
    });
  },

  // ---- Tiles ----
  grassTop() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#5c3d1e'; c.fillRect(0, 0, 16, 16);
      c.fillStyle = '#44aa22'; c.fillRect(0, 0, 16, 5);
      c.fillStyle = '#55cc33'; c.fillRect(1, 0, 3, 3); c.fillRect(6, 0, 2, 2); c.fillRect(11, 0, 4, 3);
      c.fillStyle = '#4a3018'; c.fillRect(3, 8, 2, 2); c.fillRect(10, 12, 3, 2); c.fillRect(6, 10, 1, 1);
    });
  },
  dirt() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#5c3d1e'; c.fillRect(0, 0, 16, 16);
      c.fillStyle = '#4a3018'; c.fillRect(2, 3, 2, 2); c.fillRect(8, 7, 3, 2); c.fillRect(12, 2, 2, 1); c.fillRect(5, 12, 2, 2);
      c.fillStyle = '#6b4c2a'; c.fillRect(0, 6, 2, 2); c.fillRect(10, 11, 2, 3); c.fillRect(6, 1, 3, 2);
    });
  },
  platform() {
    return this.draw(16, 8, c => {
      c.fillStyle = '#887755'; c.fillRect(0, 0, 16, 8);
      c.fillStyle = '#776644'; c.fillRect(0, 0, 16, 2); c.fillRect(0, 6, 16, 2);
      c.fillStyle = '#998866'; c.fillRect(2, 2, 4, 4); c.fillRect(10, 2, 4, 4);
    });
  },
  spike() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#888888';
      for (let i = 0; i < 4; i++) { c.fillRect(i*4+1, 6, 2, 10); c.fillRect(i*4, 8, 4, 8); }
      c.fillStyle = '#aaaaaa';
      for (let i = 0; i < 4; i++) { c.fillRect(i*4+1, 4, 2, 4); c.fillRect(Math.floor(i*4+1.5), 2, 1, 3); }
    });
  },
  iceTop() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#667799'; c.fillRect(0, 0, 16, 16);
      c.fillStyle = '#aaddff'; c.fillRect(0, 0, 16, 5);
      c.fillStyle = '#cceeff'; c.fillRect(1, 0, 3, 3); c.fillRect(7, 0, 2, 2); c.fillRect(12, 0, 3, 3);
      c.fillStyle = '#556688'; c.fillRect(4, 9, 2, 2); c.fillRect(10, 12, 2, 2);
    });
  },
  iceBlock() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#667799'; c.fillRect(0, 0, 16, 16);
      c.fillStyle = '#556688'; c.fillRect(3, 3, 2, 2); c.fillRect(9, 8, 3, 2); c.fillRect(5, 12, 2, 2);
      c.fillStyle = '#7788aa'; c.fillRect(0, 5, 2, 2); c.fillRect(11, 2, 2, 2);
    });
  },
  // Stage 4: Metal tiles
  metalTop() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#556070'; c.fillRect(0, 0, 16, 16);
      c.fillStyle = '#7890a0'; c.fillRect(0, 0, 16, 4);
      c.fillStyle = '#8aa0b0'; c.fillRect(1, 0, 3, 2); c.fillRect(8, 0, 4, 2);
      c.fillStyle = '#445060'; c.fillRect(2, 7, 2, 2); c.fillRect(10, 10, 3, 2);
      c.fillStyle = '#00cccc'; c.fillRect(7, 12, 2, 1);
    });
  },
  metalBlock() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#556070'; c.fillRect(0, 0, 16, 16);
      c.fillStyle = '#445060'; c.fillRect(3, 3, 3, 3); c.fillRect(9, 8, 2, 2); c.fillRect(5, 12, 3, 2);
      c.fillStyle = '#667080'; c.fillRect(0, 6, 2, 2); c.fillRect(12, 2, 2, 2);
    });
  },
  // Stage 5: Castle tiles
  castleTop() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#7a6a5a'; c.fillRect(0, 0, 16, 16);
      c.fillStyle = '#9a8a7a'; c.fillRect(0, 0, 16, 4);
      c.fillStyle = '#aa9a8a'; c.fillRect(1, 0, 6, 2); c.fillRect(10, 0, 5, 2);
      c.fillStyle = '#6a5a4a'; c.fillRect(8, 0, 1, 16); c.fillRect(0, 8, 16, 1);
      c.fillStyle = '#5a4a3a'; c.fillRect(3, 10, 2, 2); c.fillRect(11, 4, 2, 2);
    });
  },
  castleBlock() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#7a6a5a'; c.fillRect(0, 0, 16, 16);
      c.fillStyle = '#6a5a4a'; c.fillRect(8, 0, 1, 16); c.fillRect(0, 8, 16, 1);
      c.fillStyle = '#5a4a3a'; c.fillRect(3, 3, 2, 2); c.fillRect(12, 10, 2, 2);
    });
  },
  // Stage 6: Dark tiles
  darkTop() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#2a1a2a'; c.fillRect(0, 0, 16, 16);
      c.fillStyle = '#4a2a3a'; c.fillRect(0, 0, 16, 4);
      c.fillStyle = '#5a3a4a'; c.fillRect(2, 0, 3, 2); c.fillRect(9, 0, 4, 2);
      c.fillStyle = '#1a0a1a'; c.fillRect(4, 8, 2, 2); c.fillRect(10, 12, 3, 1);
      c.fillStyle = '#cc3333'; c.fillRect(7, 6, 1, 1); c.fillRect(13, 9, 1, 1);
    });
  },
  darkBlock() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#2a1a2a'; c.fillRect(0, 0, 16, 16);
      c.fillStyle = '#1a0a1a'; c.fillRect(3, 3, 2, 2); c.fillRect(9, 8, 3, 2); c.fillRect(5, 12, 2, 2);
      c.fillStyle = '#3a2a3a'; c.fillRect(0, 5, 2, 2); c.fillRect(12, 2, 2, 2);
    });
  },
  lavaTop() {
    return this.draw(16, 16, c => {
      c.fillStyle = '#ff4400'; c.fillRect(0, 0, 16, 16);
      c.fillStyle = '#ff6600'; c.fillRect(0, 0, 16, 5);
      c.fillStyle = '#ffcc00'; c.fillRect(2, 0, 3, 3); c.fillRect(8, 0, 4, 2); c.fillRect(13, 0, 2, 3);
      c.fillStyle = '#ff8800'; c.fillRect(5, 6, 3, 3); c.fillRect(10, 10, 2, 2);
    });
  },
  movingPlatform() {
    return this.draw(16, 8, c => {
      c.fillStyle = '#6688aa'; c.fillRect(0, 0, 16, 8);
      c.fillStyle = '#88aacc'; c.fillRect(0, 0, 16, 2); c.fillRect(0, 6, 16, 2);
      c.fillStyle = '#aaccee'; c.fillRect(3, 2, 4, 4); c.fillRect(9, 2, 4, 4);
      c.fillStyle = '#ffcc44'; c.fillRect(7, 3, 2, 2);
    });
  },
  crumblePlatform() {
    return this.draw(16, 8, c => {
      c.fillStyle = '#997755'; c.fillRect(0, 0, 16, 8);
      c.fillStyle = '#886644'; c.fillRect(0, 0, 16, 2); c.fillRect(0, 6, 16, 2);
      c.fillStyle = '#aa8866'; c.fillRect(2, 2, 3, 4); c.fillRect(11, 2, 3, 4);
      c.fillStyle = '#665533'; c.fillRect(6, 1, 1, 6); c.fillRect(9, 0, 1, 5);
    });
  },
  crumblePlatformFading() {
    return this.draw(16, 8, c => {
      c.fillStyle = 'rgba(153,119,85,0.5)'; c.fillRect(0, 0, 16, 8);
      c.fillStyle = 'rgba(136,102,68,0.5)'; c.fillRect(0, 0, 16, 2); c.fillRect(0, 6, 16, 2);
      c.fillStyle = 'rgba(102,85,51,0.5)'; c.fillRect(3, 1, 1, 6); c.fillRect(7, 0, 1, 5); c.fillRect(11, 1, 1, 6);
    });
  }
};

// ============================================================
//  Boss SVG Sprites (80x80)
// ============================================================
const BossSVG = {
  _createImage(svgString, w, h) {
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(blob);
    return img;
  },

  // --- Stage 1: Golem ---
  golem(frame) {
    const bob = frame % 2 === 0 ? 0 : 1;
    const eyeGlow = frame % 2 === 0 ? '#ff4400' : '#ff8844';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <rect x="18" y="${62+bob}" width="14" height="18" rx="2" fill="#5a4a3a"/>
      <rect x="48" y="${62+bob}" width="14" height="18" rx="2" fill="#5a4a3a"/>
      <rect x="14" y="${24+bob}" width="52" height="42" rx="6" fill="#776655"/>
      <rect x="18" y="${28+bob}" width="44" height="34" rx="4" fill="#665544"/>
      <line x1="28" y1="${30+bob}" x2="30" y2="${52+bob}" stroke="#443322" stroke-width="2"/>
      <line x1="52" y1="${34+bob}" x2="50" y2="${56+bob}" stroke="#443322" stroke-width="2"/>
      <rect x="2" y="${30+bob}" width="14" height="22" rx="4" fill="#665544"/>
      <rect x="64" y="${30+bob}" width="14" height="22" rx="4" fill="#665544"/>
      <rect x="0" y="${40+bob}" width="10" height="10" rx="3" fill="#776655"/>
      <rect x="70" y="${40+bob}" width="10" height="10" rx="3" fill="#776655"/>
      <rect x="20" y="${8+bob}" width="40" height="22" rx="5" fill="#887766"/>
      <rect x="24" y="${12+bob}" width="32" height="14" rx="3" fill="#776655"/>
      <rect x="28" y="${14+bob}" width="8" height="6" rx="1" fill="#221100"/>
      <rect x="44" y="${14+bob}" width="8" height="6" rx="1" fill="#221100"/>
      <rect x="30" y="${15+bob}" width="4" height="4" rx="1" fill="${eyeGlow}"/>
      <rect x="46" y="${15+bob}" width="4" height="4" rx="1" fill="${eyeGlow}"/>
      <rect x="34" y="${22+bob}" width="12" height="4" rx="1" fill="#332211"/>
      <rect x="16" y="${24+bob}" width="6" height="3" rx="1" fill="#446633"/>
      <rect x="58" y="${26+bob}" width="5" height="3" rx="1" fill="#446633"/>
    </svg>`;
    return this._createImage(svg, 80, 80);
  },

  // --- Stage 2: Dragon ---
  dragon(frame) {
    const bob = frame % 2 === 0 ? 0 : -1;
    const wingUp = frame % 2 === 0;
    const firePhase = frame % 4;
    const mouthOpen = firePhase < 2;
    const wY1 = wingUp ? 12 : 22;
    const wY2 = wingUp ? 8 : 26;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <defs><radialGradient id="dg" cx="50%" cy="40%"><stop offset="0%" stop-color="#dd4455"/><stop offset="100%" stop-color="#881122"/></radialGradient>
      <radialGradient id="bg" cx="50%" cy="50%"><stop offset="0%" stop-color="#ffbb88"/><stop offset="100%" stop-color="#dd7744"/></radialGradient></defs>
      <path d="M56,${52+bob} C64,${50+bob} 70,${44+bob} 74,${38+bob} C78,${32+bob} 76,${28+bob} 78,${24+bob}" stroke="#992233" stroke-width="6" fill="none" stroke-linecap="round"/>
      <polygon points="78,${22+bob} 80,${18+bob} 76,${20+bob} 74,${26+bob}" fill="#881122"/>
      <rect x="18" y="${62+bob}" width="10" height="16" rx="2" fill="#992233"/>
      <rect x="44" y="${62+bob}" width="10" height="16" rx="2" fill="#992233"/>
      <ellipse cx="38" cy="${48+bob}" rx="22" ry="18" fill="url(#dg)"/>
      <ellipse cx="38" cy="${52+bob}" rx="14" ry="10" fill="url(#bg)"/>
      <path d="M48,${34+bob} L62,${wY1+bob} L66,${wY2+bob} L58,${wY1+4+bob} L70,${wY2-2+bob} L74,${wY1+bob} L60,${36+bob} Z" fill="#aa1133" opacity="0.85"/>
      <path d="M26,${38+bob} C22,${34+bob} 20,${28+bob} 22,${24+bob}" stroke="#cc2244" stroke-width="10" fill="none" stroke-linecap="round"/>
      <ellipse cx="22" cy="${22+bob}" rx="16" ry="13" fill="#dd3355"/>
      <ellipse cx="10" cy="${28+bob}" rx="10" ry="${mouthOpen ? 7 : 5}" fill="#cc2244"/>
      ${mouthOpen ? `<ellipse cx="10" cy="${30+bob}" rx="7" ry="4" fill="#551111"/>` : ''}
      <polygon points="14,${10+bob} 10,${0+bob} 12,${4+bob} 18,${12+bob}" fill="#882233"/>
      <polygon points="28,${10+bob} 32,${0+bob} 30,${4+bob} 24,${12+bob}" fill="#882233"/>
      <ellipse cx="16" cy="${18+bob}" rx="4.5" ry="4" fill="#ffdd00"/>
      <circle cx="17" cy="${18+bob}" r="2" fill="#000"/>
      <ellipse cx="28" cy="${18+bob}" rx="4.5" ry="4" fill="#ffdd00"/>
      <circle cx="29" cy="${18+bob}" r="2" fill="#000"/>
      <polygon points="36,${28+bob} 38,${22+bob} 40,${28+bob}" fill="#aa1133"/>
      <polygon points="42,${30+bob} 44,${24+bob} 46,${30+bob}" fill="#aa1133"/>
      <polygon points="48,${32+bob} 50,${26+bob} 52,${32+bob}" fill="#aa1133"/>
      ${mouthOpen ? `<ellipse cx="-2" cy="${28+bob}" rx="6" ry="4" fill="#ff6600" opacity="0.9"/><ellipse cx="-6" cy="${28+bob}" rx="5" ry="3" fill="#ffcc00" opacity="0.7"/>` : ''}
    </svg>`;
    return this._createImage(svg, 80, 80);
  },

  // --- Stage 3: Ice Wizard ---
  iceWizard(frame) {
    const bob = frame % 2 === 0 ? 0 : -1;
    const sparkle = frame % 3;
    const orbGlow = frame % 2 === 0 ? '0.8' : '0.5';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <polygon points="14,${44+bob} 8,${80} 64,${80} 58,${44+bob}" fill="#2244aa"/>
      <polygon points="18,${48+bob} 12,${80} 60,${80} 54,${48+bob}" fill="#3366cc"/>
      <rect x="22" y="${36+bob}" width="28" height="20" rx="4" fill="#3366cc"/>
      <rect x="20" y="${52+bob}" width="32" height="4" rx="1" fill="#ffcc44"/>
      <rect x="62" y="${14+bob}" width="3" height="58" rx="1" fill="#8888aa"/>
      <circle cx="63" cy="${12+bob}" r="8" fill="#44ccff" opacity="${orbGlow}"/>
      <circle cx="63" cy="${12+bob}" r="5" fill="#88eeff"/>
      <circle cx="63" cy="${12+bob}" r="3" fill="#ccffff"/>
      <ellipse cx="36" cy="${26+bob}" rx="14" ry="12" fill="#aaccff"/>
      <polygon points="16,${20+bob} 36,${-2+bob} 56,${20+bob}" fill="#1133aa"/>
      <polygon points="20,${20+bob} 36,${2+bob} 52,${20+bob}" fill="#2244bb"/>
      <rect x="14" y="${18+bob}" width="44" height="6" rx="2" fill="#1133aa"/>
      <polygon points="36,${4+bob} 34,${8+bob} 30,${8+bob} 33,${11+bob} 32,${15+bob} 36,${12+bob} 40,${15+bob} 39,${11+bob} 42,${8+bob} 38,${8+bob}" fill="#aaddff"/>
      <ellipse cx="30" cy="${26+bob}" rx="3.5" ry="3" fill="#88ddff"/>
      <circle cx="31" cy="${26+bob}" r="1.5" fill="#fff"/>
      <ellipse cx="42" cy="${26+bob}" rx="3.5" ry="3" fill="#88ddff"/>
      <circle cx="43" cy="${26+bob}" r="1.5" fill="#fff"/>
      <path d="M22,${40+bob} L10,${48+bob} L14,${52+bob} L24,${46+bob}" fill="#2244aa"/>
      <path d="M50,${40+bob} L58,${34+bob} L62,${38+bob} L54,${44+bob}" fill="#2244aa"/>
      ${sparkle === 0 ? `<rect x="4" y="${34+bob}" width="3" height="3" fill="#88eeff" opacity="0.7" transform="rotate(45,5.5,${35.5+bob})"/>` : ''}
      ${sparkle === 1 ? `<rect x="68" y="${24+bob}" width="2" height="2" fill="#ccffff" opacity="0.8" transform="rotate(45,69,${25+bob})"/>` : ''}
    </svg>`;
    return this._createImage(svg, 80, 80);
  },

  // === Stage 4: Robot ===
  robot(frame) {
    const bob = frame % 2 === 0 ? 0 : -1;
    const eyeColor = frame % 2 === 0 ? '#00ffff' : '#00cccc';
    const antennaColor = frame % 3 === 0 ? '#00ffff' : '#00aacc';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <!-- shadow -->
      <ellipse cx="40" cy="78" rx="22" ry="3" fill="rgba(0,0,0,0.2)"/>
      <!-- legs -->
      <rect x="18" y="58${bob > 0 ? '+1' : ''}" width="12" height="10" rx="2" fill="#b0b8c0" stroke="#8a9299" stroke-width="1"/>
      <rect x="16" y="${67+bob}" width="16" height="8" rx="3" fill="#c8cdd2" stroke="#8a9299" stroke-width="1"/>
      <rect x="50" y="58" width="12" height="10" rx="2" fill="#b0b8c0" stroke="#8a9299" stroke-width="1"/>
      <rect x="48" y="${67+bob}" width="16" height="8" rx="3" fill="#c8cdd2" stroke="#8a9299" stroke-width="1"/>
      <!-- body -->
      <rect x="18" y="30" width="44" height="30" rx="5" fill="#e0e5ea" stroke="#b0b8c0" stroke-width="1.5"/>
      <rect x="30" y="35" width="20" height="6" rx="2" fill="#88c8d8" opacity="0.6"/>
      <circle cx="28" cy="50" r="2" fill="#5ab0c0"/>
      <circle cx="36" cy="50" r="2" fill="#5ab0c0"/>
      <circle cx="44" cy="50" r="2" fill="${antennaColor}" opacity="0.8"/>
      <circle cx="52" cy="50" r="2" fill="#5ab0c0"/>
      <!-- arms -->
      <rect x="4" y="34" width="14" height="8" rx="3" fill="#b0b8c0"/>
      <rect x="0" y="40" width="12" height="14" rx="3" fill="#c8cdd2"/>
      <rect x="62" y="34" width="14" height="8" rx="3" fill="#b0b8c0"/>
      <rect x="68" y="40" width="12" height="14" rx="3" fill="#c8cdd2"/>
      <!-- head -->
      <rect x="14" y="6" width="52" height="28" rx="8" fill="#e8ecf0" stroke="#b0b8c0" stroke-width="1.5"/>
      <!-- ear left -->
      <circle cx="12" cy="20" r="7" fill="#c8cdd2"/>
      <circle cx="12" cy="20" r="4" fill="#6ab8c8"/>
      <!-- ear right -->
      <circle cx="68" cy="20" r="7" fill="#c8cdd2"/>
      <circle cx="68" cy="20" r="4" fill="#6ab8c8"/>
      <!-- faceplate -->
      <rect x="22" y="12" width="36" height="18" rx="4" fill="#1a2a3a"/>
      <!-- eyes -->
      <circle cx="33" cy="21" r="4" fill="${eyeColor}"/>
      <circle cx="33" cy="21" r="2.5" fill="#fff" opacity="0.3"/>
      <circle cx="47" cy="21" r="4" fill="${eyeColor}"/>
      <circle cx="47" cy="21" r="2.5" fill="#fff" opacity="0.3"/>
      <!-- antennae -->
      <line x1="28" y1="6" x2="22" y2="-4" stroke="#b0b8c0" stroke-width="1.5"/>
      <circle cx="22" cy="-5" r="3" fill="${antennaColor}"/>
      <line x1="52" y1="6" x2="58" y2="-4" stroke="#b0b8c0" stroke-width="1.5"/>
      <circle cx="58" cy="-5" r="3" fill="${antennaColor}"/>
    </svg>`;
    return this._createImage(svg, 80, 80);
  },

  // === Stage 5: Knight ===
  knight(frame) {
    const bob = frame % 2 === 0 ? 0 : 1;
    const swordAngle = frame % 2 === 0 ? -20 : 20;
    const eyeGlow = frame % 2 === 0 ? 0.6 : 0.9;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <!-- shadow -->
      <ellipse cx="40" cy="78" rx="24" ry="4" fill="rgba(0,0,0,0.25)"/>
      <!-- legs -->
      <rect x="20" y="${58+bob}" width="14" height="14" rx="2" fill="#9a9ea4" stroke="#7a7e84" stroke-width="1"/>
      <rect x="18" y="${70+bob}" width="18" height="8" rx="3" fill="#b8bcc2"/>
      <rect x="46" y="${58+bob}" width="14" height="14" rx="2" fill="#8a8e94" stroke="#6a6e74" stroke-width="1"/>
      <rect x="44" y="${70+bob}" width="18" height="8" rx="3" fill="#a8acb2"/>
      <!-- body armor -->
      <path d="M20,28 L60,28 L64,40 L66,56 L58,62 L22,62 L14,56 L16,40 Z" fill="#a0a5ab" stroke="#7a7e84" stroke-width="1.5"/>
      <line x1="40" y1="30" x2="40" y2="58" stroke="#8a8e94" stroke-width="1"/>
      <!-- waist -->
      <rect x="16" y="55" width="48" height="8" rx="1" fill="#7a7e84" stroke="#5a5e64" stroke-width="1"/>
      <!-- shoulder L -->
      <path d="M12,26 L26,24 L28,36 L10,38 Z" fill="#b0b5bb" stroke="#7a7e84" stroke-width="1"/>
      <!-- shoulder R -->
      <path d="M54,24 L68,26 L70,38 L52,36 Z" fill="#b0b5bb" stroke="#7a7e84" stroke-width="1"/>
      <!-- shield arm (left) -->
      <g transform="translate(2,32)">
        <path d="M0,0 L14,0 L16,4 L16,24 L8,32 L0,24 L0,4 Z" fill="#6a6e74" stroke="#4a4e54" stroke-width="1.5"/>
        <path d="M5,6 L9,6 L9,16 L12,16 L7,22 L2,16 L5,16 Z" fill="#c8cdd2" opacity="0.7"/>
      </g>
      <!-- sword arm (right) -->
      <g transform="translate(62,28)">
        <rect x="0" y="0" width="12" height="16" rx="3" fill="#9a9ea4"/>
        <rect x="2" y="14" width="10" height="12" rx="2" fill="#a8acb2"/>
        <!-- sword -->
        <g transform="translate(6,24) rotate(${swordAngle},0,0)">
          <rect x="-4" y="-2" width="8" height="3" rx="1" fill="#c8a84e"/>
          <rect x="-1" y="-2" width="2" height="3" fill="#d4b85a"/>
          <polygon points="-2,1 2,1 1.5,30 -1.5,30" fill="#d0d4d8" stroke="#a0a4a8" stroke-width="0.5"/>
          <line x1="0" y1="3" x2="0" y2="28" stroke="#e8ecf0" stroke-width="0.8" opacity="0.5"/>
          <polygon points="-1.5,30 1.5,30 0,34" fill="#c0c4c8"/>
        </g>
      </g>
      <!-- helmet -->
      <path d="M20,8 L60,8 L64,20 L62,30 L18,30 L16,20 Z" fill="#a8acb2" stroke="#7a7e84" stroke-width="1.5"/>
      <rect x="24" y="16" width="32" height="8" rx="2" fill="#2a2e34"/>
      <line x1="26" y1="20" x2="56" y2="20" stroke="#4a4e54" stroke-width="0.8"/>
      <line x1="40" y1="16" x2="40" y2="24" stroke="#4a4e54" stroke-width="0.8"/>
      <!-- eye glow -->
      <rect x="28" y="18" width="6" height="3" rx="1" fill="#fff" opacity="${eyeGlow}"/>
      <rect x="46" y="18" width="6" height="3" rx="1" fill="#fff" opacity="${eyeGlow}"/>
      <!-- wing ornaments -->
      <path d="M18,10 L12,2 L15,6 L8,-2 L13,4 L4,-4 L15,8 Z" fill="#7a7e84"/>
      <path d="M62,10 L68,2 L65,6 L72,-2 L67,4 L76,-4 L65,8 Z" fill="#7a7e84"/>
      <!-- helmet crest -->
      <rect x="34" y="4" width="12" height="6" rx="2" fill="#b8bcc2" stroke="#8a8e94" stroke-width="0.5"/>
    </svg>`;
    return this._createImage(svg, 80, 80);
  },

  // === Stage 6 Phase 1: Shadow Demon King ===
  shadowKing(frame) {
    const bob = frame % 2 === 0 ? 0 : -1;
    const flicker = frame % 3 === 0 ? 0.75 : 0.85;
    const eyeGlow = frame % 2 === 0 ? 0.9 : 0.6;
    const waveOff = frame % 2 === 0 ? 2 : -2;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" opacity="${flicker}">
      <!-- ground shadow -->
      <ellipse cx="40" cy="78" rx="28" ry="4" fill="rgba(0,0,0,0.3)"/>
      <!-- cape/body silhouette -->
      <path d="M40,10
               C56,10 68,18 70,30
               L${74+waveOff},50
               L${76+waveOff},70
               Q${68+waveOff},80 ${58+waveOff},80
               Q48,80 40,78
               Q32,80 ${22-waveOff},80
               Q${12-waveOff},80 ${4-waveOff},70
               L${6-waveOff},50
               L10,30
               C12,18 24,10 40,10 Z"
            fill="#0a0a0a" stroke="#1a1a1a" stroke-width="1"/>
      <!-- body highlight -->
      <path d="M30,22 L50,22 L54,38 L48,52 L32,52 L26,38 Z" fill="#151515" opacity="0.7"/>
      <!-- shoulder spikes -->
      <polygon points="10,28 2,18 8,30" fill="#0a0a0a" stroke="#222" stroke-width="0.5"/>
      <polygon points="70,28 78,18 72,30" fill="#0a0a0a" stroke="#222" stroke-width="0.5"/>
      <!-- crown silhouette -->
      <path d="M26,12 L30,2 L34,10 L38,-2 L42,10 L46,2 L50,10 L54,-2 L58,12 Z"
            fill="#0a0a0a" stroke="#222" stroke-width="0.8"/>
      <!-- shadow tendrils (arms) -->
      <path d="M10,32 Q${2+waveOff},44 ${4+waveOff},58 Q${2+waveOff},64 ${8},60 Q12,54 14,42 Z" fill="#0a0a0a"/>
      <path d="M70,32 Q${78-waveOff},44 ${76-waveOff},58 Q${78-waveOff},64 ${72},60 Q68,54 66,42 Z" fill="#0a0a0a"/>
      <!-- eyes (white, eerie) -->
      <ellipse cx="32" cy="${26+bob}" rx="4" ry="2.5" fill="#ffffff" opacity="${eyeGlow}"/>
      <ellipse cx="48" cy="${26+bob}" rx="4" ry="2.5" fill="#ffffff" opacity="${eyeGlow}"/>
      <!-- mouth grin -->
      <path d="M30,36 Q40,42 50,36" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.4"/>
      <!-- shadow particles -->
      <circle cx="${20+waveOff}" cy="${50+bob}" r="2" fill="#111" opacity="0.5"/>
      <circle cx="${60-waveOff}" cy="${45+bob}" r="2.5" fill="#111" opacity="0.4"/>
      <circle cx="${35+waveOff}" cy="${65+bob}" r="1.5" fill="#111" opacity="0.6"/>
      <circle cx="${50-waveOff}" cy="${60+bob}" r="2" fill="#111" opacity="0.5"/>
      <!-- foot skulls (shadow ver) -->
      <g opacity="0.25">
        <circle cx="24" cy="74" r="5" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>
        <circle cx="22" cy="73" r="1.2" fill="#000"/><circle cx="26" cy="73" r="1.2" fill="#000"/>
      </g>
      <g opacity="0.25">
        <circle cx="56" cy="74" r="5" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>
        <circle cx="54" cy="73" r="1.2" fill="#000"/><circle cx="58" cy="73" r="1.2" fill="#000"/>
      </g>
    </svg>`;
    return this._createImage(svg, 80, 80);
  },

  // === Stage 6 Phase 2: Demon King (full color) ===
  demonKing(frame) {
    const bob = frame % 2 === 0 ? 0 : -1;
    const eyeGlow = frame % 2 === 0 ? '#ffee00' : '#ffaa00';
    const flameOff = frame % 2 === 0 ? 0 : 2;
    // Orbiting skulls angles
    const baseAngle = (frame % 8) * (Math.PI / 4);
    const skullPositions = [];
    for (let i = 0; i < 5; i++) {
      const a = baseAngle + (i / 5) * Math.PI * 2;
      skullPositions.push({
        x: 40 + Math.cos(a) * 36,
        y: 40 + Math.sin(a) * 16,
        behind: Math.sin(a) > 0.3
      });
    }
    let skullsSvg = '';
    for (const s of skullPositions) {
      const op = s.behind ? 0.35 : 0.9;
      skullsSvg += `
        <g opacity="${op}">
          <ellipse cx="${s.x}" cy="${s.y}" rx="7" ry="3" fill="none" stroke="#e8b830" stroke-width="1.2"/>
          <circle cx="${s.x}" cy="${s.y-1}" r="5" fill="#f0d840" stroke="#c8a820" stroke-width="0.5"/>
          <circle cx="${s.x-2}" cy="${s.y-2}" r="1.3" fill="#2a1005"/>
          <circle cx="${s.x+2}" cy="${s.y-2}" r="1.3" fill="#2a1005"/>
          <line x1="${s.x-2}" y1="${s.y+2}" x2="${s.x+2}" y2="${s.y+2}" stroke="#2a1005" stroke-width="0.7"/>
        </g>`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <!-- shadow -->
      <ellipse cx="40" cy="78" rx="28" ry="4" fill="rgba(0,0,0,0.3)"/>
      <!-- tail -->
      <path d="M34,72 Q22,74 14,70 Q8,66 10,62 Q12,60 16,62 Q20,66 28,68" fill="#cc2020" stroke="#aa1515" stroke-width="1"/>
      <!-- legs -->
      <path d="M26,65 L24,72 L20,78 L28,78 L30,72 L32,66 Z" fill="#cc2020"/>
      <path d="M48,65 L50,72 L54,78 L46,78 L44,72 L42,66 Z" fill="#bb1818"/>
      <!-- body -->
      <path d="M24,30 L56,30 L62,44 L64,60 L60,68 L20,68 L16,60 L18,44 Z"
            fill="#dd2525" stroke="#bb1818" stroke-width="1"/>
      <!-- belly gem belt -->
      <rect x="20" y="56" width="40" height="6" rx="2" fill="#3a2010"/>
      <circle cx="40" cy="59" r="4" fill="#10b8a0"/>
      <circle cx="40" cy="59" r="2" fill="#20e8c0"/>
      <!-- necklace -->
      <path d="M28,34 Q36,38 40,39 Q44,38 52,34" fill="none" stroke="#d4a020" stroke-width="1.5"/>
      <circle cx="36" cy="37" r="2" fill="#e8b830"/>
      <circle cx="40" cy="39" r="2.5" fill="#1098d8"/>
      <circle cx="44" cy="37" r="2" fill="#e8b830"/>
      <!-- shoulders -->
      <path d="M14,28 L28,26 L30,36 L12,38 Z" fill="#1098a8"/>
      <path d="M52,26 L66,28 L68,38 L50,36 Z" fill="#1098a8"/>
      <!-- arm L + flame -->
      <path d="M8,32 L18,30 L20,46 L10,48 Z" fill="#cc2020"/>
      <path d="M6,46 L20,44 L22,56 L8,58 Z" fill="#bb1818"/>
      <ellipse cx="12" cy="${56-flameOff}" rx="4" ry="6" fill="#ffaa00" opacity="0.8"/>
      <ellipse cx="12" cy="${53-flameOff}" rx="2.5" ry="4" fill="#ffdd00" opacity="0.9"/>
      <ellipse cx="12" cy="${51-flameOff}" rx="1.5" ry="2" fill="#fff" opacity="0.6"/>
      <!-- arm R + flame -->
      <path d="M62,30 L72,32 L70,48 L60,46 Z" fill="#cc2020"/>
      <path d="M60,44 L74,46 L72,58 L58,56 Z" fill="#bb1818"/>
      <ellipse cx="68" cy="${56-flameOff}" rx="4" ry="6" fill="#ffaa00" opacity="0.8"/>
      <ellipse cx="68" cy="${53-flameOff}" rx="2.5" ry="4" fill="#ffdd00" opacity="0.9"/>
      <ellipse cx="68" cy="${51-flameOff}" rx="1.5" ry="2" fill="#fff" opacity="0.6"/>
      <!-- head -->
      <path d="M26,12 L54,12 L58,22 L56,32 L24,32 L22,22 Z" fill="#dd2525" stroke="#bb1818" stroke-width="1"/>
      <!-- horns -->
      <path d="M26,14 L22,2 L20,-2 L26,10 Z" fill="#880808"/>
      <path d="M54,14 L58,2 L60,-2 L54,10 Z" fill="#880808"/>
      <!-- crown -->
      <path d="M28,12 L30,4 L34,10 L38,2 L42,10 L46,4 L50,10 L52,4 L54,12 Z"
            fill="#e8b830" stroke="#c89820" stroke-width="0.8"/>
      <circle cx="38" cy="9" r="2" fill="#1098d8"/>
      <circle cx="42" cy="7" r="2" fill="#1098d8"/>
      <circle cx="46" cy="9" r="2" fill="#1098d8"/>
      <!-- feathers on head -->
      <path d="M30,8 L28,2 L32,6 L33,-2 L34,5 L36,0 L35,8" fill="#0a7888"/>
      <!-- eyes -->
      <rect x="30" y="18" width="6" height="5" rx="1" fill="#000"/>
      <ellipse cx="33" cy="20" rx="2.5" ry="2" fill="${eyeGlow}"/>
      <circle cx="33" cy="20" r="1" fill="#000"/>
      <rect x="44" y="18" width="6" height="5" rx="1" fill="#000"/>
      <ellipse cx="47" cy="20" rx="2.5" ry="2" fill="${eyeGlow}"/>
      <circle cx="47" cy="20" r="1" fill="#000"/>
      <!-- mouth -->
      <path d="M32,26 Q40,32 48,26" fill="none" stroke="#000" stroke-width="1.5"/>
      <polygon points="34,27 36,27 35,29" fill="#fff"/>
      <polygon points="39,28 41,28 40,30" fill="#fff"/>
      <polygon points="44,27 46,27 45,29" fill="#fff"/>
      <!-- orbiting skulls -->
      ${skullsSvg}
    </svg>`;
    return this._createImage(svg, 80, 80);
  }
};


const Assets = {
  player: {
    idle: [], run: [], jump: null, fall: null,
    slash: null, charge: [], chargeRelease: null, damage: null
  },
  enemy: { slime: [], bat: [], mechDrone: [], skeleton: [], demonImp: [], skull: [], daruma: [] },
  boss: { golem: [], dragon: [], iceWizard: [], robot: [], knight: [], shadowKing: [], demonKing: [] },
  items: { coin: [], potion: null, powerUp: null },
  projectile: { swordBeam: null, fireball: null, boss: null, ice: null, laser: null, skull: null },
  tiles: {},
  flag: null,

  load() {
    for (let i = 0; i < 4; i++) this.player.idle.push(SpriteGen.playerIdle(i));
    for (let i = 0; i < 4; i++) this.player.run.push(SpriteGen.playerRun(i));
    this.player.jump = SpriteGen.playerJump();
    this.player.fall = SpriteGen.playerFall();
    this.player.slash = SpriteGen.playerSlash();
    for (let i = 0; i < 2; i++) this.player.charge.push(SpriteGen.playerCharge(i));
    this.player.chargeRelease = SpriteGen.playerChargeRelease();
    this.player.damage = SpriteGen.playerDamage();

    for (let i = 0; i < 2; i++) this.enemy.slime.push(SpriteGen.slime(i));
    for (let i = 0; i < 2; i++) this.enemy.bat.push(SpriteGen.bat(i));
    for (let i = 0; i < 2; i++) this.enemy.mechDrone.push(SpriteGen.mechDrone(i));
    for (let i = 0; i < 2; i++) this.enemy.demonImp.push(SpriteGen.demonImp(i));
    // skeleton / skull / daruma は画像から読み込み（loadImageEnemies で非同期）

    for (let i = 0; i < 2; i++) this.boss.golem.push(BossSVG.golem(i));
    for (let i = 0; i < 4; i++) this.boss.dragon.push(BossSVG.dragon(i));
    for (let i = 0; i < 4; i++) this.boss.iceWizard.push(BossSVG.iceWizard(i));
    for (let i = 0; i < 2; i++) this.boss.robot.push(BossSVG.robot(i));
    for (let i = 0; i < 2; i++) this.boss.knight.push(BossSVG.knight(i));
    for (let i = 0; i < 4; i++) this.boss.shadowKing.push(BossSVG.shadowKing(i));
    for (let i = 0; i < 8; i++) this.boss.demonKing.push(BossSVG.demonKing(i));

    for (let i = 0; i < 4; i++) this.items.coin.push(SpriteGen.coin(i));
    this.items.potion = SpriteGen.potion();
    this.items.powerUp = SpriteGen.powerUp();

    this.projectile.swordBeam = SpriteGen.swordBeam();
    this.projectile.fireball = SpriteGen.fireball();
    this.projectile.boss = SpriteGen.bossProjectile();
    this.projectile.ice = SpriteGen.iceProjectile();
    this.projectile.laser = SpriteGen.laserProjectile();
    this.projectile.skull = SpriteGen.skullProjectile();

    this.tiles.grassTop = SpriteGen.grassTop();
    this.tiles.dirt = SpriteGen.dirt();
    this.tiles.platform = SpriteGen.platform();
    this.tiles.spike = SpriteGen.spike();
    this.tiles.iceTop = SpriteGen.iceTop();
    this.tiles.iceBlock = SpriteGen.iceBlock();
    this.tiles.metalTop = SpriteGen.metalTop();
    this.tiles.metalBlock = SpriteGen.metalBlock();
    this.tiles.castleTop = SpriteGen.castleTop();
    this.tiles.castleBlock = SpriteGen.castleBlock();
    this.tiles.darkTop = SpriteGen.darkTop();
    this.tiles.darkBlock = SpriteGen.darkBlock();
    this.tiles.lavaTop = SpriteGen.lavaTop();
    this.tiles.movingPlatform = SpriteGen.movingPlatform();
    this.tiles.crumblePlatform = SpriteGen.crumblePlatform();
    this.tiles.crumblePlatformFading = SpriteGen.crumblePlatformFading();
    this.flag = SpriteGen.flag();
  },

  // 骸骨（5面・6面）・スカル（3面）・だるま（4面）は画像を読み込み、スプライトとして登録（非同期）
  loadImageEnemies(callback) {
    const ENEMY_W = 16, ENEMY_H = 16;
    const DARUMA_W = 28, DARUMA_H = 24;
    const SKULL_W = 30, SKULL_H = 28;
    const skeletonPaths = [
      'images/skeleton.png',
      'images/enemy-skeleton.svg',
      'images/Retro_pixel_art_enemy_character_sprites_for_16-bit-1770717295936.png'
    ];
    const skullPaths = [
      'images/skull.png',
      'images/enemy-skull.svg',
      'images/A_sideways_skull_enemy_sprite_in_minimalist_graphi-1770785361316.png'
    ];
    const darumaPaths = [
      'images/daruma.png',
      'images/enemy-daruma.svg',
      'images/A_pixel_art_daruma_doll_enemy_character_for_a_16-b-1770784473320.png'
    ];

    function toCanvas(img, w, h) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, img.naturalWidth || img.width, img.naturalHeight || img.height, 0, 0, w, h);
      return c;
    }

    let done = 0;
    function onImageLoaded() {
      done++;
      if (done >= 3 && typeof callback === 'function') callback();
    }

    function loadSkeleton(index) {
      if (index >= skeletonPaths.length) {
        Assets.enemy.skeleton.push(SpriteGen.skeleton(0));
        Assets.enemy.skeleton.push(SpriteGen.skeleton(1));
        onImageLoaded();
        return;
      }
      const img = new Image();
      img.onload = function() {
        const canvas = toCanvas(img, ENEMY_W, ENEMY_H);
        Assets.enemy.skeleton.push(canvas);
        Assets.enemy.skeleton.push(canvas);
        onImageLoaded();
      };
      img.onerror = function() { loadSkeleton(index + 1); };
      img.src = skeletonPaths[index];
    }
    loadSkeleton(0);

    function loadSkull(index) {
      if (index >= skullPaths.length) {
        const fallback = createSkullFallbackSprite();
        Assets.enemy.skull.push(fallback);
        Assets.enemy.skull.push(fallback);
        onImageLoaded();
        return;
      }
      const img = new Image();
      img.onload = function() {
        const canvas = toCanvas(img, SKULL_W, SKULL_H);
        Assets.enemy.skull.push(canvas);
        Assets.enemy.skull.push(canvas);
        onImageLoaded();
      };
      img.onerror = function() { loadSkull(index + 1); };
      img.src = skullPaths[index];
    }
    loadSkull(0);

    function loadDaruma(index) {
      if (index >= darumaPaths.length) {
        const fallback = createDarumaFallbackSprite();
        Assets.enemy.daruma.push(fallback);
        Assets.enemy.daruma.push(fallback);
        onImageLoaded();
        return;
      }
      const img = new Image();
      img.onload = function() {
        const canvas = toCanvas(img, DARUMA_W, DARUMA_H);
        Assets.enemy.daruma.push(canvas);
        Assets.enemy.daruma.push(canvas);
        onImageLoaded();
      };
      img.onerror = function() { loadDaruma(index + 1); };
      img.src = darumaPaths[index];
    }
    loadDaruma(0);
  }
};

// だるま用フォールバックスプライト（28x24px）画像読み込み失敗時に使用
function createDarumaFallbackSprite() {
  const w = 28, h = 24;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const red = '#b71c1c';
  const darkRed = '#7f0000';
  const face = '#ffebee';
  const gold = '#ffd700';
  const black = '#000000';

  for (let i = 0; i < 2; i++) {
    const ox = i * w;
    const oy = (i === 1) ? 2 : 0;

    ctx.fillStyle = red;
    ctx.fillRect(ox + 4, oy + 0, 20, 24);
    ctx.fillRect(ox + 2, oy + 2, 24, 20);
    ctx.fillRect(ox + 0, oy + 4, 28, 16);

    ctx.fillStyle = darkRed;
    ctx.fillRect(ox + 2, oy + 20, 24, 2);
    ctx.fillRect(ox + 4, oy + 22, 20, 2);

    ctx.fillStyle = face;
    ctx.fillRect(ox + 6, oy + 4, 16, 11);
    ctx.fillStyle = red;
    ctx.fillRect(ox + 6, oy + 4, 1, 1);
    ctx.fillRect(ox + 21, oy + 4, 1, 1);
    ctx.fillRect(ox + 6, oy + 14, 1, 1);
    ctx.fillRect(ox + 21, oy + 14, 1, 1);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ox + 8, oy + 7, 4, 4);
    ctx.fillRect(ox + 16, oy + 7, 4, 4);
    ctx.fillStyle = black;
    ctx.fillRect(ox + 10, oy + 9, 1, 1);
    ctx.fillRect(ox + 18, oy + 9, 1, 1);
    ctx.fillRect(ox + 10, oy + 12, 8, 1);

    ctx.fillStyle = gold;
    ctx.fillRect(ox + 8, oy + 17, 3, 3);
    ctx.fillStyle = red; ctx.fillRect(ox + 9, oy + 18, 1, 1); ctx.fillStyle = gold;
    ctx.fillRect(ox + 13, oy + 17, 5, 1);
    ctx.fillRect(ox + 13, oy + 17, 1, 3);
    ctx.fillRect(ox + 17, oy + 17, 1, 3);
    ctx.fillRect(ox + 13, oy + 19, 5, 1);
    ctx.fillRect(ox + 4, oy + 17, 1, 4);
    ctx.fillRect(ox + 23, oy + 17, 1, 4);
  }
  return canvas;
}

// スカル用フォールバックスプライト（30x28px、2コマ: 口閉じ・口開け）画像読み込み失敗時に使用
function createSkullFallbackSprite() {
  const w = 30, h = 28;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const white = '#f0f0f0';
  const black = '#111111';

  for (let i = 0; i < 2; i++) {
    const ox = i * w;

    ctx.fillStyle = black;
    ctx.fillRect(ox + 2, 0, 24, 26);
    ctx.fillRect(ox + 0, 4, 28, 16);

    ctx.fillStyle = white;
    ctx.fillRect(ox + 4, 2, 20, 18);
    ctx.fillRect(ox + 2, 6, 24, 12);

    ctx.fillStyle = black;
    ctx.fillRect(ox + 5, 8, 8, 8);
    ctx.fillRect(ox + 16, 8, 8, 8);
    ctx.fillRect(ox + 13, 18, 4, 4);

    if (i === 0) {
      ctx.fillStyle = white;
      ctx.fillRect(ox + 6, 20, 18, 6);
      ctx.fillStyle = black;
      ctx.fillRect(ox + 8, 20, 1, 3);
      ctx.fillRect(ox + 11, 20, 1, 3);
      ctx.fillRect(ox + 14, 20, 1, 3);
      ctx.fillRect(ox + 17, 20, 1, 3);
      ctx.fillRect(ox + 20, 20, 1, 3);
      ctx.fillRect(ox + 6, 26, 18, 2);
    } else {
      ctx.fillStyle = white;
      ctx.fillRect(ox + 6, 22, 18, 6);
      ctx.fillStyle = black;
      ctx.fillRect(ox + 6, 20, 18, 2);
      ctx.fillRect(ox + 6, 28, 18, 2);
    }

    ctx.fillStyle = black;
    ctx.fillRect(ox + 22, 6, 2, 6);
    ctx.fillRect(ox + 24, 10, 4, 2);
  }
  return canvas;
}
