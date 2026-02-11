// ============================================================
//  モバイル専用: iOS/携帯対応
//  ダブルタップ防止・スクロール防止・音声アンロック・操作性・パフォーマンス
// ============================================================

(function() {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    return;
  }

  window.MOBILE = true;

  // ---- 1. ダブルタップでズームしない（ボタン以外で2回連続タップを無視） ----
  var lastTap = 0;
  document.addEventListener('touchstart', function(e) {
    var now = Date.now();
    var onButton = e.target.closest('button') || e.target.closest('.touch-btn');
    if (!onButton && (now - lastTap) < 400) {
      e.preventDefault();
    }
    lastTap = now;
  }, { passive: false });

  // ---- 2. スクロール・バウンスを防止（画面が動かないように） ----
  document.addEventListener('touchmove', function(e) {
    var t = e.target;
    if (t.closest('button') || t.closest('a') || t.closest('.touch-btn')) return;
    e.preventDefault();
  }, { passive: false });

  // ---- 3. 音声アンロック（最初のユーザー操作で BGM/SE が鳴るように） ----
  function unlockAudio() {
    if (window.SE && typeof window.SE.unlock === 'function') {
      window.SE.unlock();
    }
    if (window.BGM && typeof window.BGM.unlock === 'function') {
      window.BGM.unlock();
    }
    hideUnlockOverlay();
  }

  function showUnlockOverlay() {
    var el = document.getElementById('mobileUnlockOverlay');
    if (el) return;
    el = document.createElement('div');
    el.id = 'mobileUnlockOverlay';
    el.innerHTML = '<p>タップしてプレイ</p><p class="small">（音声が有効になります）</p>';
    el.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:Courier New,monospace;touch-action:manipulation;';
    el.querySelector('p').style.cssText = 'font-size:18px;color:#ffcc00;margin:8px;';
    el.querySelector('.small').style.cssText = 'font-size:12px;color:#888;';
    el.addEventListener('touchstart', function once(e) {
      e.preventDefault();
      unlockAudio();
      document.body.removeChild(el);
    }, { passive: false });
    el.addEventListener('touchend', function(e) { e.preventDefault(); }, { passive: false });
    document.body.appendChild(el);
  }

  function hideUnlockOverlay() {
    var el = document.getElementById('mobileUnlockOverlay');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      showUnlockOverlay();
    }, 100);
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

  // START ボタンや画面内ボタンでもアンロック
  setTimeout(function() {
    var btn = document.getElementById('startBtn');
    if (btn) {
      btn.addEventListener('touchstart', unlockAudio, { passive: true });
      btn.addEventListener('touchend', unlockAudio, { passive: true });
    }
  }, 500);

  // ---- 4. 画面サイズに合わせたキャンバス（縦長・セーフエリア考慮） ----
  function mobileResizeCanvas() {
    var canvas = document.getElementById('gameCanvas');
    if (!canvas || typeof BASE_W === 'undefined' || typeof BASE_H === 'undefined') return;

    var controlH = 100;
    var availW = window.innerWidth;
    var availH = window.innerHeight - controlH;

    var scale = Math.min(availW / BASE_W, availH / BASE_H, 2);
    scale = Math.max(0.5, scale);
    canvas.width = BASE_W;
    canvas.height = BASE_H;
    canvas.style.width = (BASE_W * scale) + 'px';
    canvas.style.height = (BASE_H * scale) + 'px';
  }

  window.resizeCanvas = mobileResizeCanvas;
  if (typeof BASE_W !== 'undefined') {
    mobileResizeCanvas();
  }
  window.addEventListener('resize', mobileResizeCanvas);
  window.addEventListener('orientationchange', function() {
    setTimeout(mobileResizeCanvas, 200);
  });

  // ---- 5. パフォーマンス: モバイルでパーティクル数を抑える ----
  if (window.Particles && typeof window.Particles.emit === 'function') {
    var origEmit = window.Particles.emit.bind(window.Particles);
    window.Particles.emit = function(x, y, count) {
      if (count > 10) count = 10;
      return origEmit.apply(window.Particles, arguments);
    };
  }

})();
