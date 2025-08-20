#!/usr/bin/env python3
"""
数据库初始化脚本
用于创建和初始化聊天记录数据库
"""

import os
import sys
import sqlite3
from datetime import datetime

# 添加父目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.database import ChatDatabase

def init_database():
    """初始化数据库"""
    print("正在初始化聊天记录数据库...")
    
    try:
        # 创建数据库实例，这会自动创建表
        db = ChatDatabase()
        print(f"✓ 数据库已创建: {db.db_path}")
        
        # 验证表是否创建成功
        conn = sqlite3.connect(db.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        expected_tables = ['chat_sessions', 'chat_messages', 'visitor_stats']
        
        print("\n检查数据库表:")
        for table in expected_tables:
            if table in tables:
                print(f"✓ {table} 表已创建")
            else:
                print(f"✗ {table} 表创建失败")
        
        # 检查索引
        cursor.execute("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'")
        indexes = [row[0] for row in cursor.fetchall()]
        
        print(f"\n✓ 已创建 {len(indexes)} 个索引")
        
        conn.close()
        
        # 创建测试数据（可选）
        create_test_data = input("\n是否创建测试数据? (y/N): ").lower().strip()
        if create_test_data == 'y':
            create_sample_data(db)
        
        print("\n数据库初始化完成!")
        
    except Exception as e:
        print(f"数据库初始化失败: {e}")
        return False
    
    return True

def create_sample_data(db: ChatDatabase):
    """创建示例数据"""
    print("\n正在创建测试数据...")
    
    try:
        # 创建测试会话
        session1 = db.create_session("192.168.1.100", "Mozilla/5.0 Test Browser")
        session2 = db.create_session("192.168.1.101", "Chrome Test Browser")
        
        # 添加测试消息
        db.add_message(session1, "user", "你好，请问你是谁？", 8, 0.1)
        db.add_message(session1, "assistant", "你好！我是AI助手，很高兴为您服务。", 12, 1.2)
        db.add_message(session1, "user", "你能帮我做什么？", 7, 0.1)
        db.add_message(session1, "assistant", "我可以帮您回答问题、提供信息、协助解决问题等。有什么需要帮助的吗？", 18, 0.8)
        
        db.add_message(session2, "user", "今天天气怎么样？", 8, 0.1)
        db.add_message(session2, "assistant", "抱歉，我无法获取实时天气信息。建议您查看天气预报应用或网站。", 16, 1.0)
        
        # 更新统计数据
        db.update_daily_stats()
        
        print("✓ 测试数据创建完成")
        print(f"  - 创建了 2 个测试会话")
        print(f"  - 添加了 6 条测试消息")
        print(f"  - 更新了每日统计数据")
        
    except Exception as e:
        print(f"创建测试数据失败: {e}")

def check_database_status():
    """检查数据库状态"""
    print("检查数据库状态...")
    
    try:
        db = ChatDatabase()
        
        # 检查会话数量
        conn = sqlite3.connect(db.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM chat_sessions")
        session_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM chat_messages")
        message_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM visitor_stats")
        stats_count = cursor.fetchone()[0]
        
        print(f"\n数据库状态:")
        print(f"  - 会话数量: {session_count}")
        print(f"  - 消息数量: {message_count}")
        print(f"  - 统计记录: {stats_count}")
        
        # 显示最近的统计数据
        if stats_count > 0:
            stats = db.get_recent_stats(5)
            print(f"\n最近的统计数据:")
            for stat in stats:
                print(f"  {stat['date']}: {stat['total_sessions']} 会话, {stat['total_messages']} 消息")
        
        conn.close()
        
    except Exception as e:
        print(f"检查数据库状态失败: {e}")

def reset_database():
    """重置数据库"""
    confirm = input("确定要重置数据库吗？这将删除所有数据! (yes/N): ").lower().strip()
    
    if confirm != 'yes':
        print("操作已取消")
        return
    
    try:
        db = ChatDatabase()
        
        conn = sqlite3.connect(db.db_path)
        cursor = conn.cursor()
        
        # 删除所有表
        cursor.execute("DROP TABLE IF EXISTS chat_messages")
        cursor.execute("DROP TABLE IF EXISTS chat_sessions")
        cursor.execute("DROP TABLE IF EXISTS visitor_stats")
        
        conn.commit()
        conn.close()
        
        print("✓ 数据库已重置")
        
        # 重新初始化
        db.init_database()
        print("✓ 数据库已重新初始化")
        
    except Exception as e:
        print(f"重置数据库失败: {e}")

def main():
    """主函数"""
    print("=== 聊天记录数据库管理工具 ===\n")
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "init":
            init_database()
        elif command == "status":
            check_database_status()
        elif command == "reset":
            reset_database()
        else:
            print(f"未知命令: {command}")
            print("可用命令: init, status, reset")
    else:
        # 交互式菜单
        while True:
            print("\n请选择操作:")
            print("1. 初始化数据库")
            print("2. 检查数据库状态")
            print("3. 重置数据库")
            print("4. 退出")
            
            choice = input("\n请输入选择 (1-4): ").strip()
            
            if choice == "1":
                init_database()
            elif choice == "2":
                check_database_status()
            elif choice == "3":
                reset_database()
            elif choice == "4":
                print("再见!")
                break
            else:
                print("无效选择，请重新输入")

if __name__ == "__main__":
    main()
