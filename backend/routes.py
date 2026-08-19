from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import get_current_user
import redis
import json

router = APIRouter(prefix="/tasks", tags=["Tasks"])


redis_client = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

@router.post("/", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_task = models.Task(**task.model_dump(), user_id=current_user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)


    redis_client.delete(f"tasks_user_{current_user.id}")

    return new_task

@router.get("/", response_model=list[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):

    cache_key = f"tasks_user_{current_user.id}"


    cached_tasks = redis_client.get(cache_key)
    if cached_tasks:
        print("Fetching from Redis Cache...")
        return json.loads(cached_tasks)


    print("🗄️ Fetching from PostgreSQL Database...")
    tasks = db.query(models.Task).filter(models.Task.user_id == current_user.id).all()


    tasks_list = [schemas.TaskResponse.model_validate(t).model_dump() for t in tasks]
    redis_client.set(cache_key, json.dumps(tasks_list), ex=3600)

    return tasks

@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_data: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == current_user.id).first()

    if not task:
        raise HTTPException(status_code=404, detail="the task not found")

    task.title = task_data.title
    task.desc = task_data.desc
    task.done = task_data.done

    db.commit()
    db.refresh(task)


    redis_client.delete(f"tasks_user_{current_user.id}")

    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == current_user.id).first()

    if not task:
        raise HTTPException(status_code=404, detail="the task not found")

    db.delete(task)
    db.commit()


    redis_client.delete(f"tasks_user_{current_user.id}")

    return {"msg": "task deleted successfully"}
