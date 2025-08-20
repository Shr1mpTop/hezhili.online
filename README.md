# 个人网站项目

这是何致力的个人网站项目，包含前端页面和后端API服务。

## 项目结构

```
hezhili-website/
├── frontend/           # 前端代码
│   ├── public/        # 静态资源
│   │   ├── index.html
│   │   ├── main.js
│   │   ├── style.css
│   │   └── CNAME
│   └── src/
│       ├── js/        # JavaScript源文件
│       ├── css/       # 样式源文件
│       └── assets/    # 其他资源文件
├── backend/           # 后端代码
│   ├── api/          # API实现
│   │   └── app.py
│   ├── config/       # 配置文件
│   │   └── config.py
│   └── requirements.txt
├── certs/            # SSL证书
│   ├── hezhili.online.key
│   └── hezhili.online.pem
└── logs/             # 日志文件
    └── flask.log

## 部署说明

### 后端部署
1. 安装依赖：
```bash
cd backend
pip install -r requirements.txt
```

2. 设置环境变量：
```bash
export ARK_API_KEY=your_api_key
```

3. 运行服务：
```bash
python api/app.py
```

### 前端部署
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
