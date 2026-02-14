// ============================================================
//  モバイル専用: iOS/携帯対応 — 強化版
//  横向き対応・大きい表示・タッチ応答性改善・音声アンロック
// ============================================================

(function() {
  var isMobile = /Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    return;
  }

  window.MOBILE = true;

  // ---- 1. ダブルタップでズームしない ----
  var lastTap = 0;
  document.addEventListener('touchstart', function(e) {
    var now = Date.now();
    var onButton = e.target.closest('button') || e.target.closest('.touch-btn');
    if (!onButton && (now - lastTap) < 400) {
      e.preventDefault();
    }
    lastTap = now;
  }, { passive: false });

  // ---- 2. スクロール・バウンスを防止 ----
  document.addEventListener('touchmove', function(e) {
    var t = e.target;
    if (t.closest('button') || t.closest('a') || t.closest('.touch-btn')) return;
    e.preventDefault();
  }, { passive: false });

  // ---- 3. 音声アンロック ----
  var audioUnlocked = false;
  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    if (window.SE && typeof window.SE.unlock === 'function') {
      window.SE.unlock();
    }
    if (window.BGM && typeof window.BGM.unlock === 'function') {
      window.BGM.unlock();
    }
    hideUnlockOverlay();
  }

  function showUnlockOverlay() {
    if (document.getElementById('mobileUnlockOverlay')) return;
    var el = document.createElement('div');
    el.id = 'mobileUnlockOverlay';
    el.innerHTML = '<p>タップしてプレイ</p><p class="small">（音声が有効になります）</p>';
    el.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.8);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:Courier New,monospace;touch-action:manipulation;';
    var p1 = el.querySelector('p');
    var p2 = el.querySelector('.small');
    if (p1) p1.style.cssText = 'font-size:22px;color:#ffcc00;margin:8px;';
    if (p2) p2.style.cssText = 'font-size:13px;color:#888;';
    el.addEventListener('touchstart', function once(e) {
      e.preventDefault();
      unlockAudio();
      if (el.parentNode) el.parentNode.removeChild(el);
    }, { passive: false });
    el.addEventListener('touchend', function(e) { e.preventDefault(); }, { passive: false });
    document.body.appendChild(el);
  }

  function hideUnlockOverlay() {
    var el = document.getElementById('mobileUnlockOverlay');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(showUnlockOverlay, 100);
  });

  window.addEventListener('load', function() {
    document.body.addEventListener('touchstart', function once() {
      unlockAudio();
      document.body.removeEventListener('touchstart', once);
    }, { once: true, passive: true });
  });

  document.addEventListener('click', function once() {
    unlockAudio();
    document.removeEventListener('click', once);
  }, { once: true });

  setTimeout(function() {
    var btn = document.getElementById('startBtn');
    if (btn) {
      btn.addEventListener('touchstart', unlockAudio, { passive: true });
    }
  }, 500);

  // ---- 4. キャンバスリサイズ（横向き時に最大化） ----
  function mobileResizeCanvas() {
    var canvas = document.getElementById('gameCanvas');
    if (!canvas || typeof BASE_W === 'undefined' || typeof BASE_H === 'undefined') return;

    var isLandscape = window.innerWidth > window.innerHeight;
    var availW, availH;

    if (isLandscape) {
      // 横向き: コントロール用の左右マージンを確保しつつ最大化
      var controlMargin = 160; // 左右のボタン領域
      availW = window.innerWidth - controlMargin;
      availH = window.innerHeight;
    } else {
      // 縦向き: 下部コントロール用マージン
      var controlH = 140;
      availW = window.innerWidth;
      availH = window.innerHeight - controlH;
    }

    // セーフエリア分を考慮（iOS ノッチ・ホームバー）
    var sat = getComputedStyle(document.documentElement).getPropertyValue('--sat').trim() || '0px';
    var sab = getComputedStyle(document.documentElement).getPropertyValue('--sab').trim() || '0px';
    var safeTop = parseInt(sat, 10) || 0;
    var safeBottom = parseInt(sab, 10) || 0;
    availH -= (safeTop + safeBottom);

    // 整数倍でスケールして pixelated を維持（上限を緩和）
    var scaleX = availW / BASE_W;
    var scaleY = availH / BASE_H;
    var scale = Math.min(scaleX, scaleY);

    // 最小スケール: 画面が極端に小さい場合
    scale = Math.max(0.5, scale);

    // 整数倍に近づける（見た目がきれいになる）
    if (scale >= 1.8) {
      var intScale = Math.floor(scale);
      // 整数倍で十分画面に入るならそちらを使う
      if (intScale * BASE_W <= availW && intScale * BASE_H <= availH) {
        scale = intScale;
      }
    }

    canvas.width = BASE_W;
    canvas.height = BASE_H;
    canvas.style.width = Math.floor(BASE_W * scale) + 'px';
    canvas.style.height = Math.floor(BASE_H * scale) + 'px';
  }

  window.resizeCanvas = mobileResizeCanvas;
  if (typeof BASE_W !== 'undefined') {
    mobileResizeCanvas();
  }
  window.addEventListener('resize', mobileResizeCanvas);
  window.addEventListener('orientationchange', function() {
    setTimeout(mobileResizeCanvas, 100);
    setTimeout(mobileResizeCanvas, 300);
    setTimeout(mobileResizeCanvas, 600);
  });

  // ---- 5. タッチ応答性の改善 ----
  // touchstart で即座にキー状態を反映（デフォルトの遅延を排除）
  function setupResponsiveTouch(id, code) {
    var el = document.getElementById(id);
    if (!el) return;

    // 既存のイベントと重複しないよう、専用フラグ
    var touching = false;

    el.addEventListener('touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!touching) {
        touching = true;
        if (typeof navigator.vibrate === 'function') navigator.vibrate(8);
        if (window.Input) {
          if (!window.Input.keys[code]) window.Input.justPressed[code] = true;
          window.Input.keys[code] = true;
        }
      }
    }, { passive: false });

    el.addEventListener('touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      touching = false;
      if (window.Input) {
        window.Input.keys[code] = false;
      }
    }, { passive: false });

    el.addEventListener('touchcancel', function(e) {
      touching = false;
      if (window.Input) {
        window.Input.keys[code] = false;
      }
    }, { passive: true });

    // マルチタッチ: 指が離れた後に残っている指のチェック
    el.addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, { passive: false });
  }

  // DOMContentLoaded 後にセットアップ
  function initTouchControls() {
    setupResponsiveTouch('btnLeft', 'ArrowLeft');
    setupResponsiveTouch('btnRight', 'ArrowRight');
    setupResponsiveTouch('btnJump', 'Space');
    setupResponsiveTouch('btnAttack', 'KeyZ');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTouchControls);
  } else {
    initTouchControls();
  }

  // ---- 6. パフォーマンス: パーティクル数を抑える ----
  if (window.Particles && typeof window.Particles.emit === 'function') {
    var origEmit = window.Particles.emit.bind(window.Particles);
    window.Particles.emit = function(x, y, count) {
      var args = Array.prototype.slice.call(arguments);
      if (args[2] > 8) args[2] = 8;
      return origEmit.apply(window.Particles, args);
    };
  }

  // ---- 7. 全画面ヒント（横向き推奨） ----
  function checkOrientation() {
    var hint = document.getElementById('landscapeHint');
    if (window.innerWidth < window.innerHeight && window.innerWidth < 600) {
      // 縦向きで幅が狭い → 横向き推奨を表示
      if (!hint) {
        hint = document.createElement('div');
        hint.id = 'landscapeHint';
        hint.textContent = '📱 横向きで大きく表示されます';
        hint.style.cssText = 'position:fixed;top:4px;left:50%;transform:translateX(-50%);z-index:30;background:rgba(0,0,0,0.7);color:#ffcc00;font-size:11px;padding:4px 12px;border-radius:12px;font-family:sans-serif;pointer-events:none;transition:opacity 0.5s;';
        document.body.appendChild(hint);
        setTimeout(function() {
          if (hint && hint.parentNode) {
            hint.style.opacity = '0';
            setTimeout(function() {
              if (hint.parentNode) hint.parentNode.removeChild(hint);
            }, 500);
          }
        }, 4000);
      }
    }
  }

  window.addEventListener('load', function() {
    setTimeout(checkOrientation, 1500);
  });

})();
