// ============================================================
//  Part 3: Config — キャンバス・解像度・タイル・リサイズ・モバイル判定
// ============================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BASE_W = 640, BASE_H = 400;
const TILE = 16;
/** この Y を超えると即死（穴落ち） */
const FALL_DEATH_Y = 25 * TILE + TILE * 3;

/** 表示スケール（全ステージ共通）。プレイヤー・敵・ボス・アイテムの描画・当たり判定に適用 */
const DISPLAY_SCALE = 1.5;
/** 敵タイプ別スケール補正（DISPLAY_SCALE に対する倍率）。skull=透明の骸骨, daruma=だるま, skeleton=白い骸骨 */
const ENEMY_SCALE_MODIFIER = {
  skull: 0.9,    // 透明の骸骨: 90%
  daruma: 0.8,   // だるま: 80%
  skeleton: 1.1  // 白い骸骨: 110%
};
/** ラスボス第二形態（DEMON KING）の表示スケール。当たり判定も同期 */
const BOSS_PHASE2_SCALE = 1.3;

function resizeCanvas() {
  const maxW = window.innerWidth - 10;
  const maxH = window.innerHeight - 10;
  // 上限を緩和: モバイルでは mobile.js が上書きするので、PC用は大きめに
  const scale = Math.min(maxW / BASE_W, maxH / BASE_H, 3);
  canvas.width = BASE_W;
  canvas.height = BASE_H;
  canvas.style.width = Math.floor(BASE_W * scale) + 'px';
  canvas.style.height = Math.floor(BASE_H * scale) + 'px';
}
window.resizeCanvas = resizeCanvas;
resizeCanvas();
window.addEventListener('resize', function() { (window.resizeCanvas || resizeCanvas)(); });

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
if (isMobile) {
  var mc = document.getElementById('mobileControls');
  if (mc) mc.style.display = 'flex';
}
