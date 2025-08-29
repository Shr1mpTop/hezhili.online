#!/bin/bash

echo "🔧 快速修复502错误..."

echo ""
echo "📋 1. 停止所有可能的Flask进程..."
# 强制停止所有Python Flask进程
pkill -9 -f "python.*app.py" || true
pkill -9 -f "python3.*app.py" || true
sleep 2

echo ""
echo "📋 2. 检查并释放端口..."
# 检查并释放5001端口
port_check=$(sudo lsof -iTCP -sTCP:LISTEN -P | grep 5001 || echo "端口已释放")
if echo "$port_check" | grep -q "5001"; then
    echo "释放端口5001..."
    sudo fuser -k 5001/tcp || true
    sleep 2
fi

echo ""
echo "📋 3. 启动Flask应用..."
cd /root/hezhili-website/backend/api

# 设置环境变量
export ARK_API_KEY="6b7a963f-0952-4338-8e3e-29460040f0bf"
export FLASK_ENV=production

# 启动Flask应用
echo "启动Flask应用在端口5001..."
nohup python3 app.py > /var/log/hezhili-backend.log 2>&1 &
flask_pid=$!

# 等待应用启动
echo "等待Flask应用启动..."
sleep 5

# 检查进程是否启动成功
if kill -0 $flask_pid 2>/dev/null; then
    echo "✅ Flask应用已启动 (PID: $flask_pid)"
else
    echo "❌ Flask应用启动失败"
    echo "错误日志:"
    cat /var/log/hezhili-backend.log
    exit 1
fi

echo ""
echo "📋 4. 测试后端连接..."
sleep 3
backend_test=$(curl -s -w "%{http_code}" http://127.0.0.1:5001/ -o /tmp/backend_test.txt)
if [ "$backend_test" = "404" ] || [ "$backend_test" = "200" ]; then
    echo "✅ 后端连接正常 (HTTP $backend_test)"
else
    echo "❌ 后端连接失败 (HTTP $backend_test)"
    echo "响应内容: $(cat /tmp/backend_test.txt)"
fi

echo ""
echo "📋 5. 重新加载nginx配置..."
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo nginx -s reload
    echo "✅ nginx配置重新加载成功"
else
    echo "❌ nginx配置有问题"
    sudo nginx -t
fi

echo ""
echo "📋 6. 测试API端点..."
echo "测试聊天API:"
chat_test=$(curl -s -w "%{http_code}" -X POST https://www.hezhili.online/chat \
    -H "Content-Type: application/json" \
    -d '{"text": "测试", "session_id": "test"}' \
    -o /tmp/chat_test.json)

if [ "$chat_test" = "200" ]; then
    echo "✅ 聊天API测试成功 (HTTP $chat_test)"
else
    echo "❌ 聊天API测试失败 (HTTP $chat_test)"
    echo "响应内容: $(cat /tmp/chat_test.json)"
fi

echo ""
echo "📋 7. 清理临时文件..."
rm -f /tmp/backend_test.txt /tmp/chat_test.json

echo ""
echo "🎉 修复脚本执行完成！"
echo "Flask进程ID: $flask_pid"
echo "如果问题仍然存在，请运行诊断脚本获取更多信息。"
