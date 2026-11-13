# -*- coding: utf-8 -*-
"""DEV-011：前后端 API contract 测试（离线）。

锁住 commit 5222c62 修复的 7 处 contract 断裂 + 8 个路由的基础形状：
字段名（date/userId/hasLiked）、{status,data} 包装、2000 字评论上限、
InvalidId→400、错误响应结构（{"detail": ...}）、email mock 不真发。

全部通过 mongomock-motor + monkeypatch 注入，不需要真实 Mongo / SMTP / 外网。
"""
from datetime import datetime, timedelta

import pytest

ISO_DT = "%Y-%m-%dT%H:%M:%S"


def _is_hex24(v):
    return isinstance(v, str) and len(v) == 24 and all(c in "0123456789abcdef" for c in v)


# ---------------------------------------------------------------- GET /posts

class TestGetPosts:
    def test_list_shape_and_sort_by_date_desc(self, api, seed_post):
        old_id, _ = seed_post(title="旧文", date="2026-01-01T00:00:00")
        new_id, _ = seed_post(title="新文", date="2026-11-13T08:30:00")

        r = api.get("/api/posts")
        assert r.status_code == 200
        body = r.json()
        assert isinstance(body, list) and len(body) == 2

        # contract 锁点 #1：字段名是 date（不是 created_at）
        ids = [p["_id"] for p in body]
        assert ids == [new_id, old_id], "列表必须按 date 降序（前端博客列表依赖）"

        for p in body:
            assert set(p.keys()) == {
                "_id", "title", "content", "excerpt", "date", "tags", "likes", "liked_by",
            }
            assert _is_hex24(p["_id"])
            assert "created_at" not in p
            datetime.strptime(p["date"], ISO_DT)  # date 是 ISO 字符串
            assert isinstance(p["tags"], list)
            assert isinstance(p["likes"], int)
            assert isinstance(p["liked_by"], list)

    def test_empty_db_returns_empty_list(self, api):
        r = api.get("/api/posts")
        assert r.status_code == 200
        assert r.json() == []

    def test_liked_by_exposed_as_snake_case_list(self, api, seed_post):
        pid, _ = seed_post(likes=3, liked_by=["u1", "u2", "u3"])
        r = api.get("/api/posts")
        post = next(p for p in r.json() if p["_id"] == pid)
        assert post["likes"] == 3
        assert post["liked_by"] == ["u1", "u2", "u3"]


# ------------------------------------------------------------- POST /posts

class TestCreatePost:
    def test_create_returns_full_post_model(self, api):
        r = api.post("/api/posts", json={"title": "标题", "content": "内容" * 300})
        assert r.status_code == 200
        p = r.json()
        assert _is_hex24(p["_id"])
        assert p["title"] == "标题"
        assert p["likes"] == 0 and p["liked_by"] == []
        assert p["tags"] == []
        # 自动摘要 = content[:200] + "..."
        assert p["excerpt"].endswith("...") and len(p["excerpt"]) == 203
        datetime.fromisoformat(p["date"])  # 服务端补 date 字段（utcnow，可含微秒）

    def test_create_persists_and_readable(self, api):
        pid = api.post("/api/posts", json={"title": "A", "content": "B", "tags": ["x"]}).json()["_id"]
        r = api.get(f"/api/posts/{pid}")
        assert r.status_code == 200
        assert r.json()["_id"] == pid
        assert r.json()["tags"] == ["x"]

    def test_create_missing_fields_400_with_detail(self, api):
        r = api.post("/api/posts", json={"title": "只有标题"})
        assert r.status_code == 400
        assert r.json() == {"detail": "Title and content are required"}


# ----------------------------------------------------------- GET /posts/{id}

