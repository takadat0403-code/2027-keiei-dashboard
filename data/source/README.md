# 元Excel配置先

Phase Aでは `2027年度_経営改革ダッシュボード_土台.xlsx` をこのフォルダに配置します。

配置後、Windowsではリポジトリ直下の `update-data.bat` を実行すると、JSON生成・テスト・型チェック・本番ビルドまで一括実行します。

元Excelが未配置でも、コミット済みの `src/data/dashboard.json` でダッシュボードは起動できます。
