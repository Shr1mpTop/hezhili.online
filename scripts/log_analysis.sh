#!/bin/bash

# 何致力网站日志分析脚本
# 功能：分析访问日志、错误统计、性能分析等

WEBSITE_DIR="/root/hezhili-website"
LOG_FILE="$WEBSITE_DIR/logs/flask.log"
DB_FILE="$WEBSITE_DIR/backend/data/chat_records.db"

echo "=================================="
echo "  何致力网站日志分析报告"
echo "  分析时间: $(date)"
echo "=================================="
echo ""

# 检查日志文件是否存在
if [ ! -f "$LOG_FILE" ]; then
    echo "❌ 日志文件不存在: $LOG_FILE"
    exit 1
fi

# 获取日志文件基本信息
echo "📊 日志文件信息"
echo "文件路径: $LOG_FILE"
echo "文件大小: $(du -h "$LOG_FILE" | cut -f1)"
echo "创建时间: $(stat -c %w "$LOG_FILE" 2>/dev/null || echo "未知")"
echo "修改时间: $(stat -c %y "$LOG_FILE")"
echo "总行数: $(wc -l < "$LOG_FILE")"
echo ""

# 分析访问统计
echo "📈 访问统计 (最近24小时)"
TODAY=$(date +%Y-%m-%d)
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)

# 今日访问次数
TODAY_REQUESTS=$(grep "$TODAY" "$LOG_FILE" | grep -c "POST /chat")
YESTERDAY_REQUESTS=$(grep "$YESTERDAY" "$LOG_FILE" | grep -c "POST /chat" 2>/dev/null || echo "0")

echo "今日聊天请求: $TODAY_REQUESTS"
echo "昨日聊天请求: $YESTERDAY_REQUESTS"

if [ "$YESTERDAY_REQUESTS" -gt 0 ]; then
    CHANGE=$((TODAY_REQUESTS - YESTERDAY_REQUESTS))
    if [ "$CHANGE" -gt 0 ]; then
        echo "变化: +$CHANGE (↗️ 增长)"
    elif [ "$CHANGE" -lt 0 ]; then
        echo "变化: $CHANGE (↘️ 下降)"
    else
        echo "变化: 0 (➡️ 持平)"
    fi
fi
echo ""

# 错误统计
echo "🚨 错误统计"
ERROR_COUNT=$(grep -i "error" "$LOG_FILE" | wc -l)
WARNING_COUNT=$(grep -i "warning" "$LOG_FILE" | wc -l)
EXCEPTION_COUNT=$(grep -i "exception\|traceback" "$LOG_FILE" | wc -l)

echo "错误总数: $ERROR_COUNT"
echo "警告总数: $WARNING_COUNT"
echo "异常总数: $EXCEPTION_COUNT"

if [ "$ERROR_COUNT" -gt 0 ]; then
    echo ""
    echo "最近的错误信息:"
    grep -i "error" "$LOG_FILE" | tail -5 | sed 's/^/  /'
fi
echo ""

# HTTP状态码统计
echo "📊 HTTP状态码统计"
echo "状态码分布:"
grep -o "HTTP/1.1 [0-9][0-9][0-9]" "$LOG_FILE" | cut -d' ' -f2 | sort | uniq -c | sort -nr | head -10 | while read count code; do
    case $code in
        200) echo "  $code (成功): $count" ;;
        404) echo "  $code (未找到): $count" ;;
        500) echo "  $code (服务器错误): $count" ;;
        502) echo "  $code (网关错误): $count" ;;
        *) echo "  $code: $count" ;;
    esac
done
echo ""

# 访问模式分析
echo "⏰ 访问时间分析 (最近7天)"
echo "按小时统计访问量:"
for hour in {00..23}; do
    count=$(grep -E "[0-9]{4}-[0-9]{2}-[0-9]{2} $hour:" "$LOG_FILE" | grep "POST /chat" | wc -l)
    if [ "$count" -gt 0 ]; then
        # 创建简单的条形图
        bar=$(printf "%*s" $((count/5 + 1)) "" | tr " " "█")
        printf "  %s:00 %3d %s\n" "$hour" "$count" "$bar"
    fi
