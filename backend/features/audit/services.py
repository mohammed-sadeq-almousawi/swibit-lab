from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from loguru import logger
from core.config import settings

mongo_client = AsyncIOMotorClient(settings.MONGO_URL)
mongo_db = mongo_client[settings.MONGO_DB_NAME]
audit_collection = mongo_db["audit_logs"]

async def log_audit_event(user_id: int, action: str, details: dict = None):
    event = {
        "user_id": user_id,
        "action": action,
        "details": details or {},
        "timestamp": datetime.utcnow()
    }
    try:
        await audit_collection.insert_one(event)
        logger.info(f"Audit Log Saved: User {user_id} performed {action}")
    except Exception as e:
        logger.error(f"Failed to save audit log: {e}")
