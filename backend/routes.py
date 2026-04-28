from fastapi import APIRouter, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import httpx
from .models import PostModel, CommentModel, FeedbackModel
from .email_service import EmailService
import re

router = APIRouter()

def get_database(request: Request) -> AsyncIOMotorDatabase:
    return request.app.mongodb

# Contact feedback API
@router.post("/contact/feedback")
async def send_feedback(feedback_data: FeedbackModel, request: Request):
    feedback = feedback_data.feedback.strip()
    user_email = feedback_data.email.strip() if feedback_data.email else None

    if not feedback:
        raise HTTPException(status_code=400, detail="反馈内容不能为空")

    if len(feedback) > 5000:
        raise HTTPException(status_code=400, detail="反馈内容过长，请控制在5000字以内")

    email_service = EmailService()

    try:
        # Send feedback to author
        await email_service.send_feedback_to_author(feedback, user_email or "匿名用户")

        # Send confirmation if user provided email
        if user_email and re.match(r"[^@]+@[^@]+\.[^@]+", user_email):
            try:
                await email_service.send_confirmation_to_user(user_email, feedback)
            except Exception as e:
                print(f"发送确认邮件失败: {e}")

        return {
            "success": True,
            "message": "反馈已成功发送，感谢您的意见！",
            "confirmation_sent": bool(user_email)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="发送失败，请稍后再试")

# Buffotte report API
@router.get("/buffotte/report")
async def get_buffotte_report():
    url = "https://buffotte.hezhili.online/report"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers={"Accept": "application/json"})
            response.raise_for_status()
            data = response.json()
            return {"status": "success", "data": data.get("data", data)}
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Buffotte report upstream returned {e.response.status_code}")
        except Exception as e:
            raise HTTPException(status_code=502, detail="无法获取 Buffotte 报告，请稍后再试。")

# Posts API
@router.get("/posts", response_model=List[PostModel])
async def get_posts(request: Request):
    db = get_database(request)
    posts = []
    async for post in db.posts.find().sort("date", -1):
        posts.append(PostModel(**post))
    return posts

@router.post("/posts", response_model=PostModel)
async def create_post(post_data: dict, request: Request):
    title = post_data.get("title")
    content = post_data.get("content")
    excerpt = post_data.get("excerpt", content[:200] + "..." if content else "")
    tags = post_data.get("tags", [])

    if not title or not content:
        raise HTTPException(status_code=400, detail="Title and content are required")

    db = get_database(request)
    post_doc = {
        "title": title,
        "content": content,
        "excerpt": excerpt,
        "tags": tags,
        "likes": 0,
        "liked_by": []
    }
    result = await db.posts.insert_one(post_doc)
    post_doc["_id"] = result.inserted_id
    return PostModel(**post_doc)

@router.get("/posts/{post_id}", response_model=PostModel)
async def get_post(post_id: str, request: Request):
    db = get_database(request)
    from bson import ObjectId
    post = await db.posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return PostModel(**post)

@router.post("/posts/{post_id}/like")
async def like_post(post_id: str, like_data: dict, request: Request):
    db = get_database(request)
    from bson import ObjectId
    user_id = like_data.get("userId", request.client.host)

    post = await db.posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    liked_by = post.get("liked_by", [])
    if user_id in liked_by:
        # Unlike
        liked_by.remove(user_id)
        likes = len(liked_by)
        await db.posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {"liked_by": liked_by, "likes": likes}}
        )
        has_liked = False
    else:
        # Like
        liked_by.append(user_id)
        likes = len(liked_by)
        await db.posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {"liked_by": liked_by, "likes": likes}}
        )
        has_liked = True

    return {"likes": likes, "hasLiked": has_liked}

# Comments API
@router.get("/posts/{post_id}/comments", response_model=List[CommentModel])
async def get_comments(post_id: str, request: Request):
    db = get_database(request)
    comments = []
    async for comment in db.comments.find({"post_id": post_id}).sort("date", -1):
        comments.append(CommentModel(**comment))
    return comments

@router.post("/posts/{post_id}/comments", response_model=CommentModel)
async def add_comment(post_id: str, comment_data: dict, request: Request):
    author = comment_data.get("author", "Anonymous")
    content = comment_data.get("content")

    if not content:
        raise HTTPException(status_code=400, detail="Comment content is required")

    db = get_database(request)
    comment_doc = {
        "post_id": post_id,
        "author": author,
        "content": content
    }
    result = await db.comments.insert_one(comment_doc)
    comment_doc["_id"] = result.inserted_id
    return CommentModel(**comment_doc)