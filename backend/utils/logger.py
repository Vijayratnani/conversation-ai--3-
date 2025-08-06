# utils/logger.py

import logging
import sys

def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    
    if not logger.handlers:
        logger.setLevel(logging.DEBUG)  # <--- changed to DEBUG for detailed logs

        handler = logging.StreamHandler(sys.stdout)  # Output to console
        formatter = logging.Formatter(
            '[%(asctime)s] [%(levelname)s] [%(name)s:%(lineno)d] %(message)s'  # <--- include lineno
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        logger.propagate = False  # Prevent duplicate logs

    return logger
