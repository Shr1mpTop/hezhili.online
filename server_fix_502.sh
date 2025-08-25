#!/bin/bash

echo "🚀 快速修复 502 Bad Gateway"
echo "=================================="

# 检查并修复常见的 502 问题

echo "1️⃣ 停止可能的旧进程..."
sudo pkill -f "app.py" 2>/dev/null || true
sudo pkill -f "gunicorn.*hezhili" 2>/dev/null || true

echo ""
echo "2️⃣ 启动后端服务 (端口 5001)..."
cd /root/hezhili-website/backend/api

# 设置环境变量
export ARK_API_KEY="6b7a963f-0952-4338-8e3e-29460040f0bf"
export FLASK_ENV=production

# 启动方式 1: 直接用 Flask (监听 5001 端口)
echo "启动 Flask 应用 (端口 5001)..."
nohup python3 -c "
import sys
sys.path.append('/root/hezhili-website/backend')
from api.app import app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)
" > /var/log/hezhili-backend.log 2>&1 &

backend_pid=$!
echo "后端进程 PID: $backend_pid"
echo "$backend_pid" > /tmp/hezhili-backend.pid

echo ""
echo "3️⃣ 等待服务启动..."
sleep 5

echo ""
echo "4️⃣ 测试后端连接..."
if curl -s http://127.0.0.1:5001/stats > /dev/null; then
    echo "✅ 后端服务启动成功"
    echo "测试响应:"
    curl -s http://127.0.0.1:5001/stats | head -c 200
    echo ""
else
    echo "❌ 后端服务启动失败"
    echo "查看日志:"
    tail -n 20 /var/log/hezhili-backend.log
    exit 1
fi

echo ""
echo "5️⃣ 检查 nginx 配置..."
nginx_config="/etc/nginx/sites-available/default"
if [ -f "$nginx_config" ]; then
    echo "检查当前 nginx 配置中的 proxy_pass..."
    sudo grep -n "proxy_pass.*127.0.0.1" "$nginx_config" || echo "未找到 proxy_pass 配置"
    
    # 检查是否指向正确的端口 5001
    if sudo grep -q "proxy_pass.*127.0.0.1:5001" "$nginx_config"; then
        echo "✅ nginx 已配置为代理到端口 5001"
    elif sudo grep -q "proxy_pass.*127.0.0.1:5000" "$nginx_config"; then
        echo "⚠️ nginx 配置为代理到端口 5000，需要更新为 5001"
        echo "运行以下命令修复:"
        echo "sudo sed -i 's/127.0.0.1:5000/127.0.0.1:5001/g' $nginx_config"
        echo "sudo nginx -t && sudo systemctl reload nginx"
    else
        echo "❌ 未找到 proxy_pass 配置"
    fi
fi

echo ""
echo "6️⃣ 重新加载 nginx..."
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo "✅ nginx 重新加载成功"
else
    echo "❌ nginx 配置有错误"
    exit 1
fi

echo ""
echo "7️⃣ 最终测试..."
sleep 2
echo "测试外部访问 /stats:"
if curl -s https://hezhili.online/stats > /dev/null; then
    echo "✅ 外部 API 访问正常"
else
    echo "⚠️ 外部 API 访问可能仍有问题，检查 nginx 配置"
fi

echo ""
echo "🎉 修复完成！"
echo "📝 后端日志: tail -f /var/log/hezhili-backend.log"
echo "📝 nginx 日志: sudo tail -f /var/log/nginx/error.log"
echo "🛑 停止后端: kill \$(cat /tmp/hezhili-backend.pid)"
