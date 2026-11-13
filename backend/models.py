from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
import json

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        # pydantic v2 原生 schema：修复 v1 式 __get_validators__ 在 pydantic 2.x 下
        # 被以 (value, info) 调用导致 PostModel/CommentModel 构造全崩的问题
        # （uv.lock 钉的 pydantic 2.13.3 实测必崩，见 tests/README_contract.md）
        from pydantic_core import core_schema

        return core_schema.with_info_plain_validator_function(
            cls._validate_v2,
            serialization=core_schema.to_string_ser_schema(),
        )

    @classmethod
    def _validate_v2(cls, v, _info):
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}

    def __str__(self):
        return str(self)

class PostModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    title: str
    content: str
    excerpt: str
    date: datetime = Field(default_factory=datetime.utcnow)
    tags: List[str] = []
    likes: int = 0
    liked_by: List[str] = []

    class Config:
        from_attributes = True
        json_encoders = {ObjectId: str}

class CommentModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    post_id: str
    author: str
    content: str
    date: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
        json_encoders = {ObjectId: str}

class FeedbackModel(BaseModel):
    feedback: str
    email: Optional[str] = None