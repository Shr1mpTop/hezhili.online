#!/usr/bin/env python3
"""
快速检查 SQLite 数据库可用性的脚本。
输出：
- 数据库路径
- 总会话数 / 今日会话数
- 今日统计（unique_visitors, total_sessions, total_messages, avg_duration）
- 最近 5 条会话样本（包含ID、message_count、last_activity）
- 最近 5 条消息样本
"""
import os
import sqlite3
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(ROOT, 'backend', 'data', 'chat_records.db')


def exists_and_readable(path):
    return os.path.isfile(path) and os.access(path, os.R_OK)


def run_checks(db_path=DB_PATH):
    print(f"数据库路径: {db_path}")

    if not exists_and_readable(db_path):
        print("ERROR: 数据库文件不存在或不可读。请检查路径和权限。")
        return 1

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 总会话数
    cursor.execute('SELECT COUNT(*) FROM chat_sessions')
    total_sessions = cursor.fetchone()[0]

    # 今日会话数
    today = datetime.now().strftime('%Y-%m-%d')
    cursor.execute("SELECT COUNT(*) FROM chat_sessions WHERE DATE(start_time) = ?", (today,))
    today_sessions = cursor.fetchone()[0]

    print(f"总会话数: {total_sessions}")
    print(f"今日会话数: {today_sessions}")

    # 今日统计（如果有 visitor_stats 表）
    try:
        cursor.execute("SELECT unique_visitors, total_sessions, total_messages, avg_session_duration FROM visitor_stats WHERE date = ?", (today,))
        row = cursor.fetchone()
        if row:
            print("今日统计:")
            print(f"  unique_visitors: {row[0]}")
            print(f"  total_sessions: {row[1]}")
            print(f"  total_messages: {row[2]}")
            print(f"  avg_session_duration_minutes: {row[3]}")
        else:
            print("今日统计: 未计算 (visitor_stats 中没有今天的数据)")
    except Exception as e:
        print("无法读取 visitor_stats 表: ", e)

    # 最近 5 条会话样本
    print('\n最近 5 条会话样本:')
    cursor.execute('''
        SELECT id, visitor_ip, message_count, last_activity
        FROM chat_sessions
        ORDER BY last_activity DESC
        LIMIT 5
    ''')
    rows = cursor.fetchall()
    if rows:
        for r in rows:
            print(f"- id: {r[0]}, visitor_ip: {r[1]}, message_count: {r[2]}, last_activity: {r[3]}")
    else:
        print("  没有会话数据")

    # 最近 5 条消息样本
    print('\n最近 5 条消息样本:')
    cursor.execute('''
        SELECT session_id, message_type, content, timestamp
        FROM chat_messages
        ORDER BY timestamp DESC
        LIMIT 5
    ''')
    rows = cursor.fetchall()
    if rows:
        for r in rows:
            content = r[2]
            if len(content) > 80:
                content = content[:77] + '...'
            print(f"- session_id: {r[0]}, type: {r[1]}, ts: {r[3]}, content: {content}")
    else:
        print("  没有消息数据")

    conn.close()
    return 0


if __name__ == '__main__':
    exit(run_checks())
