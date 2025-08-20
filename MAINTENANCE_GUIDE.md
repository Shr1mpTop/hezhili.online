# 何致力个人网站维护手册

## 项目概述

这是何致力的个人网站，主要功能包括AI对话系统、访客统计和数据管理。项目采用前后端分离架构：
- **前端**: HTML/CSS/JavaScript
- **后端**: Flask + SQLite
- **AI服务**: 字节跳动豆包API (ARK)

## 目录结构

```
hezhili-website/
├── backend/
│   ├── api/app.py              # Flask主应用
│   ├── models/database.py      # 数据库模型
│   ├── scripts/init_db.py      # 数据库初始化脚本
│   ├── config/                 # 配置文件
│   ├── data/chat_records.db    # SQLite数据库
│   ├── start.sh               # 后端启动脚本
│   └── diagnose.sh           # 诊断脚本
├── frontend/
│   └── public/               # 前端静态文件
├── logs/
│   └── flask.log            # Flask运行日志
└── certs/                   # SSL证书
```

## 快速启动指南

### 1. 启动后端服务

```bash
cd /root/hezhili-website/backend
chmod +x start.sh
./start.sh
```

### 2. 检查服务状态

```bash
# 检查Flask进程是否运行
ps aux | grep "python.*app.py" | grep -v grep

# 检查端口占用
netstat -tuln | grep 5000

# 查看实时日志
tail -f /root/hezhili-website/logs/flask.log
```

### 3. 测试API

```bash
# 测试聊天接口
curl -X POST http://127.0.0.1:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"text": "你好"}'

# 测试聊天历史接口
curl "http://127.0.0.1:5000/chat/history?session_id=YOUR_SESSION_ID&limit=10"
```

## 数据库管理

### 数据库初始化

```bash
cd /root/hezhili-website/backend
python3 scripts/init_db.py
```

交互式菜单选项：
1. **初始化数据库** - 创建所有表和索引
2. **检查数据库状态** - 查看表结构和数据统计
3. **重置数据库** - 清空所有数据并重新初始化
4. **退出**

### 数据库直接操作

```bash
cd /root/hezhili-website/backend

# 进入SQLite命令行
sqlite3 data/chat_records.db

# 常用SQL命令
.tables                    # 查看所有表
.schema table_name         # 查看表结构
.quit                      # 退出
```

### 重要数据表

#### 1. chat_sessions (聊天会话表)
```sql
-- 查看所有会话
SELECT * FROM chat_sessions ORDER BY start_time DESC LIMIT 10;

-- 查看今日活跃会话
SELECT COUNT(*) FROM chat_sessions 
WHERE DATE(start_time) = DATE('now');

-- 查看最活跃的IP
SELECT visitor_ip, COUNT(*) as session_count 
FROM chat_sessions 
GROUP BY visitor_ip 
ORDER BY session_count DESC LIMIT 5;
```

#### 2. chat_messages (聊天消息表)
```sql
-- 查看最近的对话
SELECT session_id, message_type, content, timestamp 
FROM chat_messages 
ORDER BY timestamp DESC LIMIT 20;

-- 统计今日消息数量
SELECT COUNT(*) FROM chat_messages 
WHERE DATE(timestamp) = DATE('now');

-- 按消息类型统计
SELECT message_type, COUNT(*) 
FROM chat_messages 
GROUP BY message_type;
```

#### 3. visitor_stats (访客统计表)
```sql
-- 查看每日统计
SELECT * FROM visitor_stats ORDER BY date DESC LIMIT 7;

-- 查看总体统计
SELECT 
    SUM(unique_visitors) as total_visitors,
    SUM(total_sessions) as total_sessions,
    SUM(total_messages) as total_messages
FROM visitor_stats;
```

### 数据备份与恢复

#### 备份数据库
```bash
cd /root/hezhili-website/backend

# 创建备份目录
mkdir -p backups

# 备份数据库
cp data/chat_records.db backups/chat_records_$(date +%Y%m%d_%H%M%S).db

# 导出SQL备份
sqlite3 data/chat_records.db .dump > backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

#### 恢复数据库
```bash
# 从备份文件恢复
cp backups/chat_records_YYYYMMDD_HHMMSS.db data/chat_records.db

# 从SQL文件恢复
sqlite3 data/chat_records.db < backups/backup_YYYYMMDD_HHMMSS.sql
```

## 服务管理

### 启动脚本详解

`backend/start.sh` 脚本功能：
1. 停止现有Flask进程
2. 等待进程完全停止
3. 后台启动新的Flask应用
4. 将日志输出到 `logs/flask.log`

### 手动启动/停止

```bash
# 手动启动
cd /root/hezhili-website/backend
nohup python3 api/app.py > ../logs/flask.log 2>&1 &

# 停止服务
pkill -f "python.*app.py"

# 强制停止
pkill -9 -f "python.*app.py"
```

### 设置开机自启

创建系统服务文件：

```bash
sudo tee /etc/systemd/system/hezhili-website.service > /dev/null <<EOF
[Unit]
Description=Hezhili Website Flask App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/hezhili-website/backend
ExecStart=/usr/bin/python3 api/app.py
Restart=always
RestartSec=10
Environment=ARK_API_KEY=YOUR_API_KEY_HERE

[Install]
WantedBy=multi-user.target
EOF

# 启用服务
sudo systemctl enable hezhili-website
sudo systemctl start hezhili-website

