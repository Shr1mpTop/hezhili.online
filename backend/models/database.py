import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Optional
import uuid

class ChatDatabase:
    def __init__(self, db_path: str = None):
        if db_path is None:
            # 默认数据库路径
            current_dir = os.path.dirname(os.path.abspath(__file__))
            db_path = os.path.join(current_dir, '..', 'data', 'chat_records.db')
        
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """初始化数据库表"""
        # 确保数据目录存在
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 创建聊天会话表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_sessions (
                id TEXT PRIMARY KEY,
                visitor_ip TEXT NOT NULL,
                user_agent TEXT,
                start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                message_count INTEGER DEFAULT 0,
                status TEXT DEFAULT 'active'
            )
        ''')
        
        # 创建消息记录表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant')),
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                token_count INTEGER DEFAULT 0,
                response_time REAL DEFAULT 0,
                FOREIGN KEY (session_id) REFERENCES chat_sessions (id)
            )
        ''')
        
        # 创建访客统计表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS visitor_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE NOT NULL,
                unique_visitors INTEGER DEFAULT 0,
                total_sessions INTEGER DEFAULT 0,
                total_messages INTEGER DEFAULT 0,
                avg_session_duration REAL DEFAULT 0,
                UNIQUE(date)
            )
        ''')
        
        # 创建索引以提高查询性能
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_session_ip ON chat_sessions(visitor_ip)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_message_session ON chat_messages(session_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_message_timestamp ON chat_messages(timestamp)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_stats_date ON visitor_stats(date)')
        
        conn.commit()
        conn.close()
    
    def create_session(self, visitor_ip: str, user_agent: str = None) -> str:
        """创建新的聊天会话"""
        session_id = str(uuid.uuid4())
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO chat_sessions (id, visitor_ip, user_agent)
            VALUES (?, ?, ?)
        ''', (session_id, visitor_ip, user_agent))
        
        conn.commit()
        conn.close()
        
        return session_id
    
    def get_or_create_session(self, visitor_ip: str, user_agent: str = None, session_id: str = None) -> str:
        """获取或创建聊天会话"""
        if session_id:
            # 验证会话是否存在且属于该IP
            if self.validate_session(session_id, visitor_ip):
                self.update_session_activity(session_id)
                return session_id
        
        # 创建新会话
        return self.create_session(visitor_ip, user_agent)
    
    def validate_session(self, session_id: str, visitor_ip: str) -> bool:
        """验证会话是否有效"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT COUNT(*) FROM chat_sessions 
            WHERE id = ? AND visitor_ip = ? AND status = 'active'
        ''', (session_id, visitor_ip))
        
        result = cursor.fetchone()[0] > 0
        conn.close()
        
        return result
    
    def update_session_activity(self, session_id: str):
        """更新会话活动时间"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE chat_sessions 
            SET last_activity = CURRENT_TIMESTAMP 
            WHERE id = ?
        ''', (session_id,))
        
        conn.commit()
        conn.close()
    
    def add_message(self, session_id: str, message_type: str, content: str, 
                   token_count: int = 0, response_time: float = 0) -> int:
        """添加消息记录"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 插入消息
        cursor.execute('''
            INSERT INTO chat_messages (session_id, message_type, content, token_count, response_time)
            VALUES (?, ?, ?, ?, ?)
        ''', (session_id, message_type, content, token_count, response_time))
        
        message_id = cursor.lastrowid
        
        # 更新会话消息计数
        cursor.execute('''
            UPDATE chat_sessions 
            SET message_count = message_count + 1,
                last_activity = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (session_id,))
        
        conn.commit()
        conn.close()
        
        return message_id
    
    def get_session_messages(self, session_id: str, limit: int = 50) -> List[Dict]:
        """获取会话消息历史"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT message_type, content, timestamp, token_count, response_time
            FROM chat_messages 
            WHERE session_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (session_id, limit))
        
        messages = []
        for row in cursor.fetchall():
            messages.append({
                'type': row[0],
                'content': row[1],
                'timestamp': row[2],
                'token_count': row[3],
                'response_time': row[4]
            })
        
        conn.close()
        return list(reversed(messages))  # 返回正序排列
    
    def get_daily_stats(self, date: str = None) -> Dict:
        """获取每日统计数据"""
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 获取当日会话统计
        cursor.execute('''
            SELECT 
                COUNT(DISTINCT visitor_ip) as unique_visitors,
                COUNT(*) as total_sessions,
                SUM(message_count) as total_messages,
                AVG(
                    CASE WHEN status = 'completed' THEN
                        (julianday(last_activity) - julianday(start_time)) * 24 * 60
                    ELSE NULL END
                ) as avg_duration_minutes
            FROM chat_sessions 
            WHERE DATE(start_time) = ?
        ''', (date,))
        
        stats = cursor.fetchone()
        
        result = {
            'date': date,
            'unique_visitors': stats[0] or 0,
            'total_sessions': stats[1] or 0,
            'total_messages': stats[2] or 0,
            'avg_session_duration_minutes': round(stats[3] or 0, 2)
        }
        
        conn.close()
        return result
    
    def update_daily_stats(self, date: str = None):
        """更新每日统计数据"""
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        stats = self.get_daily_stats(date)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO visitor_stats 
            (date, unique_visitors, total_sessions, total_messages, avg_session_duration)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            date, 
            stats['unique_visitors'], 
            stats['total_sessions'], 
            stats['total_messages'], 
            stats['avg_session_duration_minutes']
        ))
        
        conn.commit()
        conn.close()
    
    def get_recent_stats(self, days: int = 7) -> List[Dict]:
        """获取最近几天的统计数据"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT date, unique_visitors, total_sessions, total_messages, avg_session_duration
            FROM visitor_stats 
            ORDER BY date DESC 
            LIMIT ?
        ''', (days,))
        
        stats = []
        for row in cursor.fetchall():
            stats.append({
                'date': row[0],
                'unique_visitors': row[1],
                'total_sessions': row[2],
                'total_messages': row[3],
                'avg_session_duration_minutes': row[4]
            })
        
        conn.close()
        return list(reversed(stats))  # 返回时间正序
    
    def close_session(self, session_id: str):
        """关闭会话"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE chat_sessions 
            SET status = 'completed' 
            WHERE id = ?
        ''', (session_id,))
        
        conn.commit()
        conn.close()
    
    def get_sessions(self, date: str = None) -> List[Dict]:
        """获取会话列表，可按日期过滤"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        query = '''
            SELECT 
                id, visitor_ip, user_agent, 
                start_time, last_activity, message_count, status
            FROM chat_sessions 
        '''
        
        params = []
        if date:
            query += " WHERE DATE(start_time) = ? "
            params.append(date)
        
        query += " ORDER BY last_activity DESC LIMIT 100"
        
        cursor.execute(query, params)
        
        sessions = []
        for row in cursor.fetchall():
            sessions.append({
                'id': row[0],
                'visitor_ip': row[1],
                'user_agent': row[2],
                'start_time': row[3],
                'last_activity': row[4],
                'message_count': row[5],
                'status': row[6]
            })
        
        conn.close()
        return sessions
    
    def cleanup_old_sessions(self, days: int = 30):
        """清理旧的会话数据"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 删除超过指定天数的消息
        cursor.execute('''
            DELETE FROM chat_messages 
            WHERE session_id IN (
                SELECT id FROM chat_sessions 
                WHERE datetime(start_time) < datetime('now', '-{} days')
            )
        '''.format(days))
        
        # 删除超过指定天数的会话
        cursor.execute('''
            DELETE FROM chat_sessions 
            WHERE datetime(start_time) < datetime('now', '-{} days')
        '''.format(days))
        
        conn.commit()
        conn.close()


# 全局数据库实例
db = ChatDatabase()
