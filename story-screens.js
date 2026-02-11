// ============================================================
//  story-screens.js
//  タイトル・プロローグ・エンディング描画
//  ※ 後で分離可能な独立モジュール
//  ※ グローバル: canvas, ctx, BASE_W, BASE_H, Game, Input, Assets を参照
// ============================================================

const StoryScreens = (() => {

  // =========================================
  //  共通ユーティリティ
  // =========================================
  let _timer = 0;
  let _page = 0;
  let _callback = null;
  let _fadeAlpha = 1;    // フェード用
  let _fadeDir = 0;      // -1:フェードイン, 1:フェードアウト, 0:なし
  const FADE_SPEED = 1.5;

  function _resetFade() { _fadeAlpha = 1; _fadeDir = -1; }

  function _updateFade(dt) {
    if (_fadeDir === 0) return;
    _fadeAlpha += _fadeDir * FADE_SPEED * dt;
    if (_fadeAlpha <= 0) { _fadeAlpha = 0; _fadeDir = 0; }
    if (_fadeAlpha >= 1) { _fadeAlpha = 1; _fadeDir = 0; }
  }

  function _drawFadeOverlay() {
    if (_fadeAlpha > 0.01) {
      ctx.globalAlpha = _fadeAlpha;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, BASE_W, BASE_H);
      ctx.globalAlpha = 1;
    }
  }

  // 星空背景（共通）
  const _stars = [];
  function _initStars() {
    _stars.length = 0;
    for (let i = 0; i < 80; i++) {
      _stars.push({
        x: Math.random() * BASE_W,
        y: Math.random() * BASE_H * 0.65,
        size: Math.random() * 1.8 + 0.4,
        speed: Math.random() * 0.3 + 0.1,
        brightness: Math.random() * 0.5 + 0.5
      });
    }
  }

  function _drawStarSky(time, gradColors) {
    // グラデーション背景
    const grd = ctx.createLinearGradient(0, 0, 0, BASE_H);
    grd.addColorStop(0, gradColors[0]);
    grd.addColorStop(0.5, gradColors[1]);
    grd.addColorStop(1, gradColors[2]);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    // 星
    for (const s of _stars) {
      ctx.globalAlpha = s.brightness * (0.5 + Math.sin(time * 0.003 + s.x * 0.1) * 0.4);
      ctx.fillStyle = '#fff';
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }
    ctx.globalAlpha = 1;
  }

  // 山のシルエット
  function _drawMountains(color, yBase) {
    ctx.fillStyle = color;
    const peaks = [
      { x: 0, w: 120, h: 70 },
      { x: 100, w: 90, h: 50 },
      { x: 200, w: 140, h: 85 },
      { x: 340, w: 100, h: 55 },
      { x: 420, w: 130, h: 75 },
      { x: 530, w: 110, h: 60 }
    ];
    for (const p of peaks) {
      ctx.beginPath();
      ctx.moveTo(p.x, yBase);
      ctx.lineTo(p.x + p.w / 2, yBase - p.h);
      ctx.lineTo(p.x + p.w, yBase);
      ctx.fill();
    }
  }

  // 木のシルエット
  function _drawTrees(color, trunkColor, yBase, count) {
    for (let i = 0; i < count; i++) {
      const tx = (i / count) * BASE_W + Math.sin(i * 7.3) * 20;
      const th = 20 + Math.sin(i * 4.1) * 12;
      ctx.fillStyle = trunkColor;
      ctx.fillRect(tx + 3, yBase - th + 10, 4, th - 10);
      ctx.fillStyle = color;
      ctx.fillRect(tx - 2, yBase - th, 14, 15);
      ctx.fillRect(tx, yBase - th - 5, 10, 8);
    }
  }

  // 地面
  function _drawGround(topColor, bodyColor, y) {
    ctx.fillStyle = topColor;
    ctx.fillRect(0, y, BASE_W, 6);
    ctx.fillStyle = bodyColor;
    ctx.fillRect(0, y + 6, BASE_W, BASE_H - y - 6);
  }

  // テキスト描画（中央揃え、影付き）
  function _drawText(text, x, y, font, color, align) {
    ctx.font = font;
    ctx.textAlign = align || 'center';
    ctx.fillStyle = '#000';
    ctx.fillText(text, x + 1, y + 1);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.textAlign = 'left'; // リセット
  }

  // 点滅テキスト
  function _drawBlinkText(text, x, y, font, color, time) {
    if (Math.sin(time * 0.005) > -0.3) {
      _drawText(text, x, y, font, color, 'center');
    }
  }

  // コマ送り案内テキスト（モバイル時はAボタン・タップを明示）
  function _getAdvanceHint() {
    return (window.MOBILE || ('ontouchstart' in window))
      ? '▶ タップ or Aボタンで次へ'
      : '▶ CLICK / SPACE';
  }

  // ピクセルキャラ描画（簡易ヒーロー）16x16 拡大
  function _drawHeroLarge(cx, cy, scale, facingRight, swordUp) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    if (!facingRight) ctx.scale(-1, 1);
    // 足
    ctx.fillStyle = '#553300';
    ctx.fillRect(-5, 5, 4, 3); ctx.fillRect(1, 5, 4, 3);
    // 体
    ctx.fillStyle = '#2266cc';
    ctx.fillRect(-4, -1, 8, 6);
    // 頭
    ctx.fillStyle = '#ffcc88';
    ctx.fillRect(-3, -6, 6, 5);
    // 目
    ctx.fillStyle = '#000';
    ctx.fillRect(-1, -4, 1, 1); ctx.fillRect(2, -4, 1, 1);
    // 髪
    ctx.fillStyle = '#884400';
    ctx.fillRect(-3, -7, 6, 2); ctx.fillRect(-4, -6, 1, 2);
    // マント
    ctx.fillStyle = '#cc2222';
    ctx.fillRect(-5, 0, 1, 5); ctx.fillRect(-6, 2, 1, 3);
    // 剣
    ctx.fillStyle = '#ccaa44';
    if (swordUp) {
      ctx.fillRect(5, -8, 1, 2);
      ctx.fillStyle = '#dddddd';
      ctx.fillRect(5, -12, 1, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(5, -14, 1, 3);
    } else {
      ctx.fillRect(4, 0, 2, 1);
      ctx.fillStyle = '#dddddd';
      ctx.fillRect(5, 1, 1, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(5, 2, 1, 3);
    }
    ctx.restore();
  }

  // 城のシルエット
  function _drawCastle(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#1a1020';
    // 本体
    ctx.fillRect(-30, -40, 60, 40);
    // 塔左
    ctx.fillRect(-35, -60, 12, 60);
    ctx.fillRect(-37, -65, 16, 6);
    // 塔右
    ctx.fillRect(23, -60, 12, 60);
    ctx.fillRect(21, -65, 16, 6);
    // 中央塔
    ctx.fillRect(-8, -75, 16, 75);
    ctx.fillRect(-10, -80, 20, 6);
    // 旗
    ctx.fillStyle = '#cc2222';
    ctx.fillRect(-1, -88, 8, 6);
    // 窓
    ctx.fillStyle = '#ffcc44';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(-20, -30, 4, 5);
    ctx.fillRect(16, -30, 4, 5);
    ctx.fillRect(-3, -60, 6, 8);
    ctx.globalAlpha = 1;
    // 扉
    ctx.fillStyle = '#331a00';
    ctx.fillRect(-6, -10, 12, 10);
    ctx.fillStyle = '#ffcc44';
    ctx.fillRect(3, -5, 2, 2);
    ctx.restore();
  }

  // 魔王シルエット
  function _drawDemonSilhouette(x, y, scale, time) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    const flicker = Math.sin(time * 0.004) * 0.1;
    ctx.globalAlpha = 0.7 + flicker;
    // 体
    ctx.fillStyle = '#1a0008';
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(-25, 20);
    ctx.lineTo(-20, 30);
    ctx.lineTo(20, 30);
    ctx.lineTo(25, 20);
    ctx.closePath();
    ctx.fill();
    // 角
    ctx.fillRect(-18, -40, 6, 15);
    ctx.fillRect(12, -40, 6, 15);
    // 目
    ctx.fillStyle = '#ff2200';
    ctx.globalAlpha = 0.8 + Math.sin(time * 0.006) * 0.2;
    ctx.fillRect(-10, -16, 5, 3);
    ctx.fillRect(5, -16, 5, 3);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // =========================================
  //  タイトル画面描画
  // =========================================
  let _titleInited = false;

  function drawTitle(time) {
    if (!_titleInited) { _initStars(); _titleInited = true; }

    _drawStarSky(time, ['#050520', '#0a0a30', '#151545']);

    // 遠景の山
    _drawMountains('#0c0c28', BASE_H - 80);
    _drawMountains('#10102e', BASE_H - 55);

    // 木
    _drawTrees('#081808', '#1a0a0a', BASE_H - 40, 18);

    // 地面
    _drawGround('#334422', '#2a1a0e', BASE_H - 40);

    // 城（遠景）
    _drawCastle(BASE_W * 0.78, BASE_H - 42, 0.7);

    // 魔王のシルエット（城の上空）
    _drawDemonSilhouette(BASE_W * 0.78, BASE_H - 140, 1.0, time);

    // 赤い光点（不穏な雰囲気）
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 6; i++) {
      const px = BASE_W * 0.6 + Math.sin(time * 0.002 + i * 1.5) * 80;
      const py = BASE_H * 0.3 + Math.cos(time * 0.0015 + i * 2.1) * 40;
      ctx.fillStyle = i % 2 === 0 ? '#ff3300' : '#cc1100';
      ctx.fillRect(px, py, 2, 2);
    }
    ctx.globalAlpha = 1;

    // ヒーロー（手前に立つ）
    const heroX = BASE_W * 0.22;
    const heroY = BASE_H - 52;
    const heroBob = Math.sin(time * 0.003) * 2;
    _drawHeroLarge(heroX, heroY + heroBob, 3, true, true);

    // マントなびき演出（ヒーロー後ろの粒子）
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 4; i++) {
      const px = heroX - 18 - Math.sin(time * 0.004 + i) * 6 - i * 3;
      const py = heroY - 4 + Math.cos(time * 0.005 + i * 2) * 3;
      ctx.fillStyle = '#cc2222';
      ctx.fillRect(px, py, 2, 2);
    }
    ctx.globalAlpha = 1;

    // タイトルロゴ
    const logoY = 60 + Math.sin(time * 0.002) * 4;

    // ロゴ影
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.font = 'bold 42px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PIXEL QUEST', BASE_W / 2 + 2, logoY + 2);
    ctx.globalAlpha = 1;

    // ロゴ本体（グラデーション）
    const logoGrd = ctx.createLinearGradient(BASE_W / 2 - 120, logoY - 30, BASE_W / 2 + 120, logoY);
    logoGrd.addColorStop(0, '#ffdd44');
    logoGrd.addColorStop(0.5, '#ffcc00');
    logoGrd.addColorStop(1, '#ff8800');
    ctx.font = 'bold 42px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = logoGrd;
    ctx.fillText('PIXEL QUEST', BASE_W / 2, logoY);

    // 剣アイコン装飾
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(BASE_W / 2 - 148, logoY - 12, 12, 2);
    ctx.fillStyle = '#dddddd';
    ctx.fillRect(BASE_W / 2 - 158, logoY - 15, 10, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(BASE_W / 2 - 168, logoY - 13, 12, 4);

    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(BASE_W / 2 + 136, logoY - 12, 12, 2);
    ctx.fillStyle = '#dddddd';
    ctx.fillRect(BASE_W / 2 + 148, logoY - 15, 10, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(BASE_W / 2 + 156, logoY - 13, 12, 4);

    // 光のきらめき
    ctx.globalAlpha = 0.4 + Math.sin(time * 0.008) * 0.3;
    ctx.fillStyle = '#fff';
    ctx.fillRect(BASE_W / 2 - 60 + Math.sin(time * 0.003) * 50, logoY - 28, 3, 3);
    ctx.fillRect(BASE_W / 2 + 20 + Math.cos(time * 0.004) * 40, logoY - 22, 2, 2);
    ctx.globalAlpha = 1;

    // サブタイトル
    _drawText('— 剣と魔法の冒険譚 —', BASE_W / 2, logoY + 22, '11px monospace', '#8888aa', 'center');

    ctx.textAlign = 'left';
  }

  // =========================================
  //  プロローグ
  // =========================================
  const PROLOGUE_PAGES = [
    {
      // Page 0: 平和な王国
      draw(time) {
        _drawStarSky(time, ['#0a0a2e', '#1a1a4e', '#2a2a5e']);
        _drawMountains('#141430', BASE_H - 70);
        _drawTrees('#0d2b0d', '#2a1a0a', BASE_H - 50, 16);
        _drawGround('#44aa22', '#5c3d1e', BASE_H - 50);
        _drawCastle(BASE_W * 0.5, BASE_H - 52, 0.9);

        // 平和な光
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#ffffaa';
        ctx.fillRect(0, 0, BASE_W, BASE_H);
        ctx.globalAlpha = 1;

        // 窓の光を強調
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#ffcc44';
        ctx.fillRect(BASE_W * 0.5 - 14, BASE_H - 82, 5, 6);
        ctx.fillRect(BASE_W * 0.5 + 10, BASE_H - 82, 5, 6);
        ctx.globalAlpha = 1;
      },
      text: [
        'かつて、この地には平和が満ちていた。',
        '',
        '人々は緑豊かな大地で暮らし、',
        '王国の城には温かな光が灯っていた。'
      ]
    },
    {
      // Page 1: 魔王の襲来
      draw(time) {
        _drawStarSky(time, ['#0a0008', '#150010', '#200818']);

        // 暗い空に赤い雲
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < 5; i++) {
          const cx = 60 + i * 120 + Math.sin(time * 0.001 + i) * 20;
          const cy = 40 + Math.sin(time * 0.002 + i * 1.5) * 10;
          ctx.fillStyle = '#440000';
          ctx.fillRect(cx - 30, cy, 60, 15);
          ctx.fillRect(cx - 20, cy - 5, 40, 25);
        }
        ctx.globalAlpha = 1;

        _drawMountains('#100010', BASE_H - 70);
        _drawTrees('#100010', '#1a0510', BASE_H - 50, 14);
        _drawGround('#2a1a2a', '#1a0a1a', BASE_H - 50);

        // 崩れた城
        ctx.fillStyle = '#1a1020';
        ctx.fillRect(BASE_W * 0.5 - 30, BASE_H - 90, 60, 40);
        ctx.fillRect(BASE_W * 0.5 - 35, BASE_H - 100, 12, 50);
        ctx.fillRect(BASE_W * 0.5 + 23, BASE_H - 95, 12, 45);
        // 炎
        ctx.fillStyle = '#ff4400';
        ctx.globalAlpha = 0.6 + Math.sin(time * 0.01) * 0.2;
        ctx.fillRect(BASE_W * 0.5 - 10, BASE_H - 100, 8, 12);
        ctx.fillRect(BASE_W * 0.5 + 8, BASE_H - 95, 6, 10);
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(BASE_W * 0.5 - 8, BASE_H - 96, 4, 6);
        ctx.globalAlpha = 1;

        // 魔王
        _drawDemonSilhouette(BASE_W * 0.5, BASE_H - 160, 1.5, time);

        // 赤い光点（魔力）
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 10; i++) {
          const px = Math.sin(time * 0.003 + i * 0.8) * 200 + BASE_W * 0.5;
          const py = Math.cos(time * 0.002 + i * 1.2) * 80 + BASE_H * 0.35;
          ctx.fillStyle = '#ff2200';
          ctx.fillRect(px, py, 2, 2);
        }
        ctx.globalAlpha = 1;
      },
      text: [
        'しかし、闇の彼方から魔王が現れた。',
        '',
        '王国は炎に包まれ、人々は散り散りになった。',
        '世界は深い闇に覆われていく...'
      ]
    },
    {
      // Page 2: 勇者の旅立ち
      draw(time) {
        _drawStarSky(time, ['#0a0a2e', '#0e0e3a', '#1a1a4e']);
        _drawMountains('#0c0c28', BASE_H - 75);
        _drawTrees('#081808', '#1a0a0a', BASE_H - 50, 12);
        _drawGround('#334422', '#2a1a0e', BASE_H - 50);

        // 夜明けの兆し（地平線にオレンジの光）
        ctx.globalAlpha = 0.15;
        const dawnGrd = ctx.createLinearGradient(0, BASE_H - 80, 0, BASE_H - 50);
        dawnGrd.addColorStop(0, 'transparent');
        dawnGrd.addColorStop(1, '#ff8844');
        ctx.fillStyle = dawnGrd;
        ctx.fillRect(0, BASE_H - 80, BASE_W, 30);
        ctx.globalAlpha = 1;

        // ヒーロー（中央に大きく）
        const hx = BASE_W * 0.5;
        const hy = BASE_H - 62;
        const bob = Math.sin(time * 0.003) * 1.5;
        _drawHeroLarge(hx, hy + bob, 4, true, true);

        // 剣の輝き
        ctx.globalAlpha = 0.5 + Math.sin(time * 0.008) * 0.3;
        ctx.fillStyle = '#ffdd44';
        ctx.fillRect(hx + 22, hy - 62, 3, 3);
        ctx.fillStyle = '#fff';
        ctx.fillRect(hx + 23, hy - 60, 1, 1);
        ctx.globalAlpha = 1;

        // 光の粒子（決意の演出）
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 8; i++) {
          const px = hx - 40 + Math.sin(time * 0.002 + i * 1.1) * 60;
          const py = hy - 20 - i * 8 + Math.cos(time * 0.003 + i * 0.8) * 4;
          ctx.fillStyle = i % 2 === 0 ? '#ffcc00' : '#ffdd88';
          ctx.fillRect(px, py, 2, 2);
        }
        ctx.globalAlpha = 1;
      },
      text: [
        'ひとりの若き剣士が立ち上がった。',
        '',
        '「この剣にかけて、必ず世界を取り戻す」',
        '',
        '夜明けの空の下、冒険が始まる——'
      ]
    }
  ];

  let _prologueActive = false;

  function startPrologue(callback) {
    _page = 0;
    _timer = 0;
    _callback = callback;
    _prologueActive = true;
    _initStars();
    _resetFade();
  }

  function updatePrologue(dt, time) {
    if (!_prologueActive) return false;

    _timer += dt;
    _updateFade(dt);

    // 描画
    const page = PROLOGUE_PAGES[_page];
    page.draw(time);

    // テキストボックス
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(40, BASE_H - 130, BASE_W - 80, 110);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, BASE_H - 130, BASE_W - 80, 110);

    // テキスト描画（1文字ずつタイプライタ風）
    const charsPerSec = 20;
    const totalChars = Math.floor(_timer * charsPerSec);
    let charCount = 0;
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';

    for (let i = 0; i < page.text.length; i++) {
      const line = page.text[i];
      const lineStart = charCount;
      const visibleChars = Math.max(0, Math.min(line.length, totalChars - lineStart));
      charCount += line.length;

      if (visibleChars > 0) {
        const displayText = line.substring(0, visibleChars);
        ctx.fillStyle = '#000';
        ctx.fillText(displayText, 61, BASE_H - 108 + i * 18 + 1);
        ctx.fillStyle = '#ddd';
        ctx.fillText(displayText, 60, BASE_H - 108 + i * 18);
      }
    }

    // ページ送り案内（モバイルはAボタン・タップ表記）
    const allTextShown = totalChars >= page.text.join('').length;
    if (allTextShown) {
      _drawBlinkText(_getAdvanceHint(), BASE_W / 2, BASE_H - 10, '10px monospace', '#888', time);
    }

    _drawFadeOverlay();

    // 入力: Space/Enter/Z（キーボード）、Aボタン=Space・Bボタン=Z（携帯）、クリック/タップ
    if (Input.wasPressed('Space') || Input.wasPressed('Enter') || Input.wasPressed('KeyZ')) {
      if (allTextShown) {
        _page++;
        _timer = 0;
        if (_page >= PROLOGUE_PAGES.length) {
          _prologueActive = false;
          _fadeDir = 1;
          if (_callback) _callback();
          return false;
        }
        _resetFade();
      } else {
        _timer = 9999; // スキップ：全テキスト表示
      }
    }

    return true; // まだプロローグ中
  }

  // マウスクリック・タップでページ送り（Aボタンと同じ挙動）
  let _clickListenerAdded = false;
  function _triggerAdvance() {
    Input.justPressed['Space'] = true;
    Input.keys['Space'] = true;
    setTimeout(() => { Input.keys['Space'] = false; }, 50);
  }
  function _ensureClickListener() {
    if (_clickListenerAdded) return;
    _clickListenerAdded = true;
    canvas.addEventListener('click', () => {
      if (_prologueActive || _epilogueActive) _triggerAdvance();
    });
    // 携帯: タップで即コマ送り（クリック遅延を避ける）
    canvas.addEventListener('touchend', (e) => {
      if (_prologueActive || _epilogueActive) {
        e.preventDefault();
        _triggerAdvance();
      }
    }, { passive: false });
  }

  // =========================================
  //  エンディング
  // =========================================
  const EPILOGUE_PAGES = [
    {
      // Page 0: 魔王を倒した直後
      draw(time) {
        _drawStarSky(time, ['#0a0008', '#100510', '#1a0818']);

        // 散る魔力のパーティクル
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 20; i++) {
          const px = BASE_W * 0.5 + Math.sin(time * 0.002 + i * 0.7) * 150;
          const py = BASE_H * 0.3 + Math.cos(time * 0.003 + i * 1.1) * 80 - (time * 0.01 + i * 5) % 200;
          const colors = ['#ff4444', '#ffcc00', '#ff8800', '#e8c830'];
          ctx.fillStyle = colors[i % colors.length];
          ctx.fillRect(px, py, 2 + Math.sin(i) * 1, 2 + Math.cos(i) * 1);
        }
        ctx.globalAlpha = 1;

        _drawMountains('#100010', BASE_H - 70);
        _drawGround('#2a1a2a', '#1a0a1a', BASE_H - 50);

        // ヒーロー（勝利のポーズ）
        const hx = BASE_W * 0.5;
        const hy = BASE_H - 62;
        _drawHeroLarge(hx, hy, 4, true, true);

        // 光の柱
        ctx.globalAlpha = 0.1 + Math.sin(time * 0.004) * 0.05;
        const pillarGrd = ctx.createLinearGradient(hx - 15, 0, hx + 15, 0);
        pillarGrd.addColorStop(0, 'transparent');
        pillarGrd.addColorStop(0.5, '#ffcc44');
        pillarGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = pillarGrd;
        ctx.fillRect(hx - 15, 0, 30, hy - 20);
        ctx.globalAlpha = 1;
      },
      text: [
        '長き戦いの末、魔王は倒れた。',
        '',
        '闇の力は砕け散り、',
        '深い紅の光が天へと消えていく。'
      ]
    },
    {
      // Page 1: 夜明け・世界の復活
      draw(time) {
        // 明け方の空
        const skyGrd = ctx.createLinearGradient(0, 0, 0, BASE_H);
        skyGrd.addColorStop(0, '#0a0a2e');
        skyGrd.addColorStop(0.3, '#1a1a4e');
        skyGrd.addColorStop(0.6, '#443355');
        skyGrd.addColorStop(0.8, '#884433');
        skyGrd.addColorStop(1, '#cc7733');
        ctx.fillStyle = skyGrd;
        ctx.fillRect(0, 0, BASE_W, BASE_H);

        // 朝焼けの星（消えかけ）
        for (const s of _stars) {
          ctx.globalAlpha = s.brightness * 0.2 * Math.max(0, 1 - s.y / (BASE_H * 0.3));
          ctx.fillStyle = '#fff';
          ctx.fillRect(s.x, s.y, s.size * 0.7, s.size * 0.7);
        }
        ctx.globalAlpha = 1;

        // 太陽の出かけ
        const sunY = BASE_H - 60 + Math.sin(time * 0.001) * 3;
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#ffcc44';
        ctx.beginPath();
        ctx.arc(BASE_W * 0.7, sunY, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(BASE_W * 0.7, sunY, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#ffeedd';
        ctx.beginPath();
        ctx.arc(BASE_W * 0.7, sunY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        _drawMountains('#2a1a20', BASE_H - 70);
        _drawTrees('#1a3a1a', '#3a2a1a', BASE_H - 50, 14);
        _drawGround('#55aa33', '#5c3d1e', BASE_H - 50);

        // 城の復興（明るい色）
        ctx.fillStyle = '#7a6a5a';
        ctx.fillRect(BASE_W * 0.5 - 28, BASE_H - 88, 56, 38);
        ctx.fillRect(BASE_W * 0.5 - 33, BASE_H - 100, 12, 50);
        ctx.fillRect(BASE_W * 0.5 + 21, BASE_H - 100, 12, 50);
        ctx.fillRect(BASE_W * 0.5 - 7, BASE_H - 112, 14, 62);
        // 旗
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(BASE_W * 0.5, BASE_H - 120, 8, 5);
        ctx.fillStyle = '#aa8800';
        ctx.fillRect(BASE_W * 0.5, BASE_H - 122, 2, 12);
        // 窓の光
        ctx.fillStyle = '#ffeeaa';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(BASE_W * 0.5 - 18, BASE_H - 78, 4, 5);
        ctx.fillRect(BASE_W * 0.5 + 14, BASE_H - 78, 4, 5);
        ctx.globalAlpha = 1;
      },
      text: [
        '光が戻った。',
        '',
        '朝日が地平線から差し込み、',
        '王国は再び輝きを取り戻していく。',
        '草木が芽吹き、人々の笑顔が戻る。'
      ]
    },
    {
      // Page 2: エピローグ・勇者の帰還
      draw(time) {
        // 美しい夕焼け空
        const skyGrd = ctx.createLinearGradient(0, 0, 0, BASE_H);
        skyGrd.addColorStop(0, '#1a1a4e');
        skyGrd.addColorStop(0.3, '#553355');
        skyGrd.addColorStop(0.6, '#aa5533');
        skyGrd.addColorStop(0.85, '#dd8844');
        skyGrd.addColorStop(1, '#ffcc66');
        ctx.fillStyle = skyGrd;
        ctx.fillRect(0, 0, BASE_W, BASE_H);

        _drawMountains('#331a20', BASE_H - 70);
        _drawTrees('#1a3a1a', '#3a2a1a', BASE_H - 50, 16);
        _drawGround('#55aa33', '#5c3d1e', BASE_H - 50);

        // 小道
        ctx.fillStyle = '#8b7355';
        ctx.beginPath();
        ctx.moveTo(0, BASE_H - 30);
        ctx.quadraticCurveTo(BASE_W * 0.3, BASE_H - 45, BASE_W * 0.6, BASE_H - 38);
        ctx.quadraticCurveTo(BASE_W * 0.8, BASE_H - 30, BASE_W, BASE_H - 35);
        ctx.lineTo(BASE_W, BASE_H - 28);
        ctx.quadraticCurveTo(BASE_W * 0.8, BASE_H - 24, BASE_W * 0.6, BASE_H - 32);
        ctx.quadraticCurveTo(BASE_W * 0.3, BASE_H - 38, 0, BASE_H - 24);
        ctx.fill();

        // ヒーロー（歩いて帰る姿、やや小さく遠景感）
        const walkPhase = Math.floor(time * 0.004) % 2;
        const hx = BASE_W * 0.35 + Math.sin(time * 0.0005) * 5;
        const hy = BASE_H - 58;
        _drawHeroLarge(hx, hy, 2.5, true, false);

        // 夕日の光
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = '#ffcc44';
        ctx.fillRect(0, 0, BASE_W, BASE_H);
        ctx.globalAlpha = 1;
      },
      text: [
        '世界に平和が戻った今、',
        '勇者は静かに歩き出す。',
        '',
        '次なる冒険の地を求めて——',
        '',
        'ありがとう。あなたの旅は、伝説となった。'
      ]
    }
  ];

  // スタッフロール（最後のページの後に表示）
  const CREDITS = [
    '',
    '— PIXEL QUEST —',
    '',
    'Game Design & Programming',
    'Pixel Quest Team',
    '',
    'Art Direction',
    'Retro Fantasy Studio',
    '',
    'Music',
    '夜明けのフロア / 揺るがないまま突き進め',
    '',
    'Special Thanks',
    'You, the Player',
    '',
    '',
    'Thank you for playing!',
    '',
    '— FIN —',
    ''
  ];

  let _epilogueActive = false;
  let _creditsActive = false;
  let _creditsScroll = 0;

  function startEpilogue(callback) {
    _page = 0;
    _timer = 0;
    _callback = callback;
    _epilogueActive = true;
    _creditsActive = false;
    _creditsScroll = 0;
    _initStars();
    _resetFade();
  }

  function updateEpilogue(dt, time) {
    if (!_epilogueActive) return false;

    _timer += dt;
    _updateFade(dt);

    if (_creditsActive) {
      // スタッフロール
      const skyGrd = ctx.createLinearGradient(0, 0, 0, BASE_H);
      skyGrd.addColorStop(0, '#050510');
      skyGrd.addColorStop(0.5, '#0a0a20');
      skyGrd.addColorStop(1, '#151530');
      ctx.fillStyle = skyGrd;
      ctx.fillRect(0, 0, BASE_W, BASE_H);

      // 星
      for (const s of _stars) {
        ctx.globalAlpha = s.brightness * (0.4 + Math.sin(time * 0.003 + s.x * 0.1) * 0.3);
        ctx.fillStyle = '#fff';
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
      ctx.globalAlpha = 1;

      _creditsScroll += dt * 30;

      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      for (let i = 0; i < CREDITS.length; i++) {
        const ly = BASE_H + i * 24 - _creditsScroll;
        if (ly < -20 || ly > BASE_H + 20) continue;

        const line = CREDITS[i];
        const isTitle = line.startsWith('—') || line === 'Thank you for playing!';
        const isHeader = line.includes('Design') || line.includes('Art') || line.includes('Music') || line.includes('Special');

        if (isTitle) {
          ctx.font = 'bold 16px monospace';
          ctx.fillStyle = '#ffcc00';
        } else if (isHeader) {
          ctx.font = 'bold 11px monospace';
          ctx.fillStyle = '#aaaacc';
        } else {
          ctx.font = '11px monospace';
          ctx.fillStyle = '#888899';
        }

        ctx.fillStyle += ''; // force
        ctx.fillText(line, BASE_W / 2, ly);
      }
      ctx.textAlign = 'left';

      // クレジット終了判定
      const totalHeight = CREDITS.length * 24;
      if (_creditsScroll > totalHeight + BASE_H) {
        _epilogueActive = false;
        if (_callback) _callback();
        return false;
      }

      // スキップ
      if (Input.wasPressed('Space') || Input.wasPressed('Enter') || Input.wasPressed('KeyZ')) {
        _epilogueActive = false;
        if (_callback) _callback();
        return false;
      }

      _drawFadeOverlay();
      return true;
    }

    // ストーリーページ
    const page = EPILOGUE_PAGES[_page];
    page.draw(time);

    // テキストボックス
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(40, BASE_H - 140, BASE_W - 80, 118);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, BASE_H - 140, BASE_W - 80, 118);

    // テキスト
    const charsPerSec = 18;
    const totalChars = Math.floor(_timer * charsPerSec);
    let charCount = 0;
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';

    for (let i = 0; i < page.text.length; i++) {
      const line = page.text[i];
      const lineStart = charCount;
      const visibleChars = Math.max(0, Math.min(line.length, totalChars - lineStart));
      charCount += line.length;

      if (visibleChars > 0) {
        ctx.fillStyle = '#000';
        ctx.fillText(line.substring(0, visibleChars), 61, BASE_H - 118 + i * 18 + 1);
        ctx.fillStyle = '#ddd';
        ctx.fillText(line.substring(0, visibleChars), 60, BASE_H - 118 + i * 18);
      }
    }

    const allTextShown = totalChars >= page.text.join('').length;
    if (allTextShown) {
      _drawBlinkText(_getAdvanceHint(), BASE_W / 2, BASE_H - 10, '10px monospace', '#888', time);
    }

    _drawFadeOverlay();

    // 入力: Aボタン(Space)・Bボタン(Z)・タップでも送れる
    if (Input.wasPressed('Space') || Input.wasPressed('Enter') || Input.wasPressed('KeyZ')) {
      if (allTextShown) {
        _page++;
        _timer = 0;
        if (_page >= EPILOGUE_PAGES.length) {
          _creditsActive = true;
          _timer = 0;
          _resetFade();
        } else {
          _resetFade();
        }
      } else {
        _timer = 9999;
      }
    }

    return true;
  }

  // 初期化
  _ensureClickListener();

  // =========================================
  //  公開API
  // =========================================
  return {
    drawTitle,
    startPrologue,
    updatePrologue,
    startEpilogue,
    updateEpilogue,
    get prologueActive() { return _prologueActive; },
    get epilogueActive() { return _epilogueActive; }
  };

})();
