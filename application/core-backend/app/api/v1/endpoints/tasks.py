from fastapi import APIRouter, Depends, HTTPException, status
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

@router.put("/{task_id}", response_model=Task)
async def update_task(
    task_id: str,
    task_in: TaskUpdate,
    db = Depends(get_mongo_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update a task's status or properties."""
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid Task ID")
        
    update_data = {k: v for k, v in task_in.model_dump().items() if v is not None}
    
    result = await db.tasks.update_one(
        {"_id": ObjectId(task_id), "owner_id": current_user.id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
        
    updated_task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    return updated_task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    db = Depends(get_mongo_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete a task."""
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid Task ID")
        
    result = await db.tasks.delete_one({"_id": ObjectId(task_id), "owner_id": current_user.id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
