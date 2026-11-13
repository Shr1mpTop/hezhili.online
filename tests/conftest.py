"""Contract 测试共享夹具：mongomock 注入 + SMTP 熔断 + Buffotte 上游 mock。

离线原则：
- Mongo：monkeypatch 掉 backend.main 命名空间里的 AsyncIOMotorClient（lifespan startup
  处 factory），让 app.mongodb 变成 mongomock-motor 的内存库 —— 产品代码零改动，
  startup/shutdown 两条真实代码路径仍被执行。
- SMTP：autouse 熔断夹具把 aiosmtplib.send 换成炸弹，任何真实发信企图都会让测试
  立刻红掉；路由里的 EmailService 由各测试显式替换为 spy 假件。
- Buffotte 上游（https://buffotte.hezhili.online/report）：只替换 backend.routes
  命名空间里的 httpx 名字，starlette/TestClient 自己那份 httpx 不受影响。
"""
import os
import sys
import types
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# 让 `import backend.main` 在任何调用目录下都可用（backend 是 namespace package）
REPO_ROOT = Path(__file__).resolve().parents[1]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

# 双保险：测试进程里绝不碰真实 SMTP / 真实 Mongo 远端
os.environ.setdefault("MONGODB_URL", "mongodb://mongomock-invalid:27000/offline-tests")


@pytest.fixture(autouse=True)
def _offline_guards(monkeypatch):
    """熔断真实外呼：SMTP 发信、真实 httpx 网络请求（buffotte 用假件时不受影响）。"""
    import aiosmtplib

    def _no_smtp(*args, **kwargs):
        raise AssertionError("测试试图真实发送邮件（aiosmtplib.send）—— 离线合约被破坏")

    monkeypatch.setattr(aiosmtplib, "send", _no_smtp)


@pytest.fixture()
def api(monkeypatch):
    """TestClient 包住真实 app，但 Mongo client factory 被换成 mongomock-motor。"""
    import backend.main as backend_main
    from mongomock_motor import AsyncMongoMockClient as MockClient

    monkeypatch.setattr(backend_main, "AsyncIOMotorClient", MockClient)
    with TestClient(backend_main.app) as tc:  # with 语句触发 lifespan startup/shutdown
        tc.mongo_db = backend_main.app.mongodb  # mongomock 库，测试用它直接造数
        yield tc


@pytest.fixture()
def email_spy(monkeypatch):
    """把 backend.routes.EmailService 换成记录调用的假件，返回调用记录列表。

    记录格式：("author", feedback, user_email) / ("confirmation", user_email, feedback_excerpt)
    """
    import backend.routes as backend_routes

    sent = []

    class FakeEmailService:
        def __init__(self):  # 与真件构造签名兼容（真件读 SMTP 环境变量，假件不需要）
            pass

        async def send_feedback_to_author(self, feedback, user_email="匿名用户"):
            sent.append(("author", feedback, user_email))

        async def send_confirmation_to_user(self, user_email, feedback):
            sent.append(("confirmation", user_email, feedback[:200]))

    monkeypatch.setattr(backend_routes, "EmailService", FakeEmailService)
    return sent


def _fake_httpx_module(handler):
    """构造只够 routes.py 用的假 httpx 命名空间（AsyncClient + HTTPStatusError）。"""
    import httpx

    class FakeAsyncClient:
        def __init__(self, *args, **kwargs):
            self._client = httpx.AsyncClient(
                transport=httpx.MockTransport(handler), *args, **kwargs
            )

        async def __aenter__(self):
            await self._client.__aenter__()
            return self

        async def __aexit__(self, *exc):
            return await self._client.__aexit__(*exc)

        async def get(self, url, **kwargs):
            return await self._client.get(url, **kwargs)

    return types.SimpleNamespace(AsyncClient=FakeAsyncClient, HTTPStatusError=httpx.HTTPStatusError)


@pytest.fixture()
def buffotte_upstream(monkeypatch):
    """注册 Buffotte 上游假响应。用法：buffotte_upstream(status_code, payload)。

    payload 为 dict 时作为上游 JSON 返回（routes 取 data.get("data", data)）。
    status_code >= 400 时上游 raise_for_status 抛 HTTPStatusError（routes 会转发状态码）。
    """
    import backend.routes as backend_routes

    def _install(status_code=200, payload=None, network_error=False):
        def handler(request: "httpx.Request") -> "httpx.Response":
            import httpx

            if network_error:
                raise httpx.ConnectError("simulated network failure")
            return httpx.Response(status_code, json=payload if payload is not None else {})

        monkeypatch.setattr(backend_routes, "httpx", _fake_httpx_module(handler))
        return status_code, payload

    return _install


@pytest.fixture()
def seed_post(api):
    """往 mongomock 里插一篇文章，返回 (str_id, 文档)。

    mongomock_motor 是 motor 风格异步 API，sync 测试里用 asyncio.run 驱动单条写入。
    """

    def _seed(title="测试文章", content="正文内容", date="2026-11-13T10:00:00", **extra):
        import asyncio
        from bson import ObjectId

        doc = {
            "title": title,
            "content": content,
            "excerpt": extra.pop("excerpt", content[:200] + ("..." if len(content) > 200 else "")),
            "date": date,
            "tags": extra.pop("tags", ["test"]),
            "likes": 0,
            "liked_by": [],
        }
        doc.update(extra)
        doc["_id"] = ObjectId()
        asyncio.run(api.mongo_db.posts.insert_one(dict(doc)))
        return str(doc["_id"]), doc

    return _seed


@pytest.fixture()
def seed_comment(api):
    """直接往 mongomock 插一条带 date 的评论（用于锁定 date 降序契约）。

    注意：路由本身入库时不写 date（真实线上文档同样没有），带 date 的种子
    只为验证 sort("date", -1) 的排序意图。返回 (str_id, 文档)。
    """

    def _seed(post_id, author="A", content="c", date="2026-11-13T09:00:00"):
        import asyncio
        from bson import ObjectId

        doc = {"post_id": post_id, "author": author, "content": content, "date": date}
        doc["_id"] = ObjectId()
        asyncio.run(api.mongo_db.comments.insert_one(dict(doc)))
        return str(doc["_id"]), doc

    return _seed
