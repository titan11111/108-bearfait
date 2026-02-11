// ============================================================
//  levels.js — ステージデータ（1〜6）
//  役割: レベル定義のみ。config の TILE には依存しない。
//  main.js の loadLevel が参照する。読み込み順: config → sprites → levels → input-world → ...
// ============================================================

// ============================================================
//  Levels (1-6)
// ============================================================
const Levels = [

  // ======== Stage 1: Grass / STONE GOLEM ========
  {
    width: 140, height: 25, theme: 'grass',
    bossType: 'golem', bossName: 'STONE GOLEM',
    playerStart: { x: 2, y: 20 },
    goalPos: { x: 135, y: 18 },
    bossPos: { x: 130, y: 16 },
    bossFloorY: 20,
    tiles: [],
    enemies: [
      { type: 'slime', x: 18, y: 21, patrolRange: 3 },
      { type: 'slime', x: 28, y: 21, patrolRange: 4 },
      { type: 'bat',   x: 35, y: 15, patrolRange: 4 },
      { type: 'slime', x: 45, y: 21, patrolRange: 3 },
      { type: 'bat',   x: 52, y: 13, patrolRange: 5 },
      { type: 'slime', x: 62, y: 17, patrolRange: 2 },
      { type: 'bat',   x: 70, y: 14, patrolRange: 3 },
      { type: 'slime', x: 78, y: 21, patrolRange: 3 },
      { type: 'bat',   x: 85, y: 12, patrolRange: 5 },
      { type: 'slime', x: 95, y: 21, patrolRange: 4 },
      { type: 'bat',   x: 102, y: 14, patrolRange: 3 }
    ],
    coins: [
      {x:8,y:20},{x:10,y:20},{x:14,y:20},{x:22,y:18},{x:24,y:17},{x:26,y:16},
      {x:38,y:15},{x:40,y:14},{x:42,y:14},{x:55,y:20},{x:57,y:19},{x:59,y:18},
      {x:68,y:13},{x:70,y:13},{x:72,y:13},{x:82,y:19},{x:84,y:18},{x:86,y:17},
      {x:98,y:14},{x:100,y:13},{x:108,y:20},{x:110,y:19}
    ],
    potions: [{ x: 48, y: 19 }],
    powerUps: [{ x: 90, y: 13 }],
    movingPlatforms: [
      { x: 32, y: 16, rangeX: 3, rangeY: 0, speed: 35 },
      { x: 74, y: 15, rangeX: 0, rangeY: 3, speed: 30 }
    ],
    crumblePlatforms: [{ x: 64, y: 17 }, { x: 66, y: 17 }, { x: 68, y: 17 }],
    generate() {
      const t = [];
      for (let x = 0; x < this.width; x++) {
        t.push({ x, y: 22, type: 'grass' });
        t.push({ x, y: 23, type: 'dirt' });
        t.push({ x, y: 24, type: 'dirt' });
      }
      for (let x = 48; x < 52; x++) { const i = t.findIndex(ti => ti.x === x && ti.y === 22); if (i !== -1) t.splice(i, 1); }
      for (let x = 58; x < 61; x++) { const i = t.findIndex(ti => ti.x === x && ti.y === 22); if (i !== -1) t[i].type = 'spike'; }
      for (let x = 20; x < 28; x++) t.push({ x, y: 17, type: 'platform' });
      for (let x = 36; x < 44; x++) t.push({ x, y: 15, type: 'platform' });
      for (let x = 53; x < 58; x++) t.push({ x, y: 18, type: 'grass' });
      for (let x = 80; x < 88; x++) t.push({ x, y: 18, type: 'platform' });
      for (let x = 96; x < 102; x++) t.push({ x, y: 15, type: 'platform' });
      for (let x = 106; x < 112; x++) t.push({ x, y: 20, type: 'grass' });
      for (let x = 118; x < 120; x++) for (let y = 19; y < 22; y++) t.push({ x, y, type: 'dirt' });
      for (let x = 120; x < 140; x++) { t.push({ x, y: 20, type: 'grass' }); t.push({ x, y: 21, type: 'dirt' }); }
      this.tiles = t;
    }
  },

  // ======== Stage 2: Grass / RED DRAGON ========
  {
    width: 170, height: 25, theme: 'grass',
    bossType: 'dragon', bossName: 'RED DRAGON',
    playerStart: { x: 2, y: 20 },
    goalPos: { x: 165, y: 12 },
    bossPos: { x: 156, y: 10 },
    bossFloorY: 14,
    tiles: [],
    enemies: [
      { type: 'slime', x: 15, y: 21, patrolRange: 3 },
      { type: 'bat',   x: 25, y: 14, patrolRange: 5 },
      { type: 'slime', x: 35, y: 21, patrolRange: 4 },
      { type: 'bat',   x: 45, y: 12, patrolRange: 4 },
      { type: 'slime', x: 55, y: 17, patrolRange: 2 },
      { type: 'bat',   x: 65, y: 10, patrolRange: 6 },
      { type: 'slime', x: 75, y: 21, patrolRange: 3 },
      { type: 'bat',   x: 85, y: 13, patrolRange: 5 },
      { type: 'slime', x: 95, y: 15, patrolRange: 3 },
      { type: 'bat',   x: 105, y: 11, patrolRange: 4 },
      { type: 'slime', x: 115, y: 21, patrolRange: 4 },
      { type: 'slime', x: 125, y: 17, patrolRange: 3 }
    ],
    coins: [
      {x:8,y:20},{x:10,y:20},{x:12,y:19},{x:20,y:15},{x:22,y:14},{x:24,y:13},
      {x:40,y:19},{x:42,y:18},{x:44,y:17},{x:58,y:16},{x:60,y:15},{x:62,y:14},
      {x:80,y:20},{x:82,y:19},{x:84,y:18},{x:100,y:14},{x:102,y:13},{x:104,y:12},
      {x:120,y:18},{x:122,y:17},{x:124,y:16},{x:130,y:20},{x:132,y:19}
    ],
    potions: [{ x: 50, y: 19 }, { x: 110, y: 14 }],
    powerUps: [{ x: 70, y: 12 }],
    movingPlatforms: [
      { x: 30, y: 17, rangeX: 4, rangeY: 0, speed: 30 },
      { x: 68, y: 14, rangeX: 0, rangeY: 4, speed: 35 },
      { x: 88, y: 15, rangeX: 3, rangeY: 2, speed: 25 }
    ],
    crumblePlatforms: [{ x: 46, y: 16 }, { x: 48, y: 16 }, { x: 50, y: 16 }, { x: 96, y: 14 }, { x: 98, y: 14 }],
    generate() {
      const t = [];
      for (let x = 0; x < this.width; x++) {
        if ((x >= 32 && x < 35) || (x >= 72 && x < 76) || (x >= 112 && x < 116))
          t.push({ x, y: 22, type: 'spike' });
        else t.push({ x, y: 22, type: 'grass' });
        t.push({ x, y: 23, type: 'dirt' });
        t.push({ x, y: 24, type: 'dirt' });
      }
      for (let x = 18; x < 26; x++) t.push({ x, y: 15, type: 'platform' });
      for (let x = 38; x < 44; x++) t.push({ x, y: 18, type: 'platform' });
      for (let x = 53; x < 58; x++) t.push({ x, y: 18, type: 'grass' });
      for (let x = 56; x < 64; x++) t.push({ x, y: 14, type: 'platform' });
      for (let x = 90; x < 98; x++) t.push({ x, y: 16, type: 'grass' });
      for (let x = 100; x < 106; x++) t.push({ x, y: 13, type: 'platform' });
      for (let x = 120; x < 128; x++) t.push({ x, y: 18, type: 'grass' });
      for (let x = 130; x < 133; x++) { t.push({ x, y: 20, type: 'grass' }); t.push({ x, y: 21, type: 'dirt' }); }
      for (let x = 133; x < 136; x++) { t.push({ x, y: 18, type: 'grass' }); for (let y = 19; y < 22; y++) t.push({ x, y, type: 'dirt' }); }
      for (let x = 136; x < 139; x++) { t.push({ x, y: 16, type: 'grass' }); for (let y = 17; y < 22; y++) t.push({ x, y, type: 'dirt' }); }
      for (let x = 139; x < 170; x++) { t.push({ x, y: 14, type: 'grass' }); for (let y = 15; y < 22; y++) t.push({ x, y, type: 'dirt' }); }
      for (let x = 146; x < 150; x++) t.push({ x, y: 10, type: 'platform' });
      for (let x = 156; x < 160; x++) t.push({ x, y: 10, type: 'platform' });
      this.tiles = t;
    }
  },

  // ======== Stage 3: Ice / ICE WIZARD（スカルメイン・氷の雰囲気） ========
  {
    width: 180, height: 25, theme: 'ice',
    bossType: 'iceWizard', bossName: 'ICE WIZARD',
    playerStart: { x: 2, y: 20 },
    goalPos: { x: 175, y: 12 },
    bossPos: { x: 168, y: 10 },
    bossFloorY: 16,
    tiles: [],
    enemies: [
      { type: 'skull', x: 14, y: 14, patrolRange: 4 },
      { type: 'skull', x: 22, y: 14, patrolRange: 4 },
      { type: 'slime', x: 30, y: 21, patrolRange: 3 },
      { type: 'skull', x: 38, y: 12, patrolRange: 5 },
      { type: 'skull', x: 48, y: 10, patrolRange: 4 },
      { type: 'skull', x: 56, y: 10, patrolRange: 4 },
      { type: 'bat',   x: 65, y: 11, patrolRange: 4 },
      { type: 'skull', x: 75, y: 13, patrolRange: 5 },
      { type: 'skull', x: 85, y: 17, patrolRange: 3 },
      { type: 'bat',   x: 92, y: 11, patrolRange: 4 },
      { type: 'skull', x: 102, y: 21, patrolRange: 4 },
      { type: 'skull', x: 112, y: 12, patrolRange: 5 },
      { type: 'slime', x: 120, y: 15, patrolRange: 3 },
      { type: 'skull', x: 130, y: 10, patrolRange: 4 }
    ],
    coins: [
      {x:8,y:20},{x:10,y:20},{x:12,y:19},{x:20,y:14},{x:22,y:13},{x:24,y:14},
      {x:34,y:18},{x:36,y:17},{x:38,y:16},{x:52,y:16},{x:54,y:15},{x:56,y:14},
      {x:60,y:20},{x:62,y:20},{x:64,y:19},{x:72,y:13},{x:74,y:12},{x:76,y:13},
      {x:88,y:16},{x:90,y:15},{x:92,y:14},{x:106,y:19},{x:108,y:18},{x:110,y:17},
      {x:118,y:14},{x:120,y:13},{x:122,y:12},{x:134,y:11},{x:136,y:10}
    ],
    potions: [{ x: 42, y: 19 }, { x: 96, y: 16 }, { x: 126, y: 14 }],
    powerUps: [{ x: 80, y: 12 }],
    movingPlatforms: [
      { x: 26, y: 16, rangeX: 3, rangeY: 0, speed: 30 },
      { x: 44, y: 14, rangeX: 0, rangeY: 3, speed: 35 },
      { x: 68, y: 14, rangeX: 4, rangeY: 0, speed: 28 },
      { x: 100, y: 15, rangeX: 0, rangeY: 4, speed: 32 },
      { x: 128, y: 13, rangeX: 3, rangeY: 2, speed: 30 }
    ],
    crumblePlatforms: [
      {x:32,y:17},{x:34,y:17},{x:58,y:15},{x:60,y:15},{x:62,y:15},
      {x:86,y:16},{x:88,y:16},{x:114,y:14},{x:116,y:14},{x:118,y:14}
    ],
    generate() {
      const t = []; const top = 'iceTop'; const blk = 'iceBlock';
      for (let x = 0; x < this.width; x++) {
        if ((x >= 40 && x < 43) || (x >= 78 && x < 82) || (x >= 108 && x < 111)) { /* gap */ }
        else if ((x >= 50 && x < 53) || (x >= 95 && x < 98)) {
          t.push({ x, y: 22, type: 'spike' }); t.push({ x, y: 23, type: blk }); t.push({ x, y: 24, type: blk });
        } else {
          t.push({ x, y: 22, type: top }); t.push({ x, y: 23, type: blk }); t.push({ x, y: 24, type: blk });
        }
      }
      for (let x = 18; x < 24; x++) t.push({ x, y: 15, type: 'platform' });
      for (let x = 36; x < 40; x++) t.push({ x, y: 18, type: 'platform' });
      for (let x = 46; x < 50; x++) t.push({ x, y: 18, type: top });
      for (let x = 52; x < 56; x++) t.push({ x, y: 14, type: 'platform' });
      for (let x = 70; x < 78; x++) t.push({ x, y: 14, type: 'platform' });
      for (let x = 82; x < 86; x++) t.push({ x, y: 18, type: top });
      for (let x = 86; x < 92; x++) t.push({ x, y: 17, type: 'platform' });
      for (let x = 104; x < 108; x++) t.push({ x, y: 18, type: top });
      for (let x = 111; x < 116; x++) t.push({ x, y: 18, type: top });
      for (let x = 116; x < 124; x++) t.push({ x, y: 15, type: 'platform' });
      for (let x = 132; x < 138; x++) t.push({ x, y: 12, type: 'platform' });
      for (let x = 136; x < 139; x++) { t.push({ x, y: 20, type: top }); for (let y = 21; y < 23; y++) t.push({ x, y, type: blk }); }
      for (let x = 139; x < 142; x++) { t.push({ x, y: 18, type: top }); for (let y = 19; y < 23; y++) t.push({ x, y, type: blk }); }
      for (let x = 142; x < 145; x++) { t.push({ x, y: 16, type: top }); for (let y = 17; y < 23; y++) t.push({ x, y, type: blk }); }
      for (let x = 145; x < 180; x++) { t.push({ x, y: 14, type: 'grass' }); for (let y = 15; y < 23; y++) t.push({ x, y, type: 'dirt' }); }
      for (let x = 148; x < 152; x++) t.push({ x, y: 10, type: 'platform' });
      for (let x = 158; x < 162; x++) t.push({ x, y: 10, type: 'platform' });
      this.tiles = t;
    }
  },

  // ======== Stage 4: Metal Factory / MECH GUARDIAN（ダルマサブ敵） ========
  {
    width: 190, height: 25, theme: 'metal',
    bossType: 'robot', bossName: 'MECH GUARDIAN',
    playerStart: { x: 2, y: 20 },
    goalPos: { x: 185, y: 16 },
    bossPos: { x: 176, y: 14 },
    bossFloorY: 18,
    tiles: [],
    enemies: [
      { type: 'daruma', x: 16, y: 21, patrolRange: 3 },
      { type: 'bat',    x: 24, y: 14, patrolRange: 4 },
      { type: 'daruma', x: 34, y: 21, patrolRange: 4 },
      { type: 'bat',    x: 40, y: 13, patrolRange: 4 },
      { type: 'bat',    x: 44, y: 11, patrolRange: 5 },
      { type: 'daruma', x: 50, y: 20, patrolRange: 3 },
      { type: 'mechDrone', x: 56, y: 12, patrolRange: 4 },
      { type: 'mechDrone', x: 64, y: 12, patrolRange: 4 },
      { type: 'bat',    x: 70, y: 15, patrolRange: 4 },
      { type: 'daruma', x: 76, y: 21, patrolRange: 3 },
      { type: 'mechDrone', x: 82, y: 14, patrolRange: 3 },
      { type: 'bat',    x: 86, y: 13, patrolRange: 5 },
      { type: 'daruma', x: 92, y: 18, patrolRange: 3 },
      { type: 'mechDrone', x: 96, y: 14, patrolRange: 3 },
      { type: 'bat',    x: 106, y: 10, patrolRange: 5 },
      { type: 'mechDrone', x: 112, y: 13, patrolRange: 4 },
      { type: 'daruma', x: 118, y: 21, patrolRange: 4 },
      { type: 'bat',    x: 124, y: 11, patrolRange: 4 },
      { type: 'bat',    x: 128, y: 12, patrolRange: 4 },
      { type: 'daruma', x: 134, y: 19, patrolRange: 3 },
      { type: 'daruma', x: 140, y: 17, patrolRange: 3 },
      { type: 'bat',    x: 150, y: 11, patrolRange: 5 }
    ],
    coins: [
      {x:8,y:20},{x:10,y:20},{x:12,y:19},{x:20,y:15},{x:22,y:14},{x:28,y:13},
      {x:38,y:19},{x:40,y:18},{x:42,y:17},{x:50,y:16},{x:52,y:15},{x:60,y:13},
      {x:62,y:12},{x:70,y:20},{x:72,y:19},{x:80,y:14},{x:82,y:13},{x:90,y:15},
      {x:92,y:14},{x:100,y:13},{x:102,y:12},{x:112,y:20},{x:114,y:19},{x:124,y:14},
      {x:126,y:13},{x:134,y:18},{x:136,y:17},{x:146,y:12},{x:148,y:11}
    ],
    potions: [{ x: 46, y: 19 }, { x: 108, y: 15 }, { x: 142, y: 16 }],
    powerUps: [{ x: 88, y: 12 }, { x: 156, y: 13 }],
    movingPlatforms: [
      { x: 30, y: 17, rangeX: 4, rangeY: 0, speed: 35 },
      { x: 58, y: 14, rangeX: 0, rangeY: 4, speed: 30 },
      { x: 84, y: 14, rangeX: 3, rangeY: 2, speed: 32 },
      { x: 110, y: 16, rangeX: 0, rangeY: 3, speed: 28 },
      { x: 132, y: 13, rangeX: 4, rangeY: 0, speed: 35 }
    ],
    crumblePlatforms: [
      {x:36,y:17},{x:38,y:17},{x:66,y:15},{x:68,y:15},{x:70,y:15},
      {x:94,y:14},{x:96,y:14},{x:120,y:16},{x:122,y:16}
    ],
    generate() {
      const t = []; const top = 'metalTop'; const blk = 'metalBlock';
      for (let x = 0; x < this.width; x++) {
        if ((x >= 42 && x < 46) || (x >= 74 && x < 78) || (x >= 114 && x < 118)) { /* gaps */ }
        else if ((x >= 54 && x < 57) || (x >= 98 && x < 101) || (x >= 136 && x < 139)) {
          t.push({ x, y: 22, type: 'spike' }); t.push({ x, y: 23, type: blk }); t.push({ x, y: 24, type: blk });
        } else {
          t.push({ x, y: 22, type: top }); t.push({ x, y: 23, type: blk }); t.push({ x, y: 24, type: blk });
        }
      }
      for (let x = 18; x < 26; x++) t.push({ x, y: 15, type: 'platform' });
      for (let x = 34; x < 42; x++) t.push({ x, y: 18, type: 'platform' });
      for (let x = 48; x < 54; x++) t.push({ x, y: 18, type: top });
      for (let x = 58; x < 64; x++) t.push({ x, y: 14, type: 'platform' });
      for (let x = 78; x < 84; x++) t.push({ x, y: 16, type: 'platform' });
      for (let x = 88; x < 94; x++) t.push({ x, y: 15, type: 'platform' });
      for (let x = 102; x < 108; x++) t.push({ x, y: 13, type: 'platform' });
      for (let x = 124; x < 132; x++) t.push({ x, y: 15, type: 'platform' });
      for (let x = 140; x < 148; x++) t.push({ x, y: 13, type: 'platform' });
      // boss arena ramp
      for (let x = 150; x < 154; x++) { t.push({ x, y: 20, type: top }); for (let y = 21; y < 23; y++) t.push({ x, y, type: blk }); }
      for (let x = 154; x < 158; x++) { t.push({ x, y: 18, type: top }); for (let y = 19; y < 23; y++) t.push({ x, y, type: blk }); }
      for (let x = 158; x < 190; x++) { t.push({ x, y: 18, type: top }); for (let y = 19; y < 23; y++) t.push({ x, y, type: blk }); }
      for (let x = 166; x < 170; x++) t.push({ x, y: 14, type: 'platform' });
      for (let x = 176; x < 180; x++) t.push({ x, y: 14, type: 'platform' });
      this.tiles = t;
    }
  },

  // ======== Stage 5: Castle / DARK KNIGHT ========
  {
    width: 200, height: 25, theme: 'castle',
    bossType: 'knight', bossName: 'DARK KNIGHT',
    playerStart: { x: 2, y: 20 },
    goalPos: { x: 195, y: 14 },
    bossPos: { x: 186, y: 12 },
    bossFloorY: 16,
    tiles: [],
    enemies: [
      { type: 'skeleton', x: 14, y: 21, patrolRange: 3 },
      { type: 'bat',      x: 24, y: 13, patrolRange: 4 },
      { type: 'skull',    x: 20, y: 14, patrolRange: 4 },
      { type: 'skeleton', x: 36, y: 21, patrolRange: 4 },
      { type: 'bat',      x: 46, y: 11, patrolRange: 5 },
      { type: 'skull',    x: 42, y: 12, patrolRange: 5 },
      { type: 'skeleton', x: 56, y: 17, patrolRange: 3 },
      { type: 'bat',      x: 66, y: 10, patrolRange: 5 },
      { type: 'skull',    x: 62, y: 10, patrolRange: 4 },
      { type: 'skeleton', x: 78, y: 21, patrolRange: 3 },
      { type: 'bat',      x: 88, y: 12, patrolRange: 5 },
      { type: 'skull',    x: 84, y: 13, patrolRange: 4 },
      { type: 'skeleton', x: 100, y: 15, patrolRange: 3 },
      { type: 'bat',      x: 110, y: 10, patrolRange: 5 },
      { type: 'skull',    x: 106, y: 11, patrolRange: 5 },
      { type: 'skeleton', x: 122, y: 21, patrolRange: 4 },
      { type: 'bat',      x: 132, y: 11, patrolRange: 4 },
      { type: 'skull',    x: 128, y: 12, patrolRange: 4 },
      { type: 'skeleton', x: 142, y: 17, patrolRange: 3 },
      { type: 'bat',      x: 152, y: 10, patrolRange: 5 },
      { type: 'skull',    x: 148, y: 10, patrolRange: 4 },
      { type: 'skeleton', x: 162, y: 21, patrolRange: 3 },
      { type: 'bat',      x: 172, y: 11, patrolRange: 4 },
      { type: 'skull',    x: 168, y: 13, patrolRange: 3 }
    ],
    coins: [
      {x:8,y:20},{x:10,y:20},{x:18,y:15},{x:20,y:14},{x:22,y:13},
      {x:32,y:19},{x:34,y:18},{x:40,y:17},{x:42,y:16},{x:50,y:14},
      {x:52,y:13},{x:60,y:12},{x:62,y:11},{x:72,y:20},{x:74,y:19},
      {x:82,y:14},{x:84,y:13},{x:92,y:15},{x:94,y:14},{x:104,y:13},
      {x:106,y:12},{x:116,y:20},{x:118,y:19},{x:126,y:14},{x:128,y:13},
      {x:136,y:18},{x:138,y:17},{x:148,y:12},{x:150,y:11},{x:158,y:20},
      {x:160,y:19}
    ],
    potions: [{ x: 44, y: 18 }, { x: 96, y: 14 }, { x: 140, y: 16 }, { x: 170, y: 15 }],
