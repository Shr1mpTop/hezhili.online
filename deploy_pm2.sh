#!/bin/bash
# 一键用 pm2 启动 hezhili.online 前后端

# 进入脚本所在目录
cd "$(dirname "$0")"

# 启动前端（假设已 build，使用 preview 模式）
cd frontend
if [ -f package.json ]; then
  npm run build
  pm2 start npm --name hezhili-frontend -- run preview -- --host 0.0.0.0 --port 5173
else
  echo "未检测到 package.json，无法启动前端"
fi
cd ..

# 启动后端
if [ -f pyproject.toml ]; then
  pm2 start "uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000" --name hezhili-backend
else
  echo "未检测到 pyproject.toml，无法启动后端"
fi

pm2 save
echo "所有服务已用 pm2 启动。"