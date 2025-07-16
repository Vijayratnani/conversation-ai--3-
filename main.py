import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Configure logging first
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import with error handling
try:
    from core.config import settings
    logger.info("Successfully imported settings")
except ImportError as e:
    logger.error(f"Failed to import settings: {e}")
    raise

try:
    from api.v1.api import api_router
    logger.info("Successfully imported api_router")
except ImportError as e:
    logger.error(f"Failed to import api_router: {e}")
    raise

try:
    from api.v1.endpoints import drill_down
    logger.info("Successfully imported drill_down")
except ImportError as e:
    logger.error(f"Failed to import drill_down: {e}")
    # This might be optional, so we can continue without it

# # Only for running directly
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up Call Analytics Backend...")
    try:
        # Add any startup logic here
        yield
    except Exception as e:
        logger.error(f"Error during lifespan: {e}")
        raise
    finally:
        # Shutdown
        logger.info("Shutting down Call Analytics Backend.")

app = FastAPI(
    title="Call Analytics Backend",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Call Analytics API"}

@app.get("/api/categories")
async def get_categories():
    from data.store import DRILL_DOWN_DATA
    return {"categories": list(DRILL_DOWN_DATA.keys())}