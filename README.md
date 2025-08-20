# 何致力个人网站

这是何致力的个人网站项目，包含AI对话功能、访客统计和数据管理系统。

## 功能特性

- 🤖 **AI对话系统**: 基于字节跳动豆包API的智能对话
- 💬 **对话记录**: 完整的用户对话历史保存
- 📊 **数据统计**: 访客数据统计和分析
- 🔧 **运维工具**: 完整的维护和监控脚本

## 项目结构

```
hezhili-website/
├── frontend/                    # 前端代码
│   └── public/                 # 静态资源
│       ├── pages/              # 页面文件
│       └── src/                # 源文件 (JS/CSS/Assets)
├── backend/                    # 后端代码
│   ├── api/app.py             # Flask主应用
│   ├── models/database.py     # 数据库模型
│   ├── scripts/               # 数据库管理脚本
│   ├── config/                # 配置文件
│   ├── data/                  # SQLite数据库
│   └── start.sh              # 启动脚本
├── scripts/                   # 运维脚本
│   ├── backup.sh             # 数据备份脚本
│   ├── health_check.sh       # 健康检查脚本
│   └── log_analysis.sh       # 日志分析脚本
├── logs/                     # 日志文件
├── certs/                    # SSL证书
├── MAINTENANCE_GUIDE.md      # 维护手册
└── README.md                 # 项目说明

## 快速开始

### 1. 启动后端服务

```bash
cd backend
chmod +x start.sh
./start.sh
```

### 2. 初始化数据库

```bash
cd backend
python3 scripts/init_db.py
```

### 3. 设置环境变量

```bash
export ARK_API_KEY=your_api_key_here
```

### 4. 测试系统

```bash
# 健康检查
bash scripts/health_check.sh

# 测试API
curl -X POST http://127.0.0.1:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"text": "你好"}'
```

## 运维管理

### 日常维护脚本

- **健康检查**: `bash scripts/health_check.sh` - 检查系统状态
- **数据备份**: `bash scripts/backup.sh` - 备份数据库和配置
- **日志分析**: `bash scripts/log_analysis.sh` - 分析访问日志和性能

### 数据库管理

```bash
# 初始化数据库
cd backend && python3 scripts/init_db.py

# 直接查询数据库
sqlite3 backend/data/chat_records.db

# 查看对话记录
sqlite3 backend/data/chat_records.db "SELECT * FROM chat_messages ORDER BY timestamp DESC LIMIT 10;"
```

### 服务管理

```bash
# 启动服务
cd backend && ./start.sh

# 停止服务
pkill -f "python.*app.py"

# 查看服务状态
ps aux | grep "python.*app.py"

# 查看日志
tail -f logs/flask.log
```

## API 接口

### 聊天接口
- **URL**: `POST /chat`
- **参数**: `{"text": "用户消息", "session_id": "会话ID(可选)"}`
- **返回**: `{"content": "AI回复", "session_id": "会话ID"}`

### 历史记录接口
- **URL**: `GET /chat/history?session_id=xxx&limit=20`
- **返回**: 会话的历史消息记录

### 统计接口
- **URL**: `GET /stats?date=2025-08-21`
- **返回**: 指定日期的访客统计数据

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Python 3.12, Flask 2.0+
- **数据库**: SQLite 3
- **AI服务**: 字节跳动豆包API (ARK)
- **部署**: Linux, Nginx (可选)

## 安全说明

1. **API密钥**: 请妥善保管 `ARK_API_KEY`
2. **数据库**: 定期备份，避免数据丢失
3. **日志**: 定期清理，避免磁盘空间不足
4. **访问控制**: 生产环境建议配置防火墙和访问限制

## 维护手册

详细的维护说明请参考 **[MAINTENANCE_GUIDE.md](MAINTENANCE_GUIDE.md)**，包含：
- 完整的运维流程
- 故障排查指南
- 性能优化建议
- 安全最佳实践

## 开发者

- **姓名**: 何致力
- **学校**: 新加坡南洋理工大学
- **专业**: 区块链
- **项目地址**: https://github.com/Shr1mpTop/hezhili.online

## 许可证

本项目仅供个人学习和展示使用。

---

最后更新: 2025年8月21日
前端文件位于 frontend/public 目录，可以直接部署到静态文件服务器。

## API文档

### Chat API
- URL: https://api.hezhili.online/chat
- 方法: POST
- 请求体:
  ```json
  {
    "text": "用户输入的文本"
  }
  ```
- 响应: 文本响应

## 技术栈
- 前端: HTML, CSS, JavaScript
- 后端: Python, Flask
- API: OpenAI API
