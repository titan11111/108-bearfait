// ============================================================
//  Part 3: Config — キャンバス・解像度・タイル・リサイズ・モバイル判定
// ============================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BASE_W = 640, BASE_H = 400;
const TILE = 16;
/** この Y を超えると即死（穴落ち） */
const FALL_DEATH_Y = 25 * TILE + TILE * 3;

function resizeCanvas() {
  const maxW = window.innerWidth - 20;
  const maxH = window.innerHeight - 20;
  const scale = Math.min(maxW / BASE_W, maxH / BASE_H, 2);
  canvas.width = BASE_W;
  canvas.height = BASE_H;
  canvas.style.width = (BASE_W * scale) + 'px';
  canvas.style.height = (BASE_H * scale) + 'px';
}
window.resizeCanvas = resizeCanvas;
resizeCanvas();
window.addEventListener('resize', function() { (window.resizeCanvas || resizeCanvas)(); });

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
if (isMobile) {
  var mc = document.getElementById('mobileControls');
  if (mc) mc.style.display = 'flex';
}
