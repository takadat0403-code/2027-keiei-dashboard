@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

set "WORKBOOK=data\source\2027年度_経営改革ダッシュボード_土台.xlsx"

echo.
echo ===============================================
echo  ダッシュボード データ更新
echo ===============================================
echo.

where python >nul 2>nul
if errorlevel 1 (
  echo [エラー] Python が見つかりません。
  echo Python 3.10以上をインストールしてから再実行してください。
  pause
  exit /b 1
)

if not exist "%WORKBOOK%" (
  echo [エラー] 元Excelが見つかりません。
  echo 次の場所に配置してください:
  echo %WORKBOOK%
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [エラー] npm が見つかりません。
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [1/6] Node依存関係を準備しています...
  call npm install
  if errorlevel 1 goto :fail
) else (
  echo [1/6] Node依存関係 OK
)

echo [2/6] Python依存関係を確認しています...
python -m pip install -r requirements.txt
if errorlevel 1 goto :fail

echo [3/6] Excelからデータを更新しています...
call npm run data:sync
if errorlevel 1 goto :fail

echo [4/6] テストしています...
call npm test
if errorlevel 1 goto :fail

echo [5/6] 型チェックしています...
call npm run typecheck
if errorlevel 1 goto :fail

echo [6/6] 本番ビルドを更新しています...
call npm run build
if errorlevel 1 goto :fail

echo.
echo ===============================================
echo  更新完了
echo  start-dashboard.bat から起動してください。
echo ===============================================
pause
exit /b 0

:fail
echo.
echo [エラー] データ更新を中止しました。
echo 上のメッセージを確認し、原因を修正して再実行してください。
pause
exit /b 1
