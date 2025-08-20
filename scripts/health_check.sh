#!/bin/bash

# 何致力网站健康检查脚本
# 功能：检查服务状态、系统资源、数据库状态等

WEBSITE_DIR="/root/hezhili-website"
DB_FILE="$WEBSITE_DIR/backend/data/chat_records.db"
LOG_FILE="$WEBSITE_DIR/logs/flask.log"

echo "=================================="
echo "  何致力网站健康检查报告"
echo "  检查时间: $(date)"
echo "=================================="
echo ""

# 检查Flask服务状态
echo "🔍 检查Flask服务状态..."
if pgrep -f "python.*app.py" > /dev/null; then
    PID=$(pgrep -f "python.*app.py")
    echo "✅ Flask服务运行正常 (PID: $PID)"
    
    # 显示进程信息
    echo "   进程信息: $(ps -p $PID -o pid,ppid,cmd --no-headers)"
    echo "   运行时间: $(ps -p $PID -o etime --no-headers | tr -d ' ')"
else
    echo "❌ Flask服务未运行"
    echo "   建议执行: cd $WEBSITE_DIR/backend && ./start.sh"
fi
echo ""

# 检查端口状态
echo "🔍 检查端口状态..."
if netstat -tuln | grep -q ":5000"; then
    echo "✅ 端口5000正在监听"
else
    echo "❌ 端口5000未监听"
fi
echo ""

# 检查数据库状态
echo "🔍 检查数据库状态..."
if [ -f "$DB_FILE" ]; then
    echo "✅ 数据库文件存在"
    echo "   文件大小: $(du -h "$DB_FILE" | cut -f1)"
    echo "   最后修改: $(stat -c %y "$DB_FILE")"
    
    # 检查数据库完整性
    if sqlite3 "$DB_FILE" "PRAGMA integrity_check;" | grep -q "ok"; then
        echo "✅ 数据库完整性检查通过"
    else
        echo "❌ 数据库完整性检查失败"
    fi
    
    # 显示数据统计
    echo "   数据统计:"
    sqlite3 "$DB_FILE" "
    SELECT 
        '     会话数量: ' || COUNT(*) FROM chat_sessions
    UNION ALL
    SELECT 
        '     消息数量: ' || COUNT(*) FROM chat_messages
    UNION ALL
    SELECT 
        '     统计记录: ' || COUNT(*) FROM visitor_stats;
    "
else
    echo "❌ 数据库文件不存在: $DB_FILE"
    echo "   建议执行: cd $WEBSITE_DIR/backend && python3 scripts/init_db.py"
fi
echo ""

# 检查API接口
echo "🔍 检查API接口..."
if curl -s --max-time 5 http://127.0.0.1:5000/stats > /dev/null 2>&1; then
    echo "✅ API接口响应正常"
else
    echo "❌ API接口无响应"
    echo "   建议检查Flask服务和网络连接"
fi
echo ""

# 检查环境变量
echo "🔍 检查环境变量..."
if [ -n "$ARK_API_KEY" ]; then
    echo "✅ ARK_API_KEY已设置"
    echo "   密钥前缀: $(echo $ARK_API_KEY | head -c 10)..."
else
    echo "❌ ARK_API_KEY未设置"
    echo "   请设置环境变量: export ARK_API_KEY=your_api_key"
fi
echo ""

# 检查系统资源
echo "🔍 检查系统资源..."
echo "   CPU使用率: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"

MEMORY_INFO=$(free -h | grep "Mem:")
MEMORY_USED=$(echo $MEMORY_INFO | awk '{print $3}')
MEMORY_TOTAL=$(echo $MEMORY_INFO | awk '{print $2}')
MEMORY_PERCENT=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
echo "   内存使用: $MEMORY_USED/$MEMORY_TOTAL (${MEMORY_PERCENT}%)"

DISK_INFO=$(df -h / | tail -1)
DISK_USED=$(echo $DISK_INFO | awk '{print $3}')
DISK_TOTAL=$(echo $DISK_INFO | awk '{print $2}')
DISK_PERCENT=$(echo $DISK_INFO | awk '{print $5}')
echo "   磁盘使用: $DISK_USED/$DISK_TOTAL ($DISK_PERCENT)"

# 内存使用警告
if (( $(echo "$MEMORY_PERCENT > 80" | bc -l) )); then
    echo "⚠️  内存使用率超过80%，建议关注"
fi

# 磁盘使用警告
DISK_NUM=$(echo $DISK_PERCENT | tr -d '%')
if [ "$DISK_NUM" -gt 80 ]; then
    echo "⚠️  磁盘使用率超过80%，建议清理"
fi
echo ""

# 检查日志文件
echo "🔍 检查日志状态..."
if [ -f "$LOG_FILE" ]; then
    echo "✅ 日志文件存在"
    echo "   文件大小: $(du -h "$LOG_FILE" | cut -f1)"
    echo "   最后修改: $(stat -c %y "$LOG_FILE")"
    
    # 检查最近的错误
    ERROR_COUNT=$(grep -c -i "error" "$LOG_FILE" 2>/dev/null || echo "0")
    echo "   错误数量: $ERROR_COUNT"
    
    if [ "$ERROR_COUNT" -gt 0 ]; then
        echo "   最近错误:"
        tail -20 "$LOG_FILE" | grep -i "error" | tail -3 | sed 's/^/     /'
    fi
else
    echo "❌ 日志文件不存在: $LOG_FILE"
fi
echo ""

# 检查网络连接
echo "🔍 检查外部服务连接..."
if curl -s --max-time 5 https://ark.cn-beijing.volces.com > /dev/null 2>&1; then
    echo "✅ ARK API服务连接正常"
else
    echo "❌ ARK API服务连接失败"
    echo "   请检查网络连接和防火墙设置"
fi
echo ""

# 总结
echo "=================================="
echo "  健康检查完成"
echo "=================================="

# 生成简单的健康评分
SCORE=0
pgrep -f "python.*app.py" > /dev/null && SCORE=$((SCORE + 20))
[ -f "$DB_FILE" ] && SCORE=$((SCORE + 20))
netstat -tuln | grep -q ":5000" && SCORE=$((SCORE + 20))
[ -n "$ARK_API_KEY" ] && SCORE=$((SCORE + 20))
curl -s --max-time 5 http://127.0.0.1:5000/stats > /dev/null 2>&1 && SCORE=$((SCORE + 20))

echo "健康评分: $SCORE/100"

if [ "$SCORE" -ge 80 ]; then
    echo "状态: 🟢 健康"
elif [ "$SCORE" -ge 60 ]; then
    echo "状态: 🟡 需要关注"
else
    echo "状态: 🔴 需要修复"
fi

echo ""
echo "建议定期运行此脚本以监控网站状态"
echo "如需帮助，请查看 MAINTENANCE_GUIDE.md"
