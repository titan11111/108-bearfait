# GitHub 公開・携帯・稼働性・操作性 チェックリスト

## 1. GitHub に上げる前の抜け漏れ

- [ ] **スクリプト読み込み順**  
  `index.html` の script 順: config → se → sprites → **levels** → input-world → entities → collision-render → story-screens → main → music → mobile
- [ ] **必須ファイル**  
  index.html, style.css, mobile.css, config.js, se.js, sprites.js, levels.js, input-world.js, entities.js, collision-render.js, story-screens.js, main.js, music.js, mobile.js
- [ ] **音声ファイル**  
  `audio/` に BGM の mp3 が入っているか（はじまりの黄昏.mp3 等）
- [ ] **画像**  
  `images/` の敵・タイル等は sprites.js でコード描画フォールバックあり。不足していても動作するが、利用する画像は配置すること
- [ ] **相対パス**  
  BGM のパスは `audio/xxx.mp3`。GitHub Pages では `https://USER.github.io/REPO/113-ベアファイト/` のようにフォルダ直下で開くため、相対パスで問題なし

## 2. 携帯で操作できるか

- [ ] **viewport**  
  `index.html` に  
  `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover`
- [ ] **タッチ操作**  
  - 左下: ◀ ▶ で左右移動（KeyA/ArrowLeft, KeyD/ArrowRight にマッピング）
  - 右下: A=ジャンプ（Space）, B=攻撃（KeyZ）
- [ ] **mobile.css**  
  `@media (max-width: 768px), (pointer: coarse)` でタッチボタン表示・最小 48px（52px）・セーフエリア
- [ ] **mobile.js**  
  ダブルタップ防止・スクロール防止・音声アンロック・リサイズ・パーティクル軽減
- [ ] **touch-action**  
  body / #gameWrapper / .touch-btn に `touch-action: manipulation`（mobile.css で設定済み）

## 3. 稼働性（動くか・落ちないか）

- [ ] **音声アンロック**  
  iOS ではユーザー操作後にしか再生されないため、「タップしてプレイ」オーバーレイで初回タップ後に SE/BGM 有効化
- [ ] **BGM 重複再生防止**  
  music.js で loadLevel をラップし、ステージごとに BGM を切り替えつつ stop してから再生
- [ ] **未定義参照**  
  ブラウザコンソールにエラーが出ていないか（Assets 未読み込みは sprites.js のフォールバックで吸収）
- [ ] **リサイズ**  
  window.resize / orientationchange で `resizeCanvas` を呼ぶ（config.js + mobile.js で上書き可能）

## 4. 操作がしやすいか（UX）

- [ ] **ボタンサイズ**  
  モバイルで .touch-btn が 52px、.btn が min-height: 48px で押しやすい大きさ
- [ ] **操作説明**  
  スタート画面に「携帯: 左下で移動・右下 A=ジャンプ B=攻撃」を表示（.mobile-only）
- [ ] **縦スクロールなし**  
  1 画面に収まるよう overflow: hidden、キャンバスは scale で収める
- [ ] **RETRY / NEXT STAGE**  
  ゲームオーバー・クリア後のボタンが同じ .btn でタップしやすい

## 5. GitHub Pages でプレイする手順（確認用）

1. リポジトリを push
2. Settings → Pages → Source: Deploy from a branch → main / (root) → Save
3. プレイ URL: `https://USER.github.io/REPO/113-ベアファイト/`
4. 携帯では「タップしてプレイ」→ START の順で操作

---

**このチェックリストをデプロイ前・リリース前に一通り確認すること。**
