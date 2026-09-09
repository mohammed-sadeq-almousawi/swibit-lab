from loguru import logger

def setup_logging():
    logger.add(
        "logs/backend.log",
        format="{time: YYYY-MM-DD HH:mm:ss} | {level} | {message}",
        rotation="1 MB"
    )