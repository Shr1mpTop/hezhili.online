#!/bin/bash

# 生产环境部署和修复脚本

echo "🚀 修复生产环境API问题..."

# 检查是否在服务器上运行
if [ ! -f "/etc/nginx/nginx.conf" ]; then
    echo "❌ 此脚本需要在服务器上运行（需要nginx）"
    echo "📋 请将以下文件复制到服务器："
    echo "   - backend/config/nginx_fixed.conf"
    echo "   - 本脚本"
    exit 1
fi

# 1. 备份当前nginx配置
echo "1️⃣ 备份当前nginx配置..."
cp /etc/nginx/sites-available/hezhili.online /etc/nginx/sites-available/hezhili.online.backup.$(date +%Y%m%d_%H%M%S)
echo "   ✅ 已备份到 hezhili.online.backup.$(date +%Y%m%d_%H%M%S)"

# 2. 复制新的nginx配置
echo "2️⃣ 更新nginx配置..."
if [ -f "./nginx_fixed.conf" ]; then
    cp ./nginx_fixed.conf /etc/nginx/sites-available/hezhili.online
    echo "   ✅ 已更新nginx配置"
else
    echo "   ❌ 找不到nginx_fixed.conf文件"
    exit 1
fi

# 3. 测试nginx配置
echo "3️⃣ 测试nginx配置..."
nginx -t
if [ $? -ne 0 ]; then
    echo "   ❌ Nginx配置测试失败，恢复备份..."
    cp /etc/nginx/sites-available/hezhili.online.backup.$(date +%Y%m%d_%H%M%S) /etc/nginx/sites-available/hezhili.online
    exit 1
fi
echo "   ✅ Nginx配置测试通过"

# 4. 检查后端API服务状态
echo "4️⃣ 检查后端API服务..."
if pgrep -f "python.*app.py" > /dev/null; then
    echo "   ✅ 后端服务正在运行"
    API_PID=$(pgrep -f "python.*app.py")
    echo "   📝 进程ID: $API_PID"
else
    echo "   ⚠️ 后端服务未运行，尝试启动..."
    cd /root/hezhili-website/backend/api
    nohup python3 app.py > /var/log/hezhili-api.log 2>&1 &
    echo $! > /var/run/hezhili-api.pid
    sleep 3
    if pgrep -f "python.*app.py" > /dev/null; then
        echo "   ✅ 后端服务启动成功"
    else
        echo "   ❌ 后端服务启动失败，请检查日志"
        tail -10 /var/log/hezhili-api.log
        exit 1
    fi
fi

# 5. 测试本地API
echo "5️⃣ 测试本地API端点..."
test_local_api() {
    local endpoint=$1
    local name=$2
    
    response=$(curl -s -w "%{http_code}" http://127.0.0.1:5000$endpoint)
    http_code=$(echo "$response" | tail -c 4)
    content=$(echo "$response" | head -c -4)
    
    if [ "$http_code" = "200" ]; then
        echo "   ✅ $name API正常 (HTTP $http_code)"
        return 0
    else
        echo "   ❌ $name API异常 (HTTP $http_code)"
        echo "      响应: $content"
        return 1
    fi
}

test_local_api "/stats" "统计"
test_local_api "/sessions" "会话列表"

# 6. 重新加载nginx
echo "6️⃣ 重新加载nginx..."
nginx -s reload
if [ $? -eq 0 ]; then
    echo "   ✅ Nginx重新加载成功"
else
    echo "   ❌ Nginx重新加载失败"
    exit 1
fi

# 7. 等待nginx生效
echo "7️⃣ 等待服务生效..."
sleep 3

# 8. 测试生产环境API
echo "8️⃣ 测试生产环境API..."
test_production_api() {
    local endpoint=$1
    local name=$2
    
    response=$(curl -s -w "%{http_code}" -H "Accept: application/json" https://hezhili.online$endpoint)
    http_code=$(echo "$response" | tail -c 4)
    content=$(echo "$response" | head -c -4)
    
    if [ "$http_code" = "200" ]; then
        # 检查是否返回JSON格式
        if echo "$content" | jq . > /dev/null 2>&1; then
            echo "   ✅ $name API正常 (HTTP $http_code, JSON格式)"
            return 0
        else
            echo "   ⚠️ $name API返回非JSON格式 (HTTP $http_code)"
            echo "      内容: $(echo "$content" | head -c 100)..."
            return 1
        fi
    else
        echo "   ❌ $name API异常 (HTTP $http_code)"
        echo "      响应: $(echo "$content" | head -c 200)..."
        return 1
    fi
}

test_production_api "/stats" "统计"
test_production_api "/sessions" "会话列表"

# 9. 显示服务状态
echo ""
echo "🎉 部署完成！"
echo "=================="
echo "📊 服务状态:"
echo "   • 后端API: http://127.0.0.1:5000"
echo "   • 生产网站: https://hezhili.online"
echo "   • 管理页面: https://hezhili.online/pages/admin.html"
echo ""
echo "📝 日志文件:"
echo "   • API服务日志: /var/log/hezhili-api.log"
echo "   • Nginx访问日志: /var/log/nginx/access.log"
echo "   • Nginx错误日志: /var/log/nginx/error.log"
echo ""
echo "🔧 如果还有问题，请检查:"
echo "   1. 后端服务是否正常运行: ps aux | grep python"
echo "   2. 端口是否被正确监听: netstat -tlnp | grep 5000"
echo "   3. 防火墙设置: ufw status"
echo "   4. API服务日志: tail -f /var/log/hezhili-api.log"
