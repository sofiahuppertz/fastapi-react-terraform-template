import os
import logging
import json
from typing import Optional, Any, Dict

logger = logging.getLogger("your_project")

class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        
        # Add extra fields if present
        if hasattr(record, "extra_data"):
            log_data.update(record.extra_data)
        
        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_data)

def setup_logging(level: Optional[str] = None) -> None:
    is_gcp = os.getenv("K_SERVICE")
    if is_gcp:
        try:
            import google.cloud.logging
            client = google.cloud.logging.Client()
            client.setup_logging()
            logger.info(json.dumps({"message": "Google Cloud Logging initialized successfully"}))     
        except Exception as e:
            logger.error(json.dumps({"message": "Failed to initialize Google Cloud Logging", "error": str(e)}))
    else:
        # Configure local JSON logging
        handler = logging.StreamHandler()
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)
        logger.setLevel(level or logging.INFO)

setup_logging()

__all__ = ["logger"]
