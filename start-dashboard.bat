@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo.
echo ===============================================
echo  2027年度 経営改革ダッシュボード
echo ===============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [エラー] Node.js が見つかりません。
  echo Node.js 20以上をインストールしてから再実行してください。
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
  echo [1/3] 初回セットアップ中...
  call npm install
  if errorlevel 1 goto :fail
)

if not exist ".next\BUILD_ID" (
  echo [2/3] ダッシュボードをビルドしています...
  call npm run build
  if errorlevel 1 goto :fail
) else (
  echo [2/3] 既存ビルドを使用します。
)

echo [3/3] ブラウザを開きます。
start "" http://localhost:3000
echo.
echo ダッシュボードを終了する場合は、この黒い画面で Ctrl+C を押してください。
echo.
call npm start
exit /b %errorlevel%

:fail
echo.
echo [エラー] 起動準備に失敗しました。上のメッセージを確認してください。
pause
exit /b 1
