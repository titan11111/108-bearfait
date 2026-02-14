// ============================================================
//  BGM: オープニング → ステージ1〜6 → ボス戦切り替え → エンディング
//  重複再生しないよう、必ず stop() してから次の曲を再生
//  ボス登場時は playBoss() でボス戦BGM（深紅の審判）に切り替え
// ============================================================

(function() {
  const BGM_FILES = [
    'audio/はじまりの黄昏.mp3',             // 0: オープニング・タイトル・プロローグ
    'audio/夜明けのフロア.mp3',             // 1: ステージ1, 2
    'audio/夜明けのフロア (1).mp3',         // 2: ステージ3（氷）
    'audio/揺るがないまま突き進め.mp3',     // 3: ステージ4
    'audio/深紅の審判.mp3',                 // 4: ステージ6（ボス戦 Phase1）
    'audio/旅路の果てに揺れる光.mp3',       // 5: エンディング
    'audio/揺るがないまま突き進め (1).mp3', // 6: ステージ5
    'audio/深紅の審判 (1).mp3'              // 7: ステージ6 ラスボス Phase2（第二形態）
  ];

  // ステージインデックス → BGMインデックス（Stage 0-5 → 1,1,2,3,6,4）
  const STAGE_TO_BGM = [1, 1, 2, 3, 6, 4];

  let currentBgmIndex = -1;
  let currentAudio = null;

  function getBgmIndexForStage(stageIndex) {
    if (stageIndex < 0 || stageIndex >= STAGE_TO_BGM.length) return 1;
    return STAGE_TO_BGM[stageIndex];
  }

  function stop() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    currentBgmIndex = -1;
  }

  function unlock() {
    try {
      var a = new window.Audio();
      a.volume = 0;
      a.src = BGM_FILES[0];
      a.play().then(function() { a.pause(); a.currentTime = 0; }).catch(function() {});
    } catch (e) {}
  }

  function _play(index, loop) {
    stop();
    currentBgmIndex = index;
    if (index < 0 || index >= BGM_FILES.length) return;
    var audio = new Audio(BGM_FILES[index]);
    audio.loop = loop !== false;
    audio.volume = 0.6;
    audio.play().catch(function() {});
    currentAudio = audio;
  }

  function playOpening() {
    _play(0, true);
  }

  function playForStage(stageIndex) {
    var bgmIndex = getBgmIndexForStage(stageIndex);
    if (bgmIndex === currentBgmIndex && currentAudio && !currentAudio.paused) return;
    _play(bgmIndex, true);
  }

  function playEnding() {
    _play(5, false);
  }

  /** ボス戦用 BGM（ステージ1〜5でボス登場時、ステージ6はフィールドからこの曲） */
  const BGM_INDEX_BOSS = 4;
  function playBoss() {
    if (currentBgmIndex === BGM_INDEX_BOSS && currentAudio && !currentAudio.paused) return;
    _play(BGM_INDEX_BOSS, true);
  }

  /** ステージ6 ラスボス第二形態（Phase2）用 BGM */
  function playBossPhase2() {
    _play(7, true);
  }

  // loadLevel をラップして、ステージ読み込み後に BGM を切り替え（重複なし）
  var originalLoadLevel = window.loadLevel;
  if (typeof originalLoadLevel === 'function') {
    window.loadLevel = function(index) {
      originalLoadLevel(index);
      if (index < (window.Levels ? window.Levels.length : 6)) {
        playForStage(index);
      } else {
        stop();
      }
    };
  }

  window.BGM = {
    playOpening: playOpening,
    playForStage: playForStage,
    playEnding: playEnding,
    playBoss: playBoss,
    playBossPhase2: playBossPhase2,
    stop: stop,
    unlock: unlock
  };
})();