class TestGetPostById:
    def test_get_by_id_shape(self, api, seed_post):
        pid, doc = seed_post(title="详情", content="正文")
        r = api.get(f"/api/posts/{pid}")
        assert r.status_code == 200
        p = r.json()
        assert p["_id"] == pid
        assert p["title"] == "详情"
        assert p["content"] == "正文"
        assert set(p.keys()) == {"_id", "title", "content", "excerpt", "date", "tags", "likes", "liked_by"}

    def test_invalid_objectid_returns_400(self, api):
        # contract 锁点 #5：InvalidId → 400（而非 500/404）
        for bad in ("not-an-objectid", "123", "zzzz", "00000000000000000000000g"):
            r = api.get(f"/api/posts/{bad}")
            assert r.status_code == 400, f"{bad!r} 应返回 400"
            assert r.json() == {"detail": "Invalid post id"}

    def test_valid_objectid_missing_post_returns_404(self, api):
        r = api.get("/api/posts/" + "0" * 24)
        assert r.status_code == 404
        assert r.json() == {"detail": "Post not found"}


# ------------------------------------------------------- POST /posts/{id}/like

class TestLikePost:
    def test_like_returns_likes_and_has_liked(self, api, seed_post):
        # contract 锁点 #2：请求字段 userId、响应字段 hasLiked（不是 liked / user_id）
        pid, _ = seed_post()
        r = api.post(f"/api/posts/{pid}/like", json={"userId": "user-abc"})
        assert r.status_code == 200
        body = r.json()
        assert body == {"likes": 1, "hasLiked": True}

    def test_second_like_same_user_toggles_off(self, api, seed_post):
        pid, _ = seed_post()
        assert api.post(f"/api/posts/{pid}/like", json={"userId": "u1"}).json() == {"likes": 1, "hasLiked": True}
        assert api.post(f"/api/posts/{pid}/like", json={"userId": "u1"}).json() == {"likes": 0, "hasLiked": False}

    def test_two_distinct_users_accumulate(self, api, seed_post):
        pid, _ = seed_post()
        assert api.post(f"/api/posts/{pid}/like", json={"userId": "u1"}).json()["likes"] == 1
        assert api.post(f"/api/posts/{pid}/like", json={"userId": "u2"}).json()["likes"] == 2

    def test_user_id_persisted_in_liked_by(self, api, seed_post):
        pid, _ = seed_post()
        api.post(f"/api/posts/{pid}/like", json={"userId": "user-abc"})
        # 经 GET /posts 回读（mongomock 的 find_one 是协程，sync 测试走 API 回读）
        post = next(p for p in api.get("/api/posts").json() if p["_id"] == pid)
        assert post["liked_by"] == ["user-abc"]  # 存的是 userId 值，落在 liked_by
        assert post["likes"] == 1

    def test_like_invalid_objectid_400(self, api):
        r = api.post("/api/posts/not-an-objectid/like", json={"userId": "u1"})
        assert r.status_code == 400
        assert r.json() == {"detail": "Invalid post id"}

    def test_like_missing_post_404(self, api):
        r = api.post(f"/api/posts/{'0' * 24}/like", json={"userId": "u1"})
        assert r.status_code == 404
        assert r.json() == {"detail": "Post not found"}


# ------------------------------------------------------------- Comments API

