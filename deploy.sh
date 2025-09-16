#!/bin/bash

# 部署脚本 - 构建并提交到 GitHub

echo "开始构建 Vue 应用..."

# 进入项目目录
cd vue-app

# 安装依赖（如果需要）
echo "检查依赖..."
npm install

# 构建项目
echo "构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败!"
    exit 1
fi

echo "✅ 构建成功!"

# 返回根目录
cd ..

# Git 操作
echo "准备提交到 GitHub..."

# 添加所有更改
git add .

# 提交更改
echo "请输入提交信息:"
read commit_message

if [ -z "$commit_message" ]; then
    commit_message="Update website - $(date '+%Y-%m-%d %H:%M:%S')"
fi

git commit -m "$commit_message"

# 推送到 GitHub
echo "推送到 GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "🚀 部署成功! GitHub Actions 将自动构建并部署到 https://hezhili.online"
else
    echo "❌ 推送失败!"
fi