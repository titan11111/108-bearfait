# 携帯・iPhone 対応と GitHub でプレイする手順

**デプロイ前の抜け漏れ・携帯・稼働性・操作性の一覧は [DEPLOY-CHECKLIST.md](DEPLOY-CHECKLIST.md) を参照。**

## モバイル対応の内容

- **mobile.css** … レイアウト・セーフエリア・縦長対応・タッチボタン（最小 48px）
- **mobile.js** … ダブルタップ防止・スクロール防止・音声アンロック・リサイズ・パーティクル軽減

### 主な挙動

| 項目 | 内容 |
|------|------|
| ダブルタップ防止 | ボタン以外で 400ms 以内の 2 回タップを無効化（ズーム防止） |
| スクロール防止 | `touchmove` で `preventDefault`（ボタン・リンクは除外） |
| 音声 | 初回タップで「タップしてプレイ」オーバーレイを消し、SE/BGM をアンロック |
| 画面 | 縦長に合わせてキャンバスをリサイズ、`env(safe-area-inset-*)` でノッチ対応 |
| 操作 | 左下: 左右移動（◀ ▶）、右下: A=ジャンプ、B=攻撃 |
| パフォーマンス | モバイル時はパーティクル数を 1 回あたり最大 10 に制限 |

---

## GitHub にアップして iPhone でプレイする手順

1. **リポジトリを GitHub にプッシュ**
   ```bash
   git add .
   git commit -m "mobile: iOS/携帯対応、効果音、Sunoプロンプト"
   git push origin main
   ```

2. **GitHub Pages を有効化**
   - リポジトリの **Settings** → **Pages**
   - **Source**: Deploy from a branch
   - **Branch**: `main`（または `master`） / フォルダは **/ (root)**
   - Save

3. **iPhone でプレイ**
   - Safari で次の URL を開く（`USER` と `REPO` は自分のものに置き換え）:
     - `https://USER.github.io/REPO/113-ベアファイト/`
   - 例: リポジトリが `myuser/GitHub-game` なら  
     `https://myuser.github.io/GitHub-game/113-ベアファイト/`
   - 最初に「タップしてプレイ」と表示されたらタップしてから START

### 注意

- **音声**: iOS では「ユーザー操作のあと」でないと鳴らないため、必ず一度タップしてから START を押してください。
- **ホーム画面に追加**: Safari で **共有 → ホーム画面に追加** するとアプリのように開けます（PIXEL QUEST として追加されます）。