# 查看服务状态
sudo systemctl status hezhili-website
```

## 日志管理

### 查看日志

```bash
# 查看实时日志
tail -f /root/hezhili-website/logs/flask.log

# 查看最近100行日志
tail -100 /root/hezhili-website/logs/flask.log

# 搜索错误日志
grep -i error /root/hezhili-website/logs/flask.log

# 查看今日日志
grep "$(date +%Y-%m-%d)" /root/hezhili-website/logs/flask.log
```

### 日志轮转

创建日志轮转配置：

```bash
sudo tee /etc/logrotate.d/hezhili-website > /dev/null <<EOF
/root/hezhili-website/logs/flask.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
EOF
```

## 性能监控

### 系统资源监控

```bash
# 查看进程资源使用
ps aux | grep python | grep app.py

# 查看内存使用
free -h

# 查看磁盘使用
df -h

# 查看数据库文件大小
ls -lh /root/hezhili-website/backend/data/
```

### 数据库性能

```bash
cd /root/hezhili-website/backend

# 数据库文件大小
du -h data/chat_records.db

# 统计记录数量
sqlite3 data/chat_records.db "
SELECT 
    'Sessions' as table_name, COUNT(*) as count FROM chat_sessions
UNION ALL
SELECT 
    'Messages' as table_name, COUNT(*) as count FROM chat_messages
UNION ALL
SELECT 
    'Stats' as table_name, COUNT(*) as count FROM visitor_stats;
"
```

## 安全维护

### 环境变量检查

```bash
# 检查API密钥是否设置
echo "ARK_API_KEY is $([ -n "$ARK_API_KEY" ] && echo "SET" || echo "NOT SET")"

# 查看API密钥前几位（用于验证）
echo $ARK_API_KEY | head -c 10
```

### 文件权限检查

```bash
# 检查关键文件权限
ls -la /root/hezhili-website/backend/data/
ls -la /root/hezhili-website/backend/start.sh
ls -la /root/hezhili-website/logs/
```

### 数据库安全

```bash
# 设置数据库文件权限
chmod 600 /root/hezhili-website/backend/data/chat_records.db

# 检查数据库完整性
cd /root/hezhili-website/backend
sqlite3 data/chat_records.db "PRAGMA integrity_check;"
```

## 故障排查

### 常见问题及解决方案

#### 1. 服务无法启动
```bash
# 检查端口是否被占用
netstat -tuln | grep 5000

# 查看详细错误
python3 /root/hezhili-website/backend/api/app.py

# 检查Python依赖
pip3 list | grep -E "(flask|openai|sqlite)"
```

#### 2. 数据库错误
```bash
# 检查数据库文件是否存在
ls -la /root/hezhili-website/backend/data/chat_records.db

# 重新初始化数据库
cd /root/hezhili-website/backend
python3 scripts/init_db.py
```

#### 3. API请求失败
```bash
# 检查网络连接
curl -I https://ark.cn-beijing.volces.com

# 验证API密钥
curl -X POST https://ark.cn-beijing.volces.com/api/v3/chat/completions \
  -H "Authorization: Bearer $ARK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"ep-20250818212031-2wf44","messages":[{"role":"user","content":"test"}]}'
```

## 定期维护任务

### 每日任务
- [ ] 检查服务运行状态
- [ ] 查看错误日志
- [ ] 检查磁盘空间使用

### 每周任务
- [ ] 备份数据库
- [ ] 清理旧日志文件
- [ ] 检查系统资源使用情况
- [ ] 更新统计数据

### 每月任务
- [ ] 分析访客统计数据
- [ ] 清理过期会话数据
- [ ] 检查API使用量
- [ ] 更新系统依赖

## 维护脚本

### 自动备份脚本

创建 `backup.sh`:
```bash
#!/bin/bash
cd /root/hezhili-website/backend
mkdir -p backups
cp data/chat_records.db backups/chat_records_$(date +%Y%m%d_%H%M%S).db
# 保留最近7天的备份
find backups/ -name "chat_records_*.db" -mtime +7 -delete
echo "Database backup completed: $(date)"
```

### 状态检查脚本

创建 `health_check.sh`:
```bash
#!/bin/bash
echo "=== 何致力网站健康检查 ==="
echo "时间: $(date)"
echo ""

# 检查进程
if pgrep -f "python.*app.py" > /dev/null; then
    echo "✓ Flask服务运行正常"
else
    echo "✗ Flask服务未运行"
fi

# 检查数据库
if [ -f "/root/hezhili-website/backend/data/chat_records.db" ]; then
    echo "✓ 数据库文件存在"
else
    echo "✗ 数据库文件不存在"
fi

# 检查API连通性
if curl -s http://127.0.0.1:5000/stats > /dev/null; then
    echo "✓ API接口响应正常"
else
    echo "✗ API接口无响应"
fi

echo ""
echo "=== 系统资源 ==="
echo "内存使用: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "磁盘使用: $(df -h / | tail -1 | awk '{print $3"/"$2" ("$5")"}')"
```

## 联系信息

如有问题或需要技术支持，请联系：
- 开发者：何致力
- 邮箱：[您的邮箱]
- 项目地址：https://github.com/Shr1mpTop/hezhili.online

---

**注意事项：**
1. 定期备份数据库，避免数据丢失
2. 监控API使用量，避免超出配额
3. 及时更新依赖包，确保安全性
4. 保护好API密钥，不要泄露
5. 定期检查日志，及时发现问题

最后更新时间：2025年8月21日
