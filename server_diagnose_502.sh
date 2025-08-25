#!/bin/bash

echo "🔍 502 Bad Gateway 诊断工具"
echo "=========================================="

# 1. 检查 nginx 错误日志
echo "1️⃣ 检查 nginx 错误日志 (最近 50 行):"
echo "----------------------------------------"
if [ -f /var/log/nginx/error.log ]; then
    echo "最近的错误:"
    sudo tail -n 50 /var/log/nginx/error.log | grep -E "(502|Bad Gateway|upstream|connection)" | tail -n 10
    echo ""
    echo "所有最近错误:"
    sudo tail -n 20 /var/log/nginx/error.log
else
    echo "❌ nginx 错误日志文件不存在"
fi

echo ""
echo "2️⃣ 检查后端服务进程:"
echo "----------------------------------------"
backend_pids=$(ps aux | grep -E '(app\.py|gunicorn|flask)' | grep -v grep)
if [ -z "$backend_pids" ]; then
    echo "❌ 未找到后端进程 (app.py/gunicorn/flask)"
else
    echo "✅ 后端进程:"
    echo "$backend_pids"
fi

echo ""
echo "3️⃣ 检查端口监听状态:"
echo "----------------------------------------"
echo "检查 5001 端口:"
if sudo ss -ltnp | grep ":5001 "; then
    echo "✅ 5001 端口有进程监听" 
else
    echo "❌ 5001 端口无进程监听"
fi

echo "检查 5000 端口:"
if sudo ss -ltnp | grep ":5000 "; then
    echo "✅ 5000 端口有进程监听"
else
    echo "❌ 5000 端口无进程监听"
fi

echo ""
echo "4️⃣ 测试本地后端连接:"
echo "----------------------------------------"
echo "测试 127.0.0.1:5001/stats (主要端口):"
if curl -s -m 5 http://127.0.0.1:5001/stats > /dev/null 2>&1; then
    echo "✅ 5001 端口可连接"
    echo "响应内容:"
    curl -s -m 5 http://127.0.0.1:5001/stats | head -c 200
    echo ""
else
    echo "❌ 5001 端口连接失败"
    curl -v -m 5 http://127.0.0.1:5001/stats 2>&1 | head -n 10
fi

echo ""
echo "测试 127.0.0.1:5000/stats (备用检查):"
if curl -s -m 5 http://127.0.0.1:5000/stats > /dev/null 2>&1; then
    echo "✅ 5000 端口可连接"
    echo "响应内容:"
    curl -s -m 5 http://127.0.0.1:5000/stats | head -c 200
    echo ""
else
    echo "❌ 5000 端口连接失败"
    curl -v -m 5 http://127.0.0.1:5000/stats 2>&1 | head -n 10
fi

echo ""
echo "5️⃣ 检查 nginx 配置中的 proxy_pass:"
echo "----------------------------------------"
if [ -f /etc/nginx/sites-available/default ]; then
    echo "检查默认 nginx 配置:"
    sudo grep -n "proxy_pass" /etc/nginx/sites-available/default 2>/dev/null || echo "未找到 proxy_pass"
fi

if [ -f /etc/nginx/nginx.conf ]; then
    echo "检查主 nginx 配置:"
    sudo grep -n "proxy_pass" /etc/nginx/nginx.conf 2>/dev/null || echo "未找到 proxy_pass"
fi

# 检查项目中的 nginx 配置
project_nginx="/root/hezhili-website/backend/config/nginx.conf"
if [ -f "$project_nginx" ]; then
    echo "检查项目 nginx 配置:"
    grep -n "proxy_pass" "$project_nginx" 2>/dev/null || echo "未找到 proxy_pass"
fi

echo ""
echo "6️⃣ 测试 /chat POST 请求:"
echo "----------------------------------------"
echo "测试 127.0.0.1:5001/chat (主要端口):"
chat_response=$(curl -s -w "%{http_code}" -H "Content-Type: application/json" -d '{"text":"test","session_id":null}' http://127.0.0.1:5001/chat 2>/dev/null)
http_code=$(echo "$chat_response" | tail -c 4)
response_body=$(echo "$chat_response" | head -c -4)

if [ "$http_code" = "200" ]; then
    echo "✅ /chat API 返回 200"
    echo "响应内容: $(echo "$response_body" | head -c 100)..."
elif [ -z "$http_code" ]; then
    echo "❌ /chat API 连接失败"
else
    echo "❌ /chat API 返回 HTTP $http_code"
    echo "响应内容: $response_body"
fi

echo ""
echo "测试 127.0.0.1:5000/chat (备用检查):"
chat_response=$(curl -s -w "%{http_code}" -H "Content-Type: application/json" -d '{"text":"test","session_id":null}' http://127.0.0.1:5000/chat 2>/dev/null)
http_code=$(echo "$chat_response" | tail -c 4)
response_body=$(echo "$chat_response" | head -c -4)

if [ "$http_code" = "200" ]; then
    echo "✅ /chat API 返回 200"
    echo "响应内容: $(echo "$response_body" | head -c 100)..."
elif [ -z "$http_code" ]; then
    echo "❌ /chat API 连接失败"
else
    echo "❌ /chat API 返回 HTTP $http_code"
    echo "响应内容: $response_body"
fi

echo ""
echo "7️⃣ 总结和建议:"
echo "----------------------------------------"
echo "请检查以上输出，并根据以下情况进行修复:"
echo ""
echo "🔧 常见修复方案:"
echo "1. 如果后端未运行: 启动后端服务"
echo "2. 如果后端在 5001 但 nginx proxy_pass 指向 5000: 修改 nginx 配置指向 5001"
echo "3. 如果后端在 5000 但应该在 5001: 检查后端配置"
echo "4. 如果 API 返回非 200: 检查后端日志和 API key 配置"
echo ""
echo "📋 下一步操作:"
echo "- 查看完整的 nginx 错误日志: sudo tail -f /var/log/nginx/error.log"
echo "- 查看后端日志: sudo journalctl -u your-backend-service -f"
echo "- 重启 nginx: sudo systemctl reload nginx"
