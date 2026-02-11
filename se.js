// ============================================================
//  効果音（内蔵ウェブ音声）— Web Audio API で合成
//  外部ファイル不要。ボス撃破・剣・波動・ジャンプ・コイン等
// ============================================================

(function() {
  let ctx = null;

  function getCtx() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return null; }
    return ctx;
  }

  function unlock() {
    const ac = getCtx();
    if (ac && ac.state === 'suspended') {
      ac.resume().catch(function() {});
    }
  }

  function playTone(options) {
    const ac = getCtx();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = options.type || 'square';
    osc.frequency.setValueAtTime(options.freq || 440, now);
    if (options.freqEnd != null) osc.frequency.exponentialRampToValueAtTime(options.freqEnd, now + (options.duration || 0.1));
    gain.gain.setValueAtTime(options.vol !== undefined ? options.vol : 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (options.duration || 0.1));
    osc.start(now);
    osc.stop(now + (options.duration || 0.1));
  }

  function playNoise(duration, vol) {
    const ac = getCtx();
    if (!ac) return;
    const now = ac.currentTime;
    const bufSize = ac.sampleRate * duration;
    const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (vol !== undefined ? vol : 0.2);
    const src = ac.createBufferSource();
    src.buffer = buf;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(vol !== undefined ? vol : 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(gain);
    gain.connect(ac.destination);
    src.start(now);
    src.stop(now + duration);
  }

  window.SE = {
    unlock: unlock,
    // ボス撃破
    bossDefeat() {
      const ac = getCtx();
      if (!ac) return;
      const now = ac.currentTime;
      const g = ac.createGain();
      g.connect(ac.destination);
      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      [80, 60, 40].forEach((f, i) => {
        const o = ac.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(f, now);
        o.frequency.exponentialRampToValueAtTime(20, now + 0.5);
        o.connect(g);
        o.start(now + i * 0.05);
        o.stop(now + 0.6);
      });
      playNoise(0.4, 0.18);
    },

    // 剣を振る
    slash() {
      playTone({ type: 'square', freq: 180, freqEnd: 80, duration: 0.08, vol: 0.12 });
      playTone({ type: 'square', freq: 320, duration: 0.06, vol: 0.06 });
    },

    // 剣から波動（ビーム発射）
    swordBeam() {
      playTone({ type: 'sine', freq: 880, freqEnd: 660, duration: 0.12, vol: 0.14 });
      playTone({ type: 'square', freq: 440, duration: 0.1, vol: 0.08 });
    },

    // ジャンプ
    jump() {
      playTone({ type: 'square', freq: 320, duration: 0.06, vol: 0.1 });
      playTone({ type: 'square', freq: 420, duration: 0.05, vol: 0.06 });
    },

    // コイン取得
    coin() {
      playTone({ type: 'square', freq: 988, duration: 0.07, vol: 0.1 });
      playTone({ type: 'square', freq: 1312, duration: 0.06, vol: 0.07 });
    },

    // ポーション（回復）
    potion() {
      playTone({ type: 'sine', freq: 523, duration: 0.08, vol: 0.1 });
      playTone({ type: 'sine', freq: 659, duration: 0.07, vol: 0.08 });
      playTone({ type: 'sine', freq: 784, duration: 0.1, vol: 0.06 });
    },

    // パワーアップ
    powerUp() {
      [262, 330, 392, 523].forEach((f, i) => {
        setTimeout(function() {
          playTone({ type: 'square', freq: f, duration: 0.12, vol: 0.1 });
        }, i * 80);
      });
    },

    // 主人公被弾
    playerDamage() {
      playNoise(0.15, 0.2);
      playTone({ type: 'sawtooth', freq: 150, duration: 0.12, vol: 0.1 });
    },

    // 敵撃破（雑魚）
    enemyDefeat() {
      playTone({ type: 'square', freq: 200, freqEnd: 80, duration: 0.1, vol: 0.08 });
    },

    // ゲームオーバー
    gameOver() {
      const ac = getCtx();
      if (!ac) return;
      const now = ac.currentTime;
      const g = ac.createGain();
      g.connect(ac.destination);
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      const o = ac.createOscillator();
      o.type = 'square';
      o.frequency.setValueAtTime(220, now);
      o.frequency.exponentialRampToValueAtTime(110, now + 0.45);
      o.connect(g);
      o.start(now);
      o.stop(now + 0.5);
    },

    // ステージクリア
    clear() {
      [523, 659, 784, 1047].forEach((f, i) => {
        setTimeout(function() {
          playTone({ type: 'square', freq: f, duration: 0.15, vol: 0.12 });
        }, i * 120);
      });
    },

    // ゴール（旗）に触れた
    goal() {
      playTone({ type: 'square', freq: 880, duration: 0.1, vol: 0.1 });
      playTone({ type: 'square', freq: 1175, duration: 0.2, vol: 0.08 });
    }
  };
})();
