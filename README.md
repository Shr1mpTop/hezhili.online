# hezhili.online 项目架构概述

> 📍 本手册归属：《手册总目录》（E:\github\手册总目录.md，相对路径 ../手册总目录.md）｜ 总手册：《运维手册》（E:\github\运维手册.md）。**改动本手册后必须同步更新《手册总目录》对应条目。**

## 项目简介

这是一个个人网站项目，包含前端展示页面和后端API服务。网站采用前后端分离架构，前端使用React构建单页应用，后端使用FastAPI提供API服务。项目使用uv进行Python包管理。

## 技术栈

### 前端 (frontend/)

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **路由**: 无路由库（单页滚动章节式导航，见 `components/Overlay/FloatingNav.tsx` + `hooks/useScrollProgress.ts`）
- **主要依赖**（以 `frontend/package.json` 为准）:
  - `axios`: HTTP客户端
  - `marked`: Markdown渲染
  - `highlight.js`: 代码语法高亮
  - `gsap`（含 ScrollTrigger）: 滚动与过渡动画
  - `three` / `@react-three/fiber` / `@react-three/drei` / `@react-three/postprocessing`: 3D 场景与后期处理
- **部署**: 使用Vite preview在生产环境提供静态文件服务

### 后端 (backend/)

- **框架**: FastAPI (Python)
- **数据库**: MongoDB (使用Motor异步驱动)
- **邮件服务**: aiosmtplib + 阿里云SMTP
- **主要依赖**:
  - `fastapi`: Web框架
  - `uvicorn`: ASGI服务器
  - `motor`: MongoDB异步客户端
  - `pydantic`: 数据验证
  - `python-dotenv`: 环境变量管理
- **端口**: 8000

### 包管理

- **工具**: uv (Python包管理器)
- **配置文件**: pyproject.toml

### 部署与运维

- **进程管理**: PM2
- **配置文件**: `ecosystem.config.cjs`
- **部署脚本**: `deploy_pm2.sh`

## 项目结构

```
hezhili.online/
├── deploy_pm2.sh              # PM2部署脚本
├── ecosystem.config.cjs       # PM2应用配置
├── email_sender.py            # 邮件发送脚本 (保留)
├── pyproject.toml             # uv项目配置
├── uv.lock                    # uv依赖锁定文件
├── backend/                   # 后端代码 (Python)
│   ├── main.py                # FastAPI应用入口
│   ├── models.py              # Pydantic数据模型
│   ├── routes.py              # API路由定义
│   └── email_service.py       # 邮件服务
├── frontend/                  # 前端代码 (React)
│   ├── src/
│   │   ├── App.tsx            # 主应用组件
│   │   ├── main.tsx           # React应用入口
│   │   ├── components/
│   │   │   ├── Experience/    # three/r3f 3D 场景（Canvas、镜头路径、6 个章节、shaders/）
│   │   │   ├── Overlay/       # DOM 覆盖层：ScrollContainer、FloatingNav、6 个 Section
│   │   │   │   └── panels/    # BlogPanel / PostDetailPanel / BuffottePanel
│   │   │   └── shared/        # GlassCard / ProjectCard / SkillBar / AnimatedText
│   │   ├── hooks/             # useScrollProgress / useMediaQuery / useReducedMotion
│   │   ├── utils/             # cameraPath / colors
│   │   └── styles/            # variables.css 等
│   ├── vite.config.ts         # Vite配置（/api 代理到 localhost:8000）
│   ├── package.json           # npm依赖
│   └── index.html             # HTML模板
├── tests/                     # 离线 contract 测试（conftest.py + test_api_contract.py，36 用例）
└── posts/                     # 博客文章(Markdown)
    ├── example.md             # 示例文章
    └── buffotte-blog.md       # 实际文章
```

## 主要功能

### 前端功能

