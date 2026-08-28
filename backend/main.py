from fastapi import FastAPI
from core.database import engine, Base
from core.logging import setup_logging


from features.auth import models as auth_models
from features.tasks import models as tasks_models

from features.auth.routes import router as auth_router
from features.tasks.routes import router as tasks_router


setup_logging()


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(tasks_router)

@app.get("/health")
def health_check():
    return {"status": "ok", "msg": "API is running!"}
