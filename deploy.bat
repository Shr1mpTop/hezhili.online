@echo off
chcp 65001 >nul
echo 开始构建 Vue 应用...

:: 进入项目目录
cd vue-app

:: 安装依赖
echo 检查依赖...
call npm install

:: 构建项目
echo 构建项目...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ 构建失败!
    pause
    exit /b 1
)

echo ✅ 构建成功!

:: 返回根目录
cd ..

:: Git 操作
echo 准备提交到 GitHub...

:: 添加所有更改
git add .

:: 提交更改
set /p commit_message="请输入提交信息: "

if "%commit_message%"=="" (
    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
    set commit_message=Update website - !mydate! !mytime!
)

git commit -m "%commit_message%"

:: 推送到 GitHub
echo 推送到 GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo 🚀 部署成功! GitHub Actions 将自动构建并部署到 https://hezhili.online
) else (
    echo ❌ 推送失败!
)

pause