- **单页应用(SPA)**: 无路由库，滚动驱动的章节式切换（`Overlay/ScrollContainer.tsx` + `FloatingNav.tsx`）
- **响应式设计**: 适配不同屏幕尺寸
- **博客系统**: Markdown文章渲染，支持代码高亮
- **联系表单**: 用户反馈提交
- **动画效果**: GSAP（ScrollTrigger）驱动过渡动画 + three/r3f 3D 场景

### 后端API

- **博客文章管理**: CRUD操作
- **评论系统**: 文章评论功能
- **联系表单**: 处理用户反馈并发送邮件
- **邮件服务**: 集成阿里云邮件服务，支持反馈邮件和确认邮件
- **Buffotte报告**: 代理外部API

### 内容管理

- **Markdown文章**: 存储在`posts/`目录
- **元数据**: YAML front matter (标题、摘要、标签)
- **动态渲染**: 前端实时解析Markdown

## 部署流程

1. **安装依赖**:

   ```bash
   # Python依赖
   uv sync

   # 前端依赖
   cd frontend && npm install
   ```

2. **前端构建**:

   ```bash
   cd frontend
   npm run build
   ```

3. **PM2启动**:

   ```bash
   ./deploy_pm2.sh
   ```

   或手动:

   ```bash
   pm2 start ecosystem.config.cjs
   ```

4. **服务端口**:
   - 前端: http://localhost:5173
   - 后端: http://localhost:8000

## 开发环境设置

### 前端开发

```bash
cd frontend
npm install
npm run dev  # 开发服务器，端口5173
```

### 后端开发