class TestComments:
    def test_add_comment_shape(self, api, seed_post):
        pid, _ = seed_post()
        r = api.post(f"/api/posts/{pid}/comments", json={"author": "小明", "content": "好文！"})
        assert r.status_code == 200
        c = r.json()
        assert set(c.keys()) == {"_id", "post_id", "author", "content", "date"}
        assert c["post_id"] == pid
        assert c["author"] == "小明"
        assert c["content"] == "好文！"
        assert _is_hex24(c["_id"])
        datetime.fromisoformat(c["date"])

    def test_comment_over_2000_chars_returns_422(self, api, seed_post):
        # contract 锁点 #4：正文 >2000 字 → 422（前端同帧加了 2000 字上限）
        pid, _ = seed_post()
        r = api.post(f"/api/posts/{pid}/comments", json={"content": "a" * 2001})
        assert r.status_code == 422
        assert r.json() == {"detail": "Comment content too long, max 2000 characters"}
        assert api.get(f"/api/posts/{pid}/comments").json() == []  # 未落库

    def test_comment_exactly_2000_chars_ok(self, api, seed_post):
        pid, _ = seed_post()
        r = api.post(f"/api/posts/{pid}/comments", json={"content": "a" * 2000})
        assert r.status_code == 200

    def test_comment_empty_or_missing_content_400(self, api, seed_post):
        pid, _ = seed_post()
        for payload in ({}, {"content": ""}, {"content": None}, {"content": 123}):
            r = api.post(f"/api/posts/{pid}/comments", json=payload)
            assert r.status_code == 400, f"{payload!r} 应 400"
            assert r.json() == {"detail": "Comment content is required"}

    def test_get_comments_list_sorted_newest_first(self, api, seed_post, seed_comment):
        pid, _ = seed_post()
        seed_comment(pid, author="A", content="first", date="2026-11-12T08:00:00")
        seed_comment(pid, author="B", content="second", date="2026-11-13T09:00:00")
        r = api.get(f"/api/posts/{pid}/comments")
        assert r.status_code == 200
        body = r.json()
        assert isinstance(body, list) and len(body) == 2
        assert [c["content"] for c in body] == ["second", "first"]  # date 降序
        for c in body:
            assert set(c.keys()) == {"_id", "post_id", "author", "content", "date"}

    def test_get_comments_api_created_shape_only(self, api, seed_post):
        # 路由入库的评论没有 date 字段（与线上文档一致），只锁形状不锁顺序
        pid, _ = seed_post()
        api.post(f"/api/posts/{pid}/comments", json={"author": "A", "content": "first"})
        api.post(f"/api/posts/{pid}/comments", json={"author": "B", "content": "second"})
        body = api.get(f"/api/posts/{pid}/comments").json()
        assert {c["content"] for c in body} == {"first", "second"}
        assert all(c["post_id"] == pid for c in body)

    def test_get_comments_empty_post(self, api, seed_post):
        pid, _ = seed_post()
        r = api.get(f"/api/posts/{pid}/comments")
        assert r.status_code == 200
        assert r.json() == []

    def test_get_invalid_objectid_comments_returns_empty_list(self, api):
        # 现行为锁定：GET comments 不解析 ObjectId（post_id 按字符串查询），
        # invalid id → 200 + 空列表；与 GET /posts/{id}、like 的 InvalidId→400 不对称
        r = api.get("/api/posts/not-an-objectid/comments")
        assert r.status_code == 200
        assert r.json() == []


# ------------------------------------------------------- POST /contact/feedback

class TestContactFeedback:
    def test_feedback_with_email_sends_two_mails(self, api, email_spy):
        r = api.post(
            "/api/contact/feedback",
            json={"feedback": "网站很棒", "email": "reader@example.com"},
        )
        assert r.status_code == 200
        body = r.json()
        assert body["success"] is True
        assert body["confirmation_sent"] is True
        assert isinstance(body["message"], str) and body["message"]
        # 邮件只进了 spy，没碰 SMTP（aiosmtplib.send 已被熔断为炸弹）
        assert len(email_spy) == 2
        assert email_spy[0] == ("author", "网站很棒", "reader@example.com")
        assert email_spy[1][0] == "confirmation" and email_spy[1][1] == "reader@example.com"

    def test_feedback_without_email_sends_author_only(self, api, email_spy):
        r = api.post("/api/contact/feedback", json={"feedback": "匿名反馈"})
        assert r.status_code == 200
        assert r.json()["confirmation_sent"] is False
        assert len(email_spy) == 1
        assert email_spy[0] == ("author", "匿名反馈", "匿名用户")

    def test_feedback_blank_400(self, api, email_spy):
        r = api.post("/api/contact/feedback", json={"feedback": "   "})
        assert r.status_code == 400
        assert r.json() == {"detail": "反馈内容不能为空"}
        assert email_spy == []  # 校验失败不发信

    def test_feedback_over_5000_chars_400(self, api, email_spy):
        r = api.post("/api/contact/feedback", json={"feedback": "a" * 5001})
        assert r.status_code == 400
        assert r.json() == {"detail": "反馈内容过长，请控制在5000字以内"}
        assert email_spy == []

    def test_feedback_missing_field_422_validation_error(self, api, email_spy):
        r = api.post("/api/contact/feedback", json={"email": "a@example.com"})
        assert r.status_code == 422
        detail = r.json()["detail"]
        assert isinstance(detail, list) and detail[0]["loc"] == ["body", "feedback"]
        assert email_spy == []

    def test_feedback_smtp_failure_maps_to_500(self, api, email_spy, monkeypatch):
        # 注意：email_spy 的假件被替换为“发信即炸”，路由应兜底成 500
        import backend.routes as backend_routes

        class ExplodingEmailService:
            async def send_feedback_to_author(self, feedback, user_email="匿名用户"):
                raise RuntimeError("smtp down")

            async def send_confirmation_to_user(self, user_email, feedback):
                raise RuntimeError("smtp down")

        monkeypatch.setattr(backend_routes, "EmailService", ExplodingEmailService)
        r = api.post("/api/contact/feedback", json={"feedback": "hello"})
        assert r.status_code == 500
        assert r.json() == {"detail": "发送失败，请稍后再试"}

    def test_invalid_email_still_200_no_confirmation(self, api, email_spy):
        # 路由对格式不合法的 email 静默跳过确认信，但主反馈照发
        r = api.post("/api/contact/feedback", json={"feedback": "hi", "email": "not-an-email"})
        assert r.status_code == 200
        assert r.json()["confirmation_sent"] is True  # 注意：该标志只看 email 是否提供
        assert [c[0] for c in email_spy] == ["author"]


