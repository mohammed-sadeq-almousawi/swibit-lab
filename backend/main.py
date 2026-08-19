from fastapi import FastAPI
import models
from database import engine
import routes
import auth  

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(auth.router)
app.include_router(routes.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "msg": "API is running!"}