```bash
# 激活虚拟环境
uv run python backend/main.py
# 或
uv run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 数据库

确保MongoDB运行，并配置环境变量(.env文件)中的数据库连接字符串。

### 邮件服务

配置SMTP环境变量:

- SMTP_SERVER
- SMTP_PORT
- SMTP_USERNAME
- SMTP_PASSWORD
- FROM_EMAIL
- AUTHOR_EMAIL

## 关键文件说明

- `pyproject.toml`: uv项目配置，包含Python依赖
- `ecosystem.config.cjs`: 定义PM2管理的应用配置
- `deploy_pm2.sh`: 一键部署脚本
- `backend/routes.py`: 包含所有API端点定义
- `frontend/src/App.tsx`: 主应用组件，处理页面路由
- `posts/*.md`: Markdown格式的博客文章

## 注意事项

- 前端使用Vite进行构建和开发服务器
- 后端使用FastAPI的异步特性，支持高并发
- 数据库使用Motor进行异步MongoDB操作
- 邮件服务使用aiosmtplib进行异步邮件发送
- 项目支持PM2的进程管理和自动重启
- 前端代理API请求到后端端口8000

这个项目是一个完整的个人网站解决方案，包含博客、项目展示、联系方式等典型个人网站功能。

---

> ⚠️ **以下至文末"合约测试"之前的内容 = 已废弃的历史存档（Vue + Express/Mongoose 时代）**，原样保留仅供参考，**不要照此操作**。
> 当时前端是 Vue（`App.vue`）、后端是 Node（`backend/routes.js`、nodemon 热重载、后端端口 **3002**）、邮件用 `AK_ID`/`AK_SECRET`。
> 现状（2026-11-18 核验）：前端 **React 18 + Vite**（`frontend/src/*.tsx`，无 `Sidebar/Home/Blog/PostDetail` 页组件）；后端 **FastAPI**（`backend/{main,models,routes}.py`，端口 **8000**，见 `ecosystem.config.cjs`）；邮件走阿里云 SMTP 环境变量。
> 仓库里**已无** `backend/routes.js` 与 `backend/package.json`，仅剩遗留的 `backend/email-service.js` 和无主 `backend/node_modules/`，因此本节"后端开发 `npm install` / `npm run dev`"已不可用。
> 本节的"主要功能/部署流程/注意事项"与上文正文重复且冲突，**一律以上文正文为准**。

│ └── package.json
├── frontend/ # 前端代码
│ ├── src/
│ │ ├── App.vue # 主应用组件
│ │ ├── main.js # Vue应用入口
│ │ ├── components/ # Vue组件
│ │ │ ├── Sidebar.vue # 侧边栏导航
│ │ │ ├── Home.vue # 首页
│ │ │ ├── Blog.vue # 博客列表
│ │ │ ├── PostDetail.vue # 博客详情
│ │ │ └── ... # 其他页面组件
│ │ └── css/ # 样式文件
│ ├── public/ # 静态资源
│ ├── vite.config.js # Vite配置
│ └── package.json
└── posts/ # 博客文章(Markdown)
├── example.md # 示例文章
└── buffotte-blog.md # 实际文章

````

## 主要功能（历史存档·已废弃，见上门警示；现状以上文为准）

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
````

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

## 合约测试（离线）· DEV-011

后端 8 个路由有了一套**可离线跑**的 contract 测试（`tests/test_api_contract.py`，36 用例）：
Mongo 用 mongomock-motor 内存库、SMTP 熔断+假件、Buffotte 上游假 transport——不碰真实
Mongo/SMTP/外网，也不读 `.env`。环境与注入细节见 `tests/README_contract.md`。

```powershell
# 一条命令跑（独立 dev 环境，不污染运行用 .venv）
.venv-dev\Scripts\python.exe -m pytest tests\test_api_contract.py -q
```

### 已锁定的 contract 修复（commit 5222c62，7 处）

| # | 断裂点 | 修复后契约 | 锁定用例 |
|---|---|---|---|
| 1 | 博客日期 `created_at`→`date` | 文章/评论字段名是 `date`（ISO 字符串），列表按 `date` 降序，无 `created_at` | `TestGetPosts::test_list_shape_and_sort_by_date_desc` 等 |
| 2 | 点赞 `user_id`+`liked`→`userId`+`hasLiked` | 请求带 `userId`，响应 `{"likes": N, "hasLiked": bool}`，值落 `liked_by` | `TestLikePost::*` |
| 3 | BuffottePanel 读 `{status,data}` 包装 | `/api/buffotte/report` 返回 `{"status":"success","data":…}`（上游 `data` 键取内层/透传） | `TestBuffotteReport::*` |
| 4 | 评论 2000 字上限 422 | `content` >2000 → `422 {"detail": "Comment content too long, max 2000 characters"}`；恰好 2000 → 200 | `TestComments::test_comment_over_2000_chars_returns_422` / `…_exactly_2000_chars_ok` |
| 5 | ObjectId InvalidId→400 | 坏 id → `400 {"detail": "Invalid post id"}`（GET /posts/{id} 与 like 两处；GET comments 不解析 id，返回 200 `[]`——现行为已注明锁定） | `TestGetPostById::test_invalid_objectid_returns_400` 等 |
| 6 | 评论失败 UX（2000 字前端上限/失败提示/失败不清空） | 后端侧对应契约：超限 422 + 错误结构 `{"detail": …}` 恒定，前端可据此提示 | `TestComments::*` + 各错误结构断言 |
| 7 | 反馈邮件链路 | 路由逻辑与发信解耦可测：200 时 spy 记录 author（+确认信），校验失败不发信，发信炸→500 兜底 | `TestContactFeedback::*` |

错误响应结构统一为 HTTPException 的 `{"detail": …}`（422 校验错误为 `{"detail": […]}`），
全部用例逐条断言状态码 + 结构。

### 附带发现（第 8 处断裂，已修）

`backend/models.py` 的 `PyObjectId` 在仓库自锁的 pydantic 2.13.3 下必崩（v1 式
`__get_validators__` 被 v2 shim 以 `(value, info)` 调用）→ 所有文章/评论路由 500。
已最小修复为 pydantic v2 原生 core schema（行为不变，v1 钩子保留）。分析见
`tests/README_contract.md`。

---

> ✅ 最后核验：2026-11-18（手册治理代理对照《运维手册》§0/§2/§13.125 当前真实状态逐项核验；统一索引见《手册总目录》）
