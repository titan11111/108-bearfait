# PIXEL QUEST（113-ベアファイト）ファイル構成

## 役割に応じた分割方針

- **ドメインルール**: 500 行を超えた場合にファイル分割を検討。
- 本ゲームはすでに役割ごとに分割済み。読み込み順が重要。

## 読み込み順と役割

| 順 | ファイル | 役割 | 行数目安 |
|---|----------|------|----------|
| 1 | config.js | キャンバス・定数（BASE_W, BASE_H, TILE, FALL_DEATH_Y）・リサイズ・モバイル表示 | 約30 |
| 2 | se.js | 効果音（Web Audio API 合成）。IIFE で `window.SE` を提供 | 約170 |
| 3 | sprites.js | スプライト生成（SpriteGen）・Assets 読み込み・タイル画像 | 約1000+ |
| 4 | levels.js | **ステージデータのみ**。Levels 配列（1〜6）と各 `generate()` | 約330 |
| 5 | input-world.js | Input（キー・タッチ）、Particle、Camera、MovingPlatform、CrumblePlatform、Game 状態 | 約230 |
| 6 | entities.js | Projectile, Player, Enemy, Boss, Coin, Potion, PowerUp | 約630 |
| 7 | collision-render.js | 当たり判定（resolveCollisions）、背景・タイル・UI 描画 | 約380 |
| 8 | story-screens.js | タイトル・プロローグ・エピローグのストーリー画面 | 約920 |
| 9 | main.js | loadLevel、画面表示（showGameOver 等）、ゲームループ、初期化・ボタン | 約255 |
| 10 | music.js | BGM（オープニング・ステージ別・エンディング）。loadLevel をラップして BGM 切替 | 約95 |
| 11 | mobile.js | モバイル専用: ダブルタップ防止・スクロール防止・音声アンロック・リサイズ・パーティクル軽減 | 約130 |

## 依存関係（要約）

- **config** → 他すべてが `canvas`, `ctx`, `BASE_W`, `BASE_H`, `TILE`, `FALL_DEATH_Y` を参照。
- **levels** → 他に依存しない。main.js が `Levels` を参照。
- **input-world** → config, sprites（Assets.tiles）, levels の後。Game 状態を保持。
- **entities** → config, input-world（Game, TILE, Particles, Camera 等）。
- **collision-render** → config, input-world, entities。`showClear`, `showGameOver` は main で定義されているため、main が後でよい。
- **main** → 上記すべて。`loadLevel`, `showGameOver` 等を定義し、ゲームループで collision-render の関数を呼ぶ。

## 今後の分割候補（500 行超）

- **entities.js**（約 630 行）: Boss クラスを `boss.js` に分離可能。Boss は Game / Projectile / Particles / Camera に依存するため、entities の直後に配置。
- **sprites.js** / **story-screens.js**: 行数は多いが、それぞれ「アセット」「ストーリー」の単一責任のため、現状のままでも可。

## プログラミング的思考での整理

- **データとロジックの分離**: レベルデータ（levels.js）と世界・入力・ゲーム状態（input-world.js）を分離済み。
- **描画と当たり判定**: 描画（drawBackground, drawTiles, drawUI）と当たり判定（resolveCollisions）は同じファイルだが、関数単位で役割が分かれている。
- **モバイル**: 操作・表示・音声アンロックは mobile.js / mobile.css に集約。
