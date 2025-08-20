#!/bin/bash

# 确保在脚本所在目录执行
cd "$(dirname "$0")"

# 停止现有的Flask进程
pkill -f "python api/app.py" || true

# 等待进程完全停止
sleep 2

# 启动Flask应用
nohup python api/app.py > ../logs/flask.log 2>&1 &

echo "Flask application started. Check logs/flask.log for details."
