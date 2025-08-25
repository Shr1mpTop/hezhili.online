#!/bin/bash

# 快速修复API问题的脚本

echo "🔧 快速修复API问题..."

# 1. 重启后端API服务
echo "1️⃣ 重启后端API服务..."
pkill -f "python.*app.py" 2>/dev/null
sleep 2

cd /root/hezhili-website/backend/api
export ARK_API_KEY="6b7a963f-0952-4338-8e3e-29460040f0bf"
nohup python3 app.py > /var/log/hezhili-api.log 2>&1 &
echo $! > /var/run/hezhili-api.pid

echo "   等待服务启动..."
sleep 5

# 2. 检查服务是否启动
if pgrep -f "python.*app.py" > /dev/null; then
    echo "   ✅ 后端服务启动成功"
else
    echo "   ❌ 后端服务启动失败"
    echo "   📋 检查日志:"
    tail -10 /var/log/hezhili-api.log
    exit 1
fi

# 3. 测试本地API
echo "2️⃣ 测试本地API..."
if curl -s http://127.0.0.1:5000/stats | jq . > /dev/null 2>&1; then
    echo "   ✅ 本地API正常"
else
    echo "   ❌ 本地API异常"
    curl -s http://127.0.0.1:5000/stats
    exit 1
fi

# 4. 重新加载nginx
echo "3️⃣ 重新加载nginx..."
nginx -s reload
if [ $? -eq 0 ]; then
    echo "   ✅ Nginx重新加载成功"
else
    echo "   ❌ Nginx重新加载失败"
    nginx -t
    exit 1
fi

# 5. 测试生产API
echo "4️⃣ 测试生产环境API..."
sleep 3

test_prod() {
    local endpoint=$1
    response=$(curl -s -w "%{http_code}" https://hezhili.online$endpoint)
    http_code=$(echo "$response" | tail -c 4)
    content=$(echo "$response" | head -c -4)
    
    if [ "$http_code" = "200" ] && echo "$content" | jq . > /dev/null 2>&1; then
        echo "   ✅ $endpoint 正常"
        return 0
    else
        echo "   ❌ $endpoint 异常 (HTTP $http_code)"
        echo "      内容: $(echo "$content" | head -c 100)..."
        return 1
    fi
}

test_prod "/stats"
test_prod "/sessions"

echo ""
echo "🎉 修复完成！"
echo "如果问题仍然存在，请运行: ./debug_api.sh"
