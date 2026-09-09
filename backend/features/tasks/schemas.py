from pydantic import BaseModel, ConfigDict
from typing import Optional

class TaskBase(BaseModel):
    title: str
    desc: Optional[str] = None
    done: bool = False

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    user_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
