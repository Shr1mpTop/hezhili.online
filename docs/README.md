# 何致力个人网站 - 完整文档

这是何致力的个人网站项目，包含AI对话功能、访客统计和数据管理系统。本文档整合了项目的所有相关信息，包括开发、部署、维护和故障排除。

## 📋 目录

1. [项目概述](#项目概述)
2. [功能特性](#功能特性)
3. [项目结构](#项目结构)
4. [技术栈](#技术栈)
5. [环境配置](#环境配置)
6. [本地开发](#本地开发)
7. [生产部署](#生产部署)
8. [API文档](#api文档)
9. [数据库管理](#数据库管理)
10. [服务管理](#服务管理)
11. [维护手册](#维护手册)
12. [故障排除](#故障排除)
13. [性能监控](#性能监控)
14. [安全说明](#安全说明)

---

## 📖 项目概述

何致力的个人网站，主要功能包括AI对话系统、访客统计和数据管理。项目采用前后端分离架构：
- **前端**: HTML/CSS/JavaScript
- **后端**: Flask + SQLite
- **AI服务**: 字节跳动豆包API (ARK)

**开发者信息**:
- **姓名**: 何致力
- **学校**: 新加坡南洋理工大学
- **专业**: 区块链
- **项目地址**: https://github.com/Shr1mpTop/hezhili.online

## ✨ 功能特性

- 🤖 **AI对话系统**: 基于字节跳动豆包API的智能对话
- 💬 **对话记录**: 完整的用户对话历史保存
- 📊 **数据统计**: 访客数据统计和分析
- 🔧 **运维工具**: 完整的维护和监控脚本
- 📱 **响应式设计**: 支持桌面和移动设备
- 🔒 **安全保护**: API密钥管理和数据保护

## 📁 项目结构

```
hezhili.online/
├── backend/                     # 后端代码
│   ├── api/                    # Flask API服务
│   │   ├── app.py             # 主应用文件
│   │   └── config.py          # 配置文件
│   ├── models/                # 数据模型
│   │   └── database.py        # 数据库操作
│   ├── data/                  # 数据文件
│   │   └── chat_records.db    # SQLite数据库
│   └── scripts/               # 后端脚本
│       ├── init_db.py         # 数据库初始化
│       └── test_db_chat.py    # 数据库测试
├── frontend/                   # 前端代码
│   └── public/                # 静态文件
│       ├── index.html         # 主页
│       ├── pages/             # 页面文件
│       │   ├── admin.html     # 管理页面
│       │   ├── sidebar-test.html # 测试页面
│       │   └── hero-test.html # 测试页面
│       └── src/               # 源代码
│           ├── css/           # 样式文件
│           │   ├── style.css  # 主样式文件（已优化）
│           │   └── desktop-extras.css # 桌面增强样式
│           ├── js/            # JavaScript文件
│           │   └── main.js    # 主脚本
│           └── assets/        # 静态资源
├── scripts/                    # 项目脚本（新优化结构）
│   ├── dev/                   # 开发环境脚本
│   │   ├── dev.sh            # 统一开发环境管理脚本 ⭐
│   │   └── start_local.sh    # 本地启动脚本
│   ├── diagnostics/           # 诊断工具
│   │   ├── check_db.py       # 数据库检查
│   │   ├── deep_diagnose.sh  # 深度诊断
│   │   ├── diagnose_502.sh   # 502错误诊断
│   │   └── fix_502.sh       # 502错误修复
│   └── test/                 # 测试文件
│       ├── test_cors.html    # CORS测试
│       ├── test_flask_routes.py # Flask路由测试
│       ├── test_server.py   # 服务器测试
│       └── api_test.html     # API测试
├── docs/                      # 文档（新优化结构）
│   ├── README.md             # 项目文档
│   └── OPTIMIZATION_REPORT.md # 优化报告 ⭐
├── start_dev.sh              # 启动脚本（符号链接）
├── stop_dev.sh               # 停止脚本（符号链接）
├── start_frontend.py         # 前端服务器
├── backend.log               # 后端日志
├── frontend.log              # 前端日志
├── backend.pid               # 后端进程ID
├── frontend.pid              # 前端进程ID
├── .env.local                # 本地环境变量
├── .gitignore               # Git忽略文件
├── CNAME                    # GitHub Pages域名
└── requirements.txt          # Python依赖（后端）
```

**优化亮点：**
- 🗂️ **清晰的目录结构** - 按功能分类组织文件
- 🔧 **统一的脚本管理** - `scripts/dev/dev.sh` 统一管理开发环境
- 📚 **文档集中管理** - 所有文档移至 `docs/` 目录
- 🔄 **向后兼容** - 保留原有脚本作为符号链接
- 🧹 **代码优化** - 清理了CSS冗余，删除了50+行重复代码
│   └── public/                 # 静态资源
│       ├── pages/              # 页面文件
│       │   ├── index.html     # 主页
│       │   └── admin.html     # 管理页面
│       └── src/                # 源文件
│           ├── css/style.css  # 样式文件
│           ├── js/main.js     # 主要JavaScript
│           └── assets/        # 图片资源
├── backend/                    # 后端代码
│   ├── api/app.py             # Flask主应用
│   ├── models/database.py     # 数据库模型
│   ├── scripts/               # 数据库管理脚本
│   │   ├── init_db.py        # 数据库初始化
│   │   └── test_db_chat.py   # 数据库测试
│   ├── config/                # 配置文件
│   │   ├── config.py         # 应用配置
│   │   └── nginx.conf        # Nginx配置
│   ├── data/                  # SQLite数据库
│   │   └── chat_records.db   # 主数据库文件
│   ├── requirements.txt       # Python依赖
│   └── start.sh              # 启动脚本
├── scripts/                   # 运维脚本 (已删除调试脚本)
│   ├── backup.sh             # 数据备份脚本
│   ├── health_check.sh       # 健康检查脚本
│   └── log_analysis.sh       # 日志分析脚本
├── start_dev.sh              # 开发环境启动
├── start_local.sh            # 本地启动脚本
├── stop_dev.sh               # 开发环境停止
├── start_frontend.py         # 前端服务器
├── logs/                     # 日志文件
├── certs/                    # SSL证书
├── CNAME                     # 域名配置
└── README_COMPLETE.md        # 本文档
```

## 🛠 技术栈

### 前端技术
- **HTML5**: 现代语义化标记
- **CSS3**: 响应式设计和动画
- **JavaScript (ES6+)**: 现代JavaScript特性
- **Fetch API**: 异步数据获取

### 后端技术
- **Python 3.12**: 主要编程语言
- **Flask 2.0+**: Web框架
- **SQLite 3**: 轻量级数据库
- **Flask-CORS**: 跨域资源共享

### AI服务
- **字节跳动豆包API (ARK)**: 智能对话服务
- **自定义API集成**: 对话管理和历史记录

### 部署技术
- **Linux**: 服务器操作系统
- **Nginx**: 反向代理和静态文件服务
- **Systemd**: 服务管理 (可选)
- **Git**: 版本控制

## ⚙️ 环境配置

### 环境要求
- **Python**: 3.8+
- **pip3**: Python包管理器
- **Git**: 版本控制
- **操作系统**: Linux/macOS/Windows

### 必需的环境变量
```bash
# 字节跳动豆包API密钥 (必需)
export ARK_API_KEY="你的API密钥"

# 可选环境变量
export FLASK_ENV="development"  # 开发环境
export FLASK_DEBUG="1"          # 调试模式
```

### 依赖安装
```bash
# 安装Python依赖
pip3 install -r backend/requirements.txt

# 主要依赖包
pip3 install flask flask-cors openai sqlite3
```

## 💻 本地开发

### 快速开始

#### 1. 克隆项目
```bash
git clone https://github.com/Shr1mpTop/hezhili.online.git
cd hezhili.online
```

#### 2. 设置API密钥（必需）
```bash
export ARK_API_KEY="你的火山引擎API密钥"
```

#### 3. 安装依赖
```bash
pip3 install -r backend/requirements.txt
```

#### 4. 初始化数据库
```bash
python3 backend/scripts/init_db.py
```

#### 5. 启动开发环境（推荐方式）
```bash
# 启动完整的开发环境（后端+前端）
./scripts/dev/dev.sh start

# 或者使用兼容的旧命令
./start_dev.sh
```
服务启动后：
- 后端API: `http://localhost:5001`
- 前端页面: `http://localhost:8080`
- 管理页面: `http://localhost:8080/pages/admin.html`

#### 6. 单独启动服务（可选）
```bash
# 仅启动后端
./scripts/dev/dev.sh start  # 然后手动停止前端部分

# 仅启动前端
python3 start_frontend.py
```

### 开发环境管理

新的统一脚本提供完整的开发环境管理功能：

```bash
# 查看所有可用命令
./scripts/dev/dev.sh help

# 启动服务
./scripts/dev/dev.sh start

# 停止服务
./scripts/dev/dev.sh stop

# 重启服务
./scripts/dev/dev.sh restart

# 查看服务状态
./scripts/dev/dev.sh status

# 测试API
./scripts/dev/dev.sh test
```
```
前端将运行在 `http://localhost:8080`

### 开发工具脚本

#### 启动开发环境
```bash
# 启动完整开发环境（后端+前端）
./start_dev.sh

# 停止开发环境
./stop_dev.sh
```

### API端点测试

#### 手动测试API
```bash
# 测试统计API
curl http://localhost:5001/stats

# 测试聊天API
curl -X POST http://localhost:5001/chat \
  -H "Content-Type: application/json" \
  -d '{"text": "你好", "session_id": null}'

# 测试聊天历史API
curl "http://localhost:5001/chat/history?session_id=test&limit=10"
```

### 调试技巧

1. **查看Flask日志**: 启动后端后，控制台会显示详细的请求日志
2. **查看浏览器网络面板**: 检查API请求和响应
3. **使用curl测试API**: 独立测试后端API功能
4. **检查数据库**: 使用SQLite工具查看 `backend/data/chat_records.db`

### 常见开发问题

#### Q: API请求失败，返回404
**A**: 确保后端服务正在运行在 localhost:5001

#### Q: CORS错误
**A**: 本地开发已配置CORS，如果仍有问题，检查前端请求的URL是否正确

#### Q: 数据库错误
**A**: 重新运行 `python3 backend/scripts/init_db.py` 初始化数据库

#### Q: 没有API密钥
**A**: 设置环境变量 `export ARK_API_KEY="your_key"`

## 🚀 生产部署

### 服务器环境准备

#### 1. 服务器要求
- Linux服务器 (推荐 Ubuntu 20.04+)
- Python 3.8+
- Nginx
- 域名和SSL证书

#### 2. 克隆项目
```bash
cd /root
git clone https://github.com/Shr1mpTop/hezhili.online.git hezhili-website
cd hezhili-website
```

#### 3. 安装依赖
```bash
pip3 install -r backend/requirements.txt
```

#### 4. 配置环境变量
```bash
# 添加到 ~/.bashrc 或 ~/.profile
echo 'export ARK_API_KEY="你的API密钥"' >> ~/.bashrc
source ~/.bashrc
```

#### 5. 初始化数据库
```bash
cd backend
python3 scripts/init_db.py
```

### Nginx配置

#### 基本配置 (端口5001)
```nginx
server {
    listen 80;
    server_name hezhili.online;
    
    # 静态文件
    location / {
        root /root/hezhili-website/frontend/public;
        try_files $uri $uri/ /index.html;
    }
    
    # API代理 - 重要：确保端口为5001
    location /chat {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # CORS配置
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Content-Type';
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    location /stats {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /sessions {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 启动服务

#### 方式1: 手动启动
```bash
cd /root/hezhili-website/backend
chmod +x start.sh
./start.sh
```

#### 方式2: 系统服务 (推荐)
创建 `/etc/systemd/system/hezhili-backend.service`:
```ini
[Unit]
Description=Hezhili Backend API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/hezhili-website/backend/api
Environment=ARK_API_KEY=你的API密钥
Environment=FLASK_ENV=production
ExecStart=/usr/bin/python3 app.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

启用服务:
```bash
sudo systemctl daemon-reload
sudo systemctl enable hezhili-backend
sudo systemctl start hezhili-backend
```

#### 方式3: 使用Gunicorn (更稳定)
```bash
pip3 install gunicorn
cd /root/hezhili-website/backend/api
gunicorn -w 4 -b 127.0.0.1:5001 app:app \
  --access-logfile /var/log/hezhili-access.log \
  --error-logfile /var/log/hezhili-error.log \
  --daemon
```

## 📚 API文档

### 基础信息
- **基础URL**: `https://hezhili.online` (生产) / `http://localhost:5001` (开发)
- **认证**: 无需认证 (使用服务端API密钥)
- **格式**: JSON
- **编码**: UTF-8

### 聊天接口

#### POST /chat
发送消息给AI并获取回复

**请求参数**:
```json
{
    "text": "用户输入的消息",           // 必需，字符串
    "session_id": "会话ID"           // 可选，字符串，null表示新会话
}
```

**响应示例**:
```json
{
    "content": "AI的回复内容",
    "session_id": "生成的会话ID"
}
```

**错误响应**:
```json
{
    "error": "错误描述",
    "details": "详细错误信息"
}
```

### 历史记录接口

#### GET /chat/history
获取指定会话的聊天历史

**查询参数**:
- `session_id`: 会话ID (必需)
- `limit`: 返回消息数量限制 (可选，默认20)

**响应示例**:
```json
[
    {
        "id": 1,
        "session_id": "session123",
        "message_type": "user",
        "content": "用户消息",
        "timestamp": "2025-08-25T10:00:00Z"
    },
    {
        "id": 2,
        "session_id": "session123", 
        "message_type": "assistant",
        "content": "AI回复",
        "timestamp": "2025-08-25T10:00:05Z"
    }
]
```

### 统计接口

#### GET /stats
获取访客统计数据

**查询参数**:
- `date`: 指定日期 (可选，格式: YYYY-MM-DD，默认今天)

**响应示例**:
```json
{
    "date": "2025-08-25",
    "unique_visitors": 50,
    "total_sessions": 75,
    "total_messages": 200,
    "avg_session_duration_minutes": 8.5
}
```

### 会话管理接口

#### GET /sessions
获取会话列表

**查询参数**:
- `limit`: 返回会话数量 (可选，默认10)
- `offset`: 偏移量 (可选，默认0)

**响应示例**:
```json
[
    {
        "session_id": "session123",
        "start_time": "2025-08-25T09:30:00Z",
        "end_time": "2025-08-25T09:45:00Z",
        "message_count": 10,
        "visitor_ip": "192.168.1.1"
    }
]
```

## 🗄️ 数据库管理

### 数据库架构

项目使用SQLite作为数据库，包含以下主要表：

#### 1. chat_sessions (聊天会话表)
```sql
CREATE TABLE chat_sessions (
    session_id TEXT PRIMARY KEY,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    visitor_ip TEXT,
    user_agent TEXT,
    message_count INTEGER DEFAULT 0
);
```

#### 2. chat_messages (聊天消息表)  
```sql
CREATE TABLE chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    message_type TEXT, -- 'user' 或 'assistant'
    content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id)
);
```

#### 3. visitor_stats (访客统计表)
```sql
CREATE TABLE visitor_stats (
    date TEXT PRIMARY KEY,
    unique_visitors INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    avg_session_duration_minutes REAL DEFAULT 0.0
);
```

### 数据库初始化

#### 使用初始化脚本
```bash
cd backend
python3 scripts/init_db.py
```

交互式菜单选项：
1. **初始化数据库** - 创建所有表和索引
2. **检查数据库状态** - 查看表结构和数据统计
3. **重置数据库** - 清空所有数据并重新初始化
4. **退出**

#### 手动初始化
```bash
cd backend
sqlite3 data/chat_records.db < scripts/schema.sql
```

### 常用数据库操作

#### 连接数据库
```bash
cd backend
sqlite3 data/chat_records.db
```

#### 查看表结构
```sql
.tables                    -- 查看所有表
.schema chat_sessions      -- 查看表结构
.quit                      -- 退出
```

#### 数据查询示例

**查看最近对话**:
```sql
SELECT session_id, message_type, content, timestamp 
FROM chat_messages 
ORDER BY timestamp DESC LIMIT 20;
```

**统计今日数据**:
```sql
SELECT COUNT(*) as today_sessions 
FROM chat_sessions 
WHERE DATE(start_time) = DATE('now');

SELECT COUNT(*) as today_messages 
FROM chat_messages 
WHERE DATE(timestamp) = DATE('now');
```

**查看最活跃用户**:
```sql
SELECT visitor_ip, COUNT(*) as session_count 
FROM chat_sessions 
GROUP BY visitor_ip 
ORDER BY session_count DESC LIMIT 5;
```

**查看每日统计**:
```sql
SELECT * FROM visitor_stats 
ORDER BY date DESC LIMIT 7;
```

### 数据库备份与恢复

#### 创建备份
```bash
cd backend

# 创建备份目录
mkdir -p backups

# 备份数据库文件
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

#### 自动备份脚本
创建 `scripts/backup.sh`:
```bash
#!/bin/bash
cd /root/hezhili-website/backend
mkdir -p backups
cp data/chat_records.db backups/chat_records_$(date +%Y%m%d_%H%M%S).db
# 保留最近7天的备份
find backups/ -name "chat_records_*.db" -mtime +7 -delete
echo "Database backup completed: $(date)"
```

## 🔧 服务管理

### 启动脚本详解

#### backend/start.sh 功能
1. 停止现有Flask进程
2. 等待进程完全停止
3. 后台启动新的Flask应用
4. 将日志输出到指定文件

```bash
#!/bin/bash
# 停止现有进程
pkill -f "python.*app.py"

# 等待进程停止
sleep 2

# 切换到API目录
cd "$(dirname "$0")/api"

# 后台启动Flask应用
nohup python3 app.py > ../../logs/flask.log 2>&1 &

echo "Flask应用已启动，日志文件: logs/flask.log"
echo "进程ID: $!"
```

### 手动服务管理

#### 启动服务
```bash
# 方式1: 使用启动脚本
cd /root/hezhili-website/backend
./start.sh

# 方式2: 手动启动
cd /root/hezhili-website/backend/api
nohup python3 app.py > ../../logs/flask.log 2>&1 &
```

#### 停止服务
```bash
# 优雅停止
pkill -f "python.*app.py"

# 强制停止
pkill -9 -f "python.*app.py"

# 检查是否停止
ps aux | grep "python.*app.py" | grep -v grep
```

#### 重启服务
```bash
# 使用启动脚本重启
cd /root/hezhili-website/backend
./start.sh

# 手动重启
pkill -f "python.*app.py"
sleep 3
cd api
nohup python3 app.py > ../../logs/flask.log 2>&1 &
```

### 检查服务状态

#### 检查进程
```bash
# 查看Flask进程
ps aux | grep "python.*app.py" | grep -v grep

# 查看端口占用
netstat -tuln | grep 5001
# 或使用 ss
ss -ltnp | grep 5001
```

#### 检查连通性
```bash
# 测试本地连接
curl -s http://127.0.0.1:5001/stats

# 测试外部访问
curl -s https://hezhili.online/stats
```

### systemd服务管理

#### 创建服务文件
```bash
sudo tee /etc/systemd/system/hezhili-backend.service > /dev/null <<EOF
[Unit]
Description=Hezhili Website Flask App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/hezhili-website/backend/api
Environment=ARK_API_KEY=你的API密钥
Environment=FLASK_ENV=production
ExecStart=/usr/bin/python3 app.py
Restart=always
RestartSec=10
StandardOutput=append:/var/log/hezhili-backend.log
StandardError=append:/var/log/hezhili-backend.log

[Install]
WantedBy=multi-user.target
EOF
```

#### 管理系统服务
```bash
# 重新加载systemd配置
sudo systemctl daemon-reload

# 启用开机自启
sudo systemctl enable hezhili-backend

# 启动服务
sudo systemctl start hezhili-backend

# 查看服务状态
sudo systemctl status hezhili-backend

# 查看服务日志
sudo journalctl -u hezhili-backend -f

# 停止服务
sudo systemctl stop hezhili-backend

# 重启服务
sudo systemctl restart hezhili-backend
```

## 📖 维护手册

### 日志管理

#### 查看日志
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

#### 日志轮转配置
创建 `/etc/logrotate.d/hezhili-website`:
```bash
/root/hezhili-website/logs/flask.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
```

### 定期维护任务

#### 每日任务清单
- [ ] 检查服务运行状态
- [ ] 查看错误日志
- [ ] 检查磁盘空间使用
- [ ] 验证API响应正常

```bash
# 每日检查脚本
#!/bin/bash
echo "=== 每日检查 $(date) ==="

# 检查服务状态
if pgrep -f "python.*app.py" > /dev/null; then
    echo "✓ 服务运行正常"
else
    echo "✗ 服务未运行，正在重启..."
    cd /root/hezhili-website/backend && ./start.sh
fi

# 检查API
if curl -s http://127.0.0.1:5001/stats > /dev/null; then
    echo "✓ API响应正常"
else
    echo "✗ API无响应"
fi

# 检查磁盘空间
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠ 磁盘使用率过高: ${DISK_USAGE}%"
else
    echo "✓ 磁盘空间充足: ${DISK_USAGE}%"
fi
```

#### 每周任务清单
- [ ] 备份数据库
- [ ] 清理旧日志文件
- [ ] 检查系统资源使用情况
- [ ] 更新统计数据

```bash
# 每周维护脚本
#!/bin/bash
echo "=== 每周维护 $(date) ==="

# 备份数据库
cd /root/hezhili-website/backend
mkdir -p backups
cp data/chat_records.db backups/chat_records_$(date +%Y%m%d_%H%M%S).db
echo "✓ 数据库已备份"

# 清理旧日志
find /root/hezhili-website/logs -name "*.log" -mtime +14 -delete
echo "✓ 旧日志已清理"

# 清理旧备份
find /root/hezhili-website/backend/backups -name "*.db" -mtime +30 -delete
echo "✓ 旧备份已清理"
```

#### 每月任务清单
- [ ] 分析访客统计数据
- [ ] 清理过期会话数据
- [ ] 检查API使用量
- [ ] 更新系统依赖

### 健康检查脚本

创建 `scripts/health_check.sh`:
```bash
#!/bin/bash
echo "=== 何致力网站健康检查 ==="
echo "时间: $(date)"
echo ""

# 检查进程
if pgrep -f "python.*app.py" > /dev/null; then
    echo "✓ Flask服务运行正常"
    ps aux | grep "python.*app.py" | grep -v grep | awk '{print "  PID:", $2, "CPU:", $3"%", "MEM:", $4"%"}'
else
    echo "✗ Flask服务未运行"
fi

# 检查端口
if netstat -tuln | grep -q ":5001"; then
    echo "✓ 端口5001监听正常"
else
    echo "✗ 端口5001未监听"
fi

# 检查数据库
if [ -f "/root/hezhili-website/backend/data/chat_records.db" ]; then
    echo "✓ 数据库文件存在"
    DB_SIZE=$(du -h /root/hezhili-website/backend/data/chat_records.db | cut -f1)
    echo "  数据库大小: $DB_SIZE"
else
    echo "✗ 数据库文件不存在"
fi

# 检查API连通性
echo "检查API连通性..."
if curl -s --max-time 5 http://127.0.0.1:5001/stats > /dev/null; then
    echo "✓ API接口响应正常"
else
    echo "✗ API接口无响应"
fi

# 检查nginx配置 (如果存在)
if command -v nginx > /dev/null; then
    if nginx -t > /dev/null 2>&1; then
        echo "✓ Nginx配置正常"
    else
        echo "✗ Nginx配置有误"
    fi
fi

echo ""
echo "=== 系统资源 ==="
echo "内存使用: $(free -h | grep Mem | awk '{print $3"/"$2" ("int($3/$2*100)"%)"}')"
echo "磁盘使用: $(df -h / | tail -1 | awk '{print $3"/"$2" ("$5")"}')"
echo "负载平均: $(uptime | awk -F'load average:' '{print $2}')"

# 检查数据库统计
echo ""
echo "=== 数据库统计 ==="
if [ -f "/root/hezhili-website/backend/data/chat_records.db" ]; then
    cd /root/hezhili-website/backend
    echo "会话总数: $(sqlite3 data/chat_records.db 'SELECT COUNT(*) FROM chat_sessions;')"
    echo "消息总数: $(sqlite3 data/chat_records.db 'SELECT COUNT(*) FROM chat_messages;')"
    echo "今日会话: $(sqlite3 data/chat_records.db "SELECT COUNT(*) FROM chat_sessions WHERE DATE(start_time) = DATE('now');")"
    echo "今日消息: $(sqlite3 data/chat_records.db "SELECT COUNT(*) FROM chat_messages WHERE DATE(timestamp) = DATE('now');")"
fi
```

## 🚨 故障排除

### 502 Bad Gateway 错误修复

这是最常见的生产环境问题，通常由端口配置不匹配引起。

#### 快速诊断
```bash
# 1. 检查后端服务状态
ps aux | grep -E '(app\.py|gunicorn)' | grep -v grep

# 2. 检查端口监听
ss -ltnp | grep -E ':(5000|5001)'

# 3. 测试本地连接
curl -v http://127.0.0.1:5001/stats

# 4. 检查nginx配置
grep -r "proxy_pass" /etc/nginx/
```

#### 常见原因及解决方案

**原因1: 后端服务未运行**
```bash
# 解决方案
cd /root/hezhili-website/backend
export ARK_API_KEY="你的API密钥"
./start.sh
```

**原因2: 端口配置不匹配**
```bash
# 检查nginx配置是否指向正确端口
grep "proxy_pass" /etc/nginx/sites-available/default

# 如果指向5000，需要改为5001
sudo sed -i 's/127.0.0.1:5000/127.0.0.1:5001/g' /etc/nginx/sites-available/default
sudo nginx -t && sudo systemctl reload nginx
```

**原因3: API密钥未配置**
```bash
# 检查环境变量
echo $ARK_API_KEY

# 如果为空，设置API密钥
export ARK_API_KEY="你的API密钥"
# 重启服务
cd /root/hezhili-website/backend && ./start.sh
```

### 数据库相关问题

#### 数据库文件不存在
```bash
# 重新初始化数据库
cd /root/hezhili-website/backend
python3 scripts/init_db.py
```

#### 数据库权限问题
```bash
# 设置正确权限
chmod 600 /root/hezhili-website/backend/data/chat_records.db
chown root:root /root/hezhili-website/backend/data/chat_records.db
```

#### 数据库损坏
```bash
# 检查数据库完整性
cd /root/hezhili-website/backend
sqlite3 data/chat_records.db "PRAGMA integrity_check;"

# 如果损坏，从备份恢复
cp backups/chat_records_YYYYMMDD_HHMMSS.db data/chat_records.db
```

### API相关问题

#### API密钥无效
```bash
# 验证API密钥
curl -X POST https://ark.cn-beijing.volces.com/api/v3/chat/completions \
  -H "Authorization: Bearer $ARK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"ep-20250818212031-2wf44","messages":[{"role":"user","content":"test"}]}'
```

#### CORS问题
检查nginx配置是否包含正确的CORS头部：
```nginx
add_header 'Access-Control-Allow-Origin' '*';
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
add_header 'Access-Control-Allow-Headers' 'Content-Type';

if ($request_method = 'OPTIONS') {
    return 204;
}
```

### 服务启动问题

#### 端口被占用
```bash
# 查看端口占用
lsof -i :5001

# 杀死占用进程
sudo kill -9 $(lsof -t -i:5001)
```

#### Python依赖问题
```bash
# 重新安装依赖
pip3 install --upgrade -r backend/requirements.txt

# 检查特定包
pip3 show flask flask-cors openai
```

### 性能问题

#### 高内存使用
```bash
# 查看进程内存使用
ps aux --sort=-%mem | head -10

# 重启服务释放内存
cd /root/hezhili-website/backend && ./start.sh
```

#### 数据库查询慢
```bash
# 分析数据库
cd /root/hezhili-website/backend
sqlite3 data/chat_records.db "ANALYZE;"

# 重建索引
sqlite3 data/chat_records.db "REINDEX;"
```

## 📊 性能监控

### 系统资源监控

#### CPU和内存监控
```bash
# 实时监控
top -p $(pgrep -f "python.*app.py")

# 内存详情
cat /proc/$(pgrep -f "python.*app.py")/status | grep -E "(VmSize|VmRSS)"

# CPU使用率
ps -p $(pgrep -f "python.*app.py") -o pid,pcpu,pmem,cmd
```

#### 磁盘空间监控
```bash
# 查看整体磁盘使用
df -h

# 查看项目目录大小
du -sh /root/hezhili-website/*

# 查看数据库大小
ls -lh /root/hezhili-website/backend/data/
```

#### 网络监控
```bash
# 查看网络连接
netstat -an | grep :5001

# 查看连接统计
ss -s

# 监控网络流量 (需要安装iftop)
sudo iftop -i eth0
```

### 应用性能监控

#### 数据库性能
```bash
cd /root/hezhili-website/backend

# 数据库统计信息
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

# 数据库大小分析
sqlite3 data/chat_records.db "
SELECT 
    name,
    SUM(pgsize) as size_bytes,
    SUM(pgsize)/1024.0/1024.0 as size_mb
FROM dbstat 
GROUP BY name 
ORDER BY size_bytes DESC;
"
```

#### API响应时间监控
```bash
# 测试API响应时间
time curl -s http://127.0.0.1:5001/stats > /dev/null

# 详细的响应时间分析
curl -w "@curl-format.txt" -s -o /dev/null http://127.0.0.1:5001/stats
```

创建 `curl-format.txt`:
```
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

### 日志分析

#### 访问模式分析
```bash
# 分析最频繁的IP
grep "POST /chat" /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -10

# 分析访问时间分布
grep "$(date +%d/%b/%Y)" /var/log/nginx/access.log | awk '{print $4}' | cut -d: -f2 | sort | uniq -c

# 分析错误请求
grep " 4[0-9][0-9] \| 5[0-9][0-9] " /var/log/nginx/access.log | tail -20
```

#### 应用日志分析
```bash
# 分析Flask日志中的错误
grep -i "error\|exception\|traceback" /root/hezhili-website/logs/flask.log | tail -10

# 分析API调用频率
grep "POST /chat" /root/hezhili-website/logs/flask.log | wc -l

# 分析响应时间 (如果日志包含时间信息)
grep "POST /chat" /root/hezhili-website/logs/flask.log | grep -o "[0-9]*ms" | sort -n
```

### 监控告警脚本

创建 `scripts/monitor.sh`:
```bash
#!/bin/bash

# 配置告警阈值
CPU_THRESHOLD=80
MEMORY_THRESHOLD=80
DISK_THRESHOLD=90
RESPONSE_TIME_THRESHOLD=5000  # 毫秒

LOG_FILE="/var/log/hezhili-monitor.log"

echo "$(date): 开始监控检查" >> $LOG_FILE

# 检查CPU使用率
CPU_USAGE=$(ps -p $(pgrep -f "python.*app.py") -o pcpu --no-headers | awk '{print int($1)}')
if [ $CPU_USAGE -gt $CPU_THRESHOLD ]; then
    echo "$(date): 警告 - CPU使用率过高: $CPU_USAGE%" >> $LOG_FILE
fi

# 检查内存使用率
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
if [ $MEMORY_USAGE -gt $MEMORY_THRESHOLD ]; then
    echo "$(date): 警告 - 内存使用率过高: $MEMORY_USAGE%" >> $LOG_FILE
fi

# 检查磁盘使用率
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt $DISK_THRESHOLD ]; then
    echo "$(date): 警告 - 磁盘使用率过高: $DISK_USAGE%" >> $LOG_FILE
fi

# 检查服务可用性
if ! curl -s --max-time 5 http://127.0.0.1:5001/stats > /dev/null; then
    echo "$(date): 错误 - API服务无响应" >> $LOG_FILE
fi

# 检查响应时间
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://127.0.0.1:5001/stats)
RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc | cut -d. -f1)
if [ $RESPONSE_TIME_MS -gt $RESPONSE_TIME_THRESHOLD ]; then
    echo "$(date): 警告 - API响应时间过长: ${RESPONSE_TIME_MS}ms" >> $LOG_FILE
fi
```

## 🔐 安全说明

### API密钥安全

#### 密钥管理最佳实践
1. **不要在代码中硬编码API密钥**
2. **使用环境变量存储密钥**
3. **定期轮换API密钥**
4. **限制API密钥权限**

#### 环境变量安全设置
```bash
# 设置仅当前用户可读的环境变量
echo 'export ARK_API_KEY="你的API密钥"' >> ~/.bashrc
chmod 600 ~/.bashrc

# 或使用专门的环境文件
echo 'ARK_API_KEY=你的API密钥' > /root/.env
chmod 600 /root/.env
source /root/.env
```

### 数据库安全

#### 数据库文件权限
```bash
# 设置严格的文件权限
chmod 600 /root/hezhili-website/backend/data/chat_records.db
chown root:root /root/hezhili-website/backend/data/chat_records.db
```

#### 数据备份安全
```bash
# 加密备份文件
cd /root/hezhili-website/backend
gpg --symmetric --cipher-algo AES256 backups/chat_records_$(date +%Y%m%d).db

# 安全删除原始备份
shred -vfz -n 3 backups/chat_records_$(date +%Y%m%d).db
```

### 网络安全

#### 防火墙配置
```bash
# 仅允许必要端口
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 5001/tcp  # 阻止直接访问后端
sudo ufw enable
```

#### Nginx安全配置
```nginx
server {
    # 隐藏nginx版本
    server_tokens off;
    
    # 限制请求大小
    client_max_body_size 1M;
    
    # 限制请求频率
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;
    
    location /chat {
        limit_req zone=api burst=5 nodelay;
        proxy_pass http://127.0.0.1:5001;
        
        # 安全头部
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
    }
}
```

### 日志安全

#### 敏感信息过滤
确保日志中不包含：
- API密钥
- 用户敏感信息
- 内部系统路径

#### 日志文件权限
```bash
# 设置日志文件权限
chmod 640 /root/hezhili-website/logs/flask.log
chmod 640 /var/log/nginx/access.log
chmod 640 /var/log/nginx/error.log
```

### 定期安全检查

#### 安全检查清单
- [ ] 检查API密钥是否泄露
- [ ] 更新系统和依赖包
- [ ] 检查异常访问模式
- [ ] 验证文件权限设置
- [ ] 检查防火墙状态
- [ ] 分析错误日志

#### 安全监控脚本
```bash
#!/bin/bash
# security_check.sh

echo "=== 安全检查 $(date) ==="

# 检查文件权限
echo "检查关键文件权限..."
ls -la /root/hezhili-website/backend/data/chat_records.db
ls -la /root/.bashrc

# 检查异常连接
echo "检查网络连接..."
netstat -an | grep :5001 | wc -l

# 检查磁盘空间 (DoS攻击可能导致磁盘填满)
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo "警告: 磁盘使用率过高 $DISK_USAGE%"
fi

# 检查最近的错误日志
echo "最近的错误日志:"
tail -5 /var/log/nginx/error.log

echo "安全检查完成"
```

---

## 📞 技术支持

### 联系信息
- **开发者**: 何致力
- **学校**: 新加坡南洋理工大学  
- **专业**: 区块链
- **项目地址**: https://github.com/Shr1mpTop/hezhili.online

### 问题反馈

如果遇到问题，请提供以下信息：
1. **错误描述**: 详细的错误现象
2. **重现步骤**: 如何重现问题
3. **系统环境**: 操作系统、Python版本等
4. **错误日志**: 相关的错误日志
5. **配置信息**: 配置文件内容 (隐藏敏感信息)

### 许可证

本项目仅供个人学习和展示使用。

---

**最后更新**: 2025年8月25日

**文档版本**: v2.0 (整合版)

**重要提醒**: 
1. 定期备份数据库，避免数据丢失
2. 监控API使用量，避免超出配额  
3. 及时更新依赖包，确保安全性
4. 保护好API密钥，不要泄露
5. 定期检查日志，及时发现问题