# ------------------------------------------------------- GET /buffotte/report

class TestBuffotteReport:
    def test_report_wraps_upstream_data(self, api, buffotte_upstream):
        # contract 锁点 #3：响应是 {status, data} 包装（BuffottePanel 读 data 字段）
        buffotte_upstream(status_code=200, payload={"data": {"klines": [1, 2, 3], "total": 42}})
        r = api.get("/api/buffotte/report")
        assert r.status_code == 200
        body = r.json()
        assert body == {"status": "success", "data": {"klines": [1, 2, 3], "total": 42}}

    def test_report_passes_through_payload_without_data_key(self, api, buffotte_upstream):
        buffotte_upstream(status_code=200, payload={"foo": "bar"})
        r = api.get("/api/buffotte/report")
        assert r.status_code == 200
        assert r.json() == {"status": "success", "data": {"foo": "bar"}}

    def test_report_upstream_error_status_forwarded(self, api, buffotte_upstream):
        buffotte_upstream(status_code=503, payload={"error": "down"})
        r = api.get("/api/buffotte/report")
        assert r.status_code == 503
        assert r.json()["detail"] == "Buffotte report upstream returned 503"

    def test_report_network_failure_502(self, api, buffotte_upstream):
        buffotte_upstream(network_error=True)
        r = api.get("/api/buffotte/report")
        assert r.status_code == 502
        assert r.json() == {"detail": "无法获取 Buffotte 报告，请稍后再试。"}


# ------------------------------------------------------------------- CORS 冒烟

class TestAppSmoke:
    def test_openapi_lists_all_8_routes(self, api):
        spec = api.get("/openapi.json").json()
        paths = spec["paths"]
        assert "/api/contact/feedback" in paths
        assert "/api/buffotte/report" in paths
        assert set(paths["/api/posts"]) == {"get", "post"}
        assert set(paths["/api/posts/{post_id}"]) == {"get"}
        assert set(paths["/api/posts/{post_id}/like"]) == {"post"}
        assert set(paths["/api/posts/{post_id}/comments"]) == {"get", "post"}

    def test_cors_headers_present(self, api, seed_post):
        seed_post()
        r = api.options(
            "/api/posts",
            headers={"Origin": "https://hezhili.online", "Access-Control-Request-Method": "GET"},
        )
        assert r.status_code in (200, 204)
        # allow_credentials=True 时 starlette 回显具体 Origin 而非字面量 *
        assert r.headers.get("access-control-allow-origin") == "https://hezhili.online"
