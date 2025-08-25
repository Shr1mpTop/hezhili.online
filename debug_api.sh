#!/bin/bash

# API调试脚本 - 诊断生产环境API问题

echo "🔍 API调试工具"
echo "=================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo "1. 🖥️ 检查系统状态"
echo "==================="

# 检查后端服务
echo -n "后端服务状态: "
if pgrep -f "python.*app.py" > /dev/null; then
    echo -e "${GREEN}运行中${NC}"
    echo "   进程ID: $(pgrep -f 'python.*app.py')"
    echo "   运行时间: $(ps -o etime= -p $(pgrep -f 'python.*app.py') | tr -d ' ')"
else
    echo -e "${RED}未运行${NC}"
fi

# 检查端口监听
echo -n "端口5000监听状态: "
if netstat -tlnp 2>/dev/null | grep ":5000 " > /dev/null; then
    echo -e "${GREEN}正常监听${NC}"
    netstat -tlnp 2>/dev/null | grep ":5000 " | head -1
else
    echo -e "${RED}未监听${NC}"
fi

# 检查nginx状态
echo -n "Nginx服务状态: "
if systemctl is-active nginx > /dev/null 2>&1; then
    echo -e "${GREEN}运行中${NC}"
else
    echo -e "${RED}未运行${NC}"
fi

echo ""
echo "2. 🧪 测试本地API端点"
echo "======================"

test_local_api() {
    local endpoint=$1
    local name=$2
    
    echo -n "测试 $name ($endpoint): "
    
    response=$(curl -s -w "%{http_code}" --max-time 5 http://127.0.0.1:5000$endpoint 2>/dev/null)
    if [ $? -ne 0 ]; then
        echo -e "${RED}连接失败${NC}"
        return 1
    fi
    
    http_code=$(echo "$response" | tail -c 4)
    content=$(echo "$response" | head -c -4)
    
    if [ "$http_code" = "200" ]; then
        if echo "$content" | jq . > /dev/null 2>&1; then
            echo -e "${GREEN}正常 (HTTP $http_code, JSON)${NC}"
        else
            echo -e "${YELLOW}返回非JSON (HTTP $http_code)${NC}"
            echo "     内容预览: $(echo "$content" | head -c 50)..."
        fi
    else
        echo -e "${RED}错误 (HTTP $http_code)${NC}"
        echo "     响应: $(echo "$content" | head -c 100)..."
    fi
}

test_local_api "/stats" "统计接口"
test_local_api "/sessions" "会话列表"
test_local_api "/chat/history?session_id=test&limit=5" "聊天历史"

echo ""
echo "3. 🌐 测试生产环境API"
echo "======================"

test_production_api() {
    local endpoint=$1
    local name=$2
    
    echo -n "测试 $name ($endpoint): "
    
    response=$(curl -s -w "%{http_code}" --max-time 10 -H "Accept: application/json" -H "User-Agent: API-Debug-Tool" https://hezhili.online$endpoint 2>/dev/null)
    if [ $? -ne 0 ]; then
        echo -e "${RED}连接失败${NC}"
        return 1
    fi
    
    http_code=$(echo "$response" | tail -c 4)
    content=$(echo "$response" | head -c -4)
    
    if [ "$http_code" = "200" ]; then
        if echo "$content" | jq . > /dev/null 2>&1; then
            echo -e "${GREEN}正常 (HTTP $http_code, JSON)${NC}"
        else
            echo -e "${YELLOW}返回非JSON (HTTP $http_code)${NC}"
            echo "     这通常表示nginx返回了HTML页面而不是代理到API"
            echo "     内容预览: $(echo "$content" | head -c 100)..."
        fi
    else
        echo -e "${RED}错误 (HTTP $http_code)${NC}"
        echo "     响应: $(echo "$content" | head -c 200)..."
    fi
}

test_production_api "/stats" "统计接口"
test_production_api "/sessions" "会话列表"
test_production_api "/chat/history?session_id=test&limit=5" "聊天历史"

echo ""
echo "4. 📋 检查配置文件"
echo "=================="

# 检查nginx配置
echo -n "Nginx配置语法: "
if nginx -t > /dev/null 2>&1; then
    echo -e "${GREEN}正确${NC}"
else
    echo -e "${RED}错误${NC}"
    echo "     详细错误:"
    nginx -t 2>&1 | sed 's/^/     /'
fi

# 检查API路由配置
echo "Nginx API路由配置:"
if [ -f "/etc/nginx/sites-available/hezhili.online" ]; then
    grep -n "location.*/" /etc/nginx/sites-available/hezhili.online | head -10 | sed 's/^/   /'
else
    echo -e "   ${RED}配置文件不存在${NC}"
fi

echo ""
echo "5. 📊 查看最近日志"
echo "=================="

show_log() {
    local logfile=$1
    local name=$2
    local lines=${3:-5}
    
    echo "$name (最后${lines}行):"
    if [ -f "$logfile" ]; then
        tail -$lines "$logfile" 2>/dev/null | sed 's/^/   /' || echo -e "   ${YELLOW}无法读取日志${NC}"
    else
        echo -e "   ${YELLOW}日志文件不存在: $logfile${NC}"
    fi
    echo ""
}

show_log "/var/log/hezhili-api.log" "API服务日志"
show_log "/var/log/nginx/error.log" "Nginx错误日志"
show_log "/var/log/nginx/access.log" "Nginx访问日志" 3

echo "6. 💡 问题诊断建议"
echo "=================="

# 基于检查结果给出建议
if ! pgrep -f "python.*app.py" > /dev/null; then
    echo -e "${RED}• 后端API服务未运行，请启动后端服务${NC}"
fi

if ! netstat -tlnp 2>/dev/null | grep ":5000 " > /dev/null; then
    echo -e "${RED}• 端口5000未监听，检查后端服务是否正确启动${NC}"
fi

echo -e "${GREEN}• 如果生产环境API返回HTML而不是JSON，请运行修复脚本: ./deploy_fix.sh${NC}"
echo -e "${GREEN}• 查看实时日志: tail -f /var/log/hezhili-api.log${NC}"
echo -e "${GREEN}• 重启服务: systemctl restart nginx && 重启后端API${NC}"
