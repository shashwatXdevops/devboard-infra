from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId

# Helper class to handle MongoDB ObjectId serialization
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, _=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}

# Base Task Model
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "TODO"  # e.g., TODO, IN_PROGRESS, DONE
    board_id: Optional[str] = None

# Properties to receive via API on creation
class TaskCreate(TaskBase):
    pass

# Properties to receive via API on update
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    board_id: Optional[str] = None
    ai_summary: Optional[str] = None

# Properties to return via API
class Task(TaskBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    ai_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
