from fastapi import FastAPI
import models
from database import engine
import routes
import auth
from loguru import logger


logger.add(
    "logs/backend.log",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}",
    rotation="1 MB",
    serialize=True
)

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(auth.router)
app.include_router(routes.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "msg": "API is running!"}
