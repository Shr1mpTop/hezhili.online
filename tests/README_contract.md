# 合约测试（离线）· DEV-011

锁住 commit `5222c62`（前后端 contract 断裂修复 7 处）对应的 API 行为 + 8 个路由的基础形状。
**全程离线**：Mongo 用 mongomock-motor 内存库，SMTP 熔断，Buffotte 上游用假 transport。
不需要真实 Mongo / 真实 SMTP / 外网，也不会发一封邮件。

## 一条命令跑

```powershell
cd E:\github\hezhili.online
.venv-dev\Scripts\python.exe -m pytest tests\test_api_contract.py -q
```

退出码 0 = 全绿。当前 36 个用例，约 0.5s。

## dev 环境怎么建（不碰现有 .venv）

```powershell
cd E:\github\hezhili.online
uv venv .venv-dev --python 3.14
# 依赖版本钉到 uv.lock（pydantic/fastapi/motor/httpx/aiosmtplib 与生产一致），再加测试件：
uv pip install --python .venv-dev\Scripts\python.exe `
  "fastapi==0.136.1" "pydantic==2.13.3" "motor==3.7.1" "httpx==0.28.1" "aiosmtplib==5.1.0" `
  python-dotenv pytest mongomock-motor `
  -i https://pypi.tuna.tsinghua.edu.cn/simple
# 直连失败时追加：--proxy http://127.0.0.1:7897 或换 -i https://mirrors.aliyun.com/pypi/simple
```

> ⚠️ **不要省略版本钉子**：用最新 pydantic（2.14.x）跑会因 v1-shim 行为变化产生假红；
> 生产依赖以 `uv.lock` 为准。现有 `.venv` 是运行环境，测试环境独立在 `.venv-dev`
>（已加 `.gitignore`），互不污染。

## mongomock 注入方案（motor，不是 pymongo）

- 后端用的是 **motor** 异步客户端（`backend/main.py` 的 `AsyncIOMotorClient`，lifespan
  startup 里创建、`get_database()` 每请求读 `request.app.mongodb`）。
- 因此选 **mongomock-motor**（它包了 mongomock，导出名是 `AsyncMongoMockClient`，
  motor 风格异步 API）。
- 注入层面：**client factory 层** —— conftest 里
  `monkeypatch.setattr(backend.main, "AsyncIOMotorClient", AsyncMongoMockClient)`，
  然后用 `with TestClient(app)` 触发真实 lifespan。startup 执行的是真代码路径，只是
  client 换成了内存实现；shutdown 的 `close()` 也照跑。产品路由/models 代码零 mock。
- 种子数据：`asyncio.run(db.posts.insert_one(...))` 驱动单条异步写入（sync 测试里
  motor 风格方法必须显式 await，否则协程不执行、数据"神秘消失"——第一版就栽在这）。

## 三个外部依赖的替身

| 依赖 | 替身方式 |
|---|---|
| MongoDB | `backend.main.AsyncIOMotorClient` → `mongomock_motor.AsyncMongoMockClient`（factory 层） |
| SMTP | 路由内实例化的 `EmailService` → `monkeypatch.setattr(backend.routes, "EmailService", FakeSpy)`；另加 autouse 熔断：`aiosmtplib.send` 被换成炸弹，任何真实发信企图直接红 |
| Buffotte 上游 | `monkeypatch.setattr(backend.routes, "httpx", SimpleNamespace(AsyncClient=…, HTTPStatusError=…))`，内部用 `httpx.MockTransport` 假响应；只换 routes 命名空间的名字，不影响 TestClient 自己的 httpx |

`.env` 不被读取、不需要存在；测试自己注入环境变量（`MONGODB_URL` 指向无效地址，
反正 mongomock 不看它）。

## 覆盖范围（8 路由 / 36 用例）

- `GET /api/posts`：列表形状（`_id`/`title`/`content`/`excerpt`/`date`/`tags`/`likes`/`liked_by`）、date 降序、无 `created_at`、空库返回 `[]`
- `POST /api/posts`：创建形状、自动摘要 `content[:200]+"..."`、落库可读、缺字段 400 `{"detail": "Title and content are required"}`
- `GET /api/posts/{id}`：形状；InvalidId → 400 `{"detail": "Invalid post id"}`（含 4 种坏 id 变体）；合法 id 但不存在 → 404
- `POST /api/posts/{id}/like`：请求 `userId` / 响应 `hasLiked`+`likes`、同 user 再点=取消、双 user 累加、`liked_by` 落库、InvalidId 400、404
- `GET+POST /api/posts/{id}/comments`：形状（含 `date`）、>2000 字 → 422、恰好 2000 → 200、空/缺/非字符串 content → 400、date 降序（带种子的排序意图）、InvalidId → 200 `[]`（现行为：此路由不解析 ObjectId，与上面两处不对称，已注明）
- `POST /api/contact/feedback`：带邮箱 → 200 + 两封 spy 记录（author+confirmation）；无邮箱 → 只发 author；空白 → 400；>5000 → 400；缺 feedback 字段 → 422（FastAPI 校验列表结构）；发信炸 → 500 兜底；坏格式邮箱 → 主反馈照发
- `GET /api/buffotte/report`：`{status: "success", data: …}` 包装（上游带 `data` 键取内层、不带则透传）、上游 503 → 原样转发、上游连接失败 → 502
- 冒烟：openapi.json 列全 8 条路由、CORS 头（`allow_credentials=True` 时回显具体 Origin）

## 测试期间发现并修复的第 8 处断裂（产品代码唯一改动）

`backend/models.py` 的 `PyObjectId` 是 pydantic v1 写法（`__get_validators__`）。在仓库
**自己的 uv.lock 钉的 pydantic 2.13.3** 下（生产 `.venv` 同版本实测复现），v2 兼容 shim
以 `(value, info)` 调用 validator → `TypeError: validate() takes 2 positional arguments
but 3 were given` → **GET/POST /posts、comments 等所有构造 PostModel/CommentModel 的
路由 500**。线上今天没炸只因远端服务器跑的是更旧的依赖集；下次 `uv sync` + 部署就会炸。

最小修复：给 `PyObjectId` 加 pydantic v2 原生 `__get_pydantic_core_schema__`
（`with_info_plain_validator_function` + `to_string_ser_schema`），保留原 v1 钩子不动。
序列化行为不变（`_id` 仍是 24 位 hex 字符串、`by_alias` 输出）。本套合约测试即回归网。