done
echo ""

# 数据库统计
if [ -f "$DB_FILE" ]; then
    echo "🗄️ 数据库统计"
    sqlite3 "$DB_FILE" "
    SELECT '会话总数: ' || COUNT(*) FROM chat_sessions
    UNION ALL
    SELECT '消息总数: ' || COUNT(*) FROM chat_messages
    UNION ALL
    SELECT '今日新会话: ' || COUNT(*) FROM chat_sessions WHERE DATE(start_time) = DATE('now')
    UNION ALL
    SELECT '今日新消息: ' || COUNT(*) FROM chat_messages WHERE DATE(timestamp) = DATE('now')
    UNION ALL
    SELECT '活跃会话: ' || COUNT(*) FROM chat_sessions WHERE status = 'active'
    UNION ALL
    SELECT '平均每会话消息数: ' || ROUND(AVG(message_count), 2) FROM chat_sessions WHERE message_count > 0;
    " | sed 's/^/  /'
    echo ""
    
    echo "📊 用户行为分析"
    echo "最活跃的IP地址:"
    sqlite3 "$DB_FILE" "
    SELECT visitor_ip, COUNT(*) as session_count, MAX(last_activity) as last_seen
    FROM chat_sessions 
    GROUP BY visitor_ip 
    ORDER BY session_count DESC 
    LIMIT 5;
    " | while IFS='|' read ip count last_seen; do
        echo "  $ip: $count 个会话 (最后活动: $last_seen)"
    done
    echo ""
    
    echo "消息类型分布:"
    sqlite3 "$DB_FILE" "
    SELECT message_type, COUNT(*) as count 
    FROM chat_messages 
    GROUP BY message_type;
    " | while IFS='|' read type count; do
        echo "  $type: $count 条"
    done
fi
echo ""

# 性能分析
echo "⚡ 性能分析"
if [ -f "$DB_FILE" ]; then
    echo "平均响应时间分析:"
    sqlite3 "$DB_FILE" "
    SELECT 
        'AI响应时间 (秒): ' || ROUND(AVG(response_time), 3) || ' (平均)'
    FROM chat_messages 
    WHERE message_type = 'assistant' AND response_time > 0
    UNION ALL
    SELECT 
        '最快响应时间: ' || ROUND(MIN(response_time), 3) || ' 秒'
    FROM chat_messages 
    WHERE message_type = 'assistant' AND response_time > 0
    UNION ALL
    SELECT 
        '最慢响应时间: ' || ROUND(MAX(response_time), 3) || ' 秒'
    FROM chat_messages 
    WHERE message_type = 'assistant' AND response_time > 0;
    " | sed 's/^/  /'
fi
echo ""

# 清理建议
echo "🧹 清理建议"
LOG_SIZE=$(du -m "$LOG_FILE" | cut -f1)
if [ "$LOG_SIZE" -gt 100 ]; then
    echo "⚠️  日志文件较大 (${LOG_SIZE}MB)，建议清理旧日志"
fi

OLD_SESSIONS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM chat_sessions WHERE datetime(start_time) < datetime('now', '-30 days');" 2>/dev/null || echo "0")
if [ "$OLD_SESSIONS" -gt 0 ]; then
    echo "⚠️  发现 $OLD_SESSIONS 个超过30天的旧会话，建议清理"
fi

INACTIVE_SESSIONS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM chat_sessions WHERE status = 'active' AND datetime(last_activity) < datetime('now', '-1 day');" 2>/dev/null || echo "0")
if [ "$INACTIVE_SESSIONS" -gt 0 ]; then
    echo "⚠️  发现 $INACTIVE_SESSIONS 个超过1天未活动的会话，建议关闭"
fi
echo ""

echo "=================================="
echo "  分析完成"
echo "=================================="
echo "💡 提示:"
echo "  - 定期运行此脚本以监控网站使用情况"
echo "  - 关注错误日志，及时发现问题"
echo "  - 定期清理旧数据，保持系统性能"
echo "  - 分析用户行为，优化用户体验"
