from datetime import datetime, timezone
from pymongo import MongoClient
from loguru import logger
from core.config import settings


mongo_client = MongoClient(settings.MONGO_URL)
mongo_db = mongo_client[settings.MONGO_DB_NAME]
audit_collection = mongo_db["audit_logs"]

# أزلنا كلمة async
def log_audit_event(user_id: int, action: str, details: dict = None):
    event = {
        "user_id": user_id,
        "action": action,
        "details": details or {},
        "timestamp": datetime.now(timezone.utc) 
    }
    try:
        audit_collection.insert_one(event)
        logger.info(f"Audit Log Saved: User {user_id} performed {action}")
    except Exception as e:
        logger.error(f"Failed to save audit log: {e}")