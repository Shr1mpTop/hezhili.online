# hezhili.online 项目架构概述

## 项目简介

这是一个个人网站项目，包含前端展示页面和后端API服务。网站采用前后端分离架构，前端使用Vue.js构建单页应用，后端使用Node.js + Express提供API服务。

## 技术栈

### 前端 (frontend/)

- **框架**: Vue 3
- **构建工具**: Vite
- **主要依赖**:
  - `markdown-it`: Markdown渲染
  - `highlight.js`: 代码语法高亮
  - `motion-v`: 动画效果
- **部署**: 使用Express服务器在生产环境提供静态文件服务

### 后端 (backend/)

- **框架**: Node.js + Express
- **数据库**: MongoDB (使用Mongoose ODM)
- **主要依赖**:
  - `mongoose`: MongoDB对象建模
  - `cors`: 跨域资源共享
  - `@alicloud/dm20151123`: 阿里云邮件服务
- **端口**: 3002

### 部署与运维

- **进程管理**: PM2
- **配置文件**: `ecosystem.config.cjs`
- **部署脚本**: `deploy_pm2.sh`
- **邮件服务**: Python脚本 (`email_sender.py`) 使用阿里云邮件服务

## 项目结构

```
hezhili.online/
├── deploy_pm2.sh              # PM2部署脚本
├── ecosystem.config.cjs       # PM2应用配置
├── email_sender.py            # 邮件发送脚本
├── backend/                   # 后端代码
│   ├── server.js              # Express服务器入口
│   ├── routes.js              # API路由定义
│   ├── database-connect.js    # 数据库连接
│   ├── email-service.js       # 邮件服务
│   ├── models/                # 数据模型
│   │   ├── Post.js           # 博客文章模型
│   │   └── Comment.js        # 评论模型
│   └── package.json
├── frontend/                  # 前端代码
│   ├── src/
│   │   ├── App.vue           # 主应用组件
│   │   ├── main.js           # Vue应用入口
│   │   ├── components/       # Vue组件
│   │   │   ├── Sidebar.vue   # 侧边栏导航
│   │   │   ├── Home.vue      # 首页
│   │   │   ├── Blog.vue      # 博客列表
│   │   │   ├── PostDetail.vue # 博客详情
│   │   │   └── ...           # 其他页面组件
│   │   └── css/              # 样式文件
│   ├── public/               # 静态资源
│   ├── vite.config.js        # Vite配置
│   └── package.json
└── posts/                    # 博客文章(Markdown)
    ├── example.md            # 示例文章
    └── buffotte-blog.md      # 实际文章
```

## 主要功能

### 前端功能

- **单页应用(SPA)**: Vue Router风格的页面切换
- **响应式设计**: 适配不同屏幕尺寸
- **博客系统**: Markdown文章渲染，支持代码高亮
- **联系表单**: 用户反馈提交
- **动画效果**: 使用motion-v库的过渡动画

### 后端API

- **博客文章管理**: CRUD操作
- **评论系统**: 文章评论功能
- **联系表单**: 处理用户反馈并发送邮件
- **邮件服务**: 集成阿里云邮件服务

### 内容管理

- **Markdown文章**: 存储在`posts/`目录
- **元数据**: YAML front matter (标题、摘要、标签)
- **动态渲染**: 前端实时解析Markdown

## 部署流程

1. **前端构建**:

   ```bash
   cd frontend
   npm run build
   ```

2. **PM2启动**:

   ```bash
   ./deploy_pm2.sh
   ```

   或手动:

   ```bash
   pm2 start ecosystem.config.cjs
   ```

3. **服务端口**:
   - 前端: http://localhost:5173
   - 后端: http://localhost:3002

## 开发环境设置

### 前端开发

```bash
cd frontend
npm install
npm run dev  # 开发服务器
```

### 后端开发

```bash
cd backend
npm install
npm run dev  # 使用nodemon热重载
```

### 数据库

确保MongoDB运行，并配置环境变量(.env文件)中的数据库连接字符串。

### 邮件服务

配置阿里云邮件服务的AK_ID和AK_SECRET环境变量。

## 关键文件说明

- `ecosystem.config.cjs`: 定义PM2管理的应用配置
- `deploy_pm2.sh`: 一键部署脚本
- `backend/routes.js`: 包含联系表单API和可能的博客API
- `frontend/src/App.vue`: 主应用组件，处理页面路由
- `posts/*.md`: Markdown格式的博客文章

## 注意事项

- 前端使用自定义serve.js而不是标准的vite preview
- 后端支持UTF-8编码，专门处理中文内容
- 邮件服务使用阿里云DM服务，支持反馈邮件和确认邮件
- 项目支持PM2的进程管理和自动重启

这个项目是一个完整的个人网站解决方案，包含博客、项目展示、联系方式等典型个人网站功能。
