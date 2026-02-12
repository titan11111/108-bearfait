// ============================================================
//  game-flow.js — ゲーム進行（状態・画面遷移）の一元管理
//  役割: 状態定数・遷移の定義。main.js の gameLoop がこれを参照して制御する。
//  読み込み順: config → ... → input-world → game-flow → entities → collision-render → story-screens → main
// ============================================================

/**
 * ゲーム状態の定数（単一の真実のソース）
 * フロー: start → prologue → playing ⟷ (clear | gameover) → ... → allclear
 */
const GameStates = {
  /** タイトル画面（START ボタン待ち） */
  START: 'start',
  /** プロローグストーリー（A/タップで送り、最後で loadLevel(0) へ） */
  PROLOGUE: 'prologue',
  /** アクションプレイ中（ステージ1〜6） */
  PLAYING: 'playing',
  /** ステージクリア（NEXT で次のステージ or 全クリアでエンディングへ） */
  CLEAR: 'clear',
  /** ゲームオーバー（RETRY で同じステージ再開） */
  GAMEOVER: 'gameover',
  /** 全ステージクリア後、エピローグ再生中 */
  EPILOGUE: 'epilogue',
  /** エピローグ・スタッフロール終了後（ALL CLEAR 画面表示） */
  ALLCLEAR: 'allclear'
};

/** ステージ総数（レベルインデックスは 0 〜 TOTAL_STAGES-1） */
const TOTAL_STAGES = 6;

/**
 * ゲーム進行フロー（制御の流れ）
 * ----------------------------------------
 * [START] タイトル
 *    │ START ボタン
 *    ▼
 * [PROLOGUE] オープニングストーリー（3ページ）
 *    │ 最後のページで進む
 *    ▼
 * [PLAYING] ステージ 1 … 敵・ボス撃破 → ゴール到達
 *    │ ゴール接触 → showClear()
 *    ▼
 * [CLEAR] ステージクリア画面
 *    │ NEXT → loadLevel(currentLevel+1)
 *    │ 最終ステージ(6)なら loadLevel(6) で index>=Levels.length → [ALLCLEAR] へ
 *    ▼
 * [PLAYING] ステージ 2 〜 6 … 同様に繰り返し
 *    │ ステージ6クリア後 loadLevel(7) → showAllClear() → [EPILOGUE]
 *    ▼
 * [EPILOGUE] エンディングストーリー + スタッフロール
 *    │ 終了 or スキップ
 *    ▼
 * [ALLCLEAR] 全クリア画面（最初から → PROLOGUE へ）
 *
 * 分岐（プレイ中）:
 * [PLAYING] でプレイヤー死亡 → showGameOver() → [GAMEOVER]
 *    │ RETRY → loadLevel(currentLevel) → [PLAYING]
 * ----------------------------------------
 */

// Game オブジェクトが既に存在する前提で、状態を定数に合わせて参照しやすくする
// （input-world.js で Game が定義されているため、game-flow.js は input-world の後に読み込む）
