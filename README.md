# 2027年度 経営改革ダッシュボード

札幌カントリー倶楽部の2027年度経営改革を、経営会議で横断管理するWebダッシュボードです。現在は **Phase A: 社内PC運用版** です。画面側はB（Web閲覧）→C（Web編集・DB）へ移行できるよう、データ取得をRepositoryで分離しています。

## まず使う — Windows社内PC

1. このリポジトリをPCへ配置します。
2. `start-dashboard.bat` をダブルクリックします。
3. ブラウザで `http://localhost:3000` が開けば利用開始です。

初回だけ `npm install` と本番ビルドを自動実行します。2回目以降は既存ビルドを使います。

### Excelを更新したとき

元Excelを次の場所へ配置します。

```text
data/source/2027年度_経営改革ダッシュボード_土台.xlsx
```

Excel修正後に `update-data.bat` をダブルクリックしてください。

```text
Excel → dashboard.json → test → typecheck → build
```

まで一括実行し、途中で問題があれば更新を停止します。元Excelがまだ無い場合でも、リポジトリに登録済みの `src/data/dashboard.json` で現在のダッシュボードは起動できます。

## 経営Dashboardで最初に見る場所

1. 今日確認すべきこと — 期限超過、7日以内、未入力領域、データ鮮度
2. データ準備状況 — 予約、売上、コース品質、労務、料金、投資、責任者
3. 経営KPI — 実績が無い値は0ではなく「未入力」
4. 3コース状況 — 真駒内CC・滝のCC・羊ヶ丘CC
5. 要対応アクション / DX進捗
6. 2027料金戦略
7. 設備投資・ROI

## 画�6

- `/` 経営Dashboard
- `/revenue` 料金・収益
- `/course-quality` コース品質
- `/workforce` 労務・生産性
- `/dx` DX・CRM
- `/roi` 投資ROI
- `/actions` アクション管理

料金・収益とアクション管理は、表示中データをExcelで開きやすいUTF-8 BOM付きCSVへ出力できます。画面右上の「印刷」は経営会議用レイアウトを使用します。

## データ方針

資料に存在しない実績値は作りません。実績売上・人数・平均単価、販売可能枠・予約済枠・予約率、コース品質実測値、労務・残業実績、滝のCC基準料金、未見積の設備投資額は、入力されるまで `null` を保持し、画面では「未入力」「未設定」と表示します。

## A → B → C の構造

```text
UI / Domain
   ↓
DashboardRepository
   ├─ Phase A: StaticDashboardRepository（JSON / Excel生成）
   ├─ Phase B: CloudRepository（Web閲覧・認証）
   └─ Phase C: DatabaseRepository（DB・編集・履歴・権限）
```

Phase B/Cでページを作り直さず、主にRepositoryと認証・保存層を差し替える前提です。

## 開発環境

- Node.js 20以上
- npm
- Python 3.10以上
- openpyxl

手動起動:

```bash
npm install
npm run build
npm start
```

開発モード:

```bash
npm run dev
```

検証:

```bash
npm test
npm run typecheck
npm run build
```

Excel同期:

```bash
pip install -r requirements.txt
npm run data:sync
```

## 価格判定ロジック

会議資料上の例示ロジックを初期値として保持しています。

- 予約率50%未満: 割引検討
- 50%以上80%未満: 基本販売
- 80%以上90%未満: 割引停止
- 90%以上: プレミアム価格検討

最終運用ルール確定後は、元ExcelのMasterを変更して再同期します。

## 設計・実装資料

- `docs/superpowers/specs/2026-09-18-operational-dashboard-a-design.md`
- `docs/superpowers/plans/2026-09-18-operational-dashboard-a.md`

## 次段階

Phase Bではホスティング・認証・CloudRepositoryを追加します。Phase CではDB、ブラウザ編集、更新履歴、権限、承認フローを追加します。ジョブカン、IGS、CRM等の連携も同じDashboardData契約に合わせてアダプタ化する方針です。
