# 2027年度 経営改革ダッシュボード

札幌カントリー倶楽部の2027年度経営改革を、経営会議で横断管理するためのWebダッシュボードです。

料金・収益、コース品質、労務・生産性、DX/CRM、投資ROI、アクション管理を1つのUIに統合しています。初期データは `2027年度_経営改革ダッシュボード_土台.xlsx` から生成します。

## 画面

- `/` 経営Dashboard
- `/revenue` 料金・収益
- `/course-quality` コース品質
- `/workforce` 労務・生産性
- `/dx` DX・CRM
- `/roi` 投資ROI
- `/actions` アクション管理

## 重要なデータ方針

このリポジトリは、資料に存在しない実績値を仮データで補完しません。

現時点で以下は未入力として扱います。

- 実績売上、実績人数、実績平均単価
- 販売可能枠、予約済枠、予約率
- コース品質の実測値
- 労務・残業の実績値
- 滝のCCの基準料金
- 一部設備投資額・ROI入力

そのため、トップKPIも該当データがない場合は `0` ではなく `未入力` と表示します。

## 開発環境

- Node.js 20以上推奨
- npm
- Python 3.10以上
- Python package: `openpyxl` (`pip install -r requirements.txt`)

## 起動

```bash
pip install -r requirements.txt
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## Excelからデータを更新

元Excelは以下に配置しています。

```text
data/source/2027年度_経営改革ダッシュボード_土台.xlsx
```

Excelを更新後、JSONを再生成します。

```bash
npm run data:sync
```

生成先:

```text
src/data/dashboard.json
```

その後、テストとビルドを実行してください。

```bash
npm test
npm run typecheck
npm run build
```

## GitHubへ投入する場合

このフォルダをリポジトリのルートとして使用できます。

```bash
git init
git add .
git commit -m "feat: add 2027 executive dashboard foundation"
git branch -M main
git remote add origin <YOUR_REPOSITORY_URL>
git push -u origin main
```

すでに空のGitHubリポジトリがある場合は、ファイル一式をそのリポジトリへコピーしてコミットしてください。

## データ構造

`src/data/dashboard.json` は以下の領域に分かれます。

- `meta`: データ基準日、対象年度
- `master`: 予約率判定、利用税、年会費等の経営前提
- `prices`: コース別基準価格・ポジショニング
- `revenue`: 月別料金・収益管理
- `courseQuality`: コース品質測定
- `workforce`: 労務・生産性
- `dx`: DX/CRM施策
- `investments`: 投資ROI
- `actions`: 会議横断アクション
- `kpis`: KGI/KPI定義

UIはこのJSONだけを参照しています。将来、ジョブカンAPI、IGS、CRM等へ接続するときは、このデータ契約に合わせてアダプタを追加する方針です。

## 主要な価格判定ロジック

Excel会議資料の初期ロジックを保持しています。

- 予約率50%未満: 割引検討
- 50%以上80%未満: 基本販売
- 80%以上90%未満: 割引停止
- 90%以上: プレミアム価格検討

これは会議資料上の例示ルールであり、最終運用ルール確定後に `Master` / JSONの閾値を変更してください。

## 設計資料

- `docs/superpowers/specs/2026-09-18-executive-dashboard-design.md`
- `docs/superpowers/plans/2026-09-18-executive-dashboard.md`

## 次の拡張候補

1. ジョブカンAPI連携
2. IGS予約・来場データ取込
3. 料金変更シミュレーター
4. コース品質時系列グラフ
5. 予算・設備投資承認フロー
6. 認証・権限管理
7. DB化と更新履歴
