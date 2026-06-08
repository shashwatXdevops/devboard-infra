from fastapi import APIRouter, Depends, HTTPException
from app.schemas.task import TaskCreate, Task, TaskUpdate
from app.api.dependencies import get_mongo_db, get_current_active_user
from app.db.models.user import User
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=Task)
async def create_task(
    *,
    db = Depends(get_mongo_db),
    task_in: TaskCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Create a new unstructured task document in MongoDB."""
    task_dict = task_in.model_dump()
    task_dict["owner_id"] = current_user.id
    
    result = await db.tasks.insert_one(task_dict)
    created_task = await db.tasks.find_one({"_id": result.inserted_id})
    return created_task

@router.get("/", response_model=list[Task])
async def read_tasks(
    db = Depends(get_mongo_db),
    current_user: User = Depends(get_current_active_user),
):
    """Retrieve all tasks for the active user."""
    tasks = await db.tasks.find({"owner_id": current_user.id}).to_list(100)
    return tasks
