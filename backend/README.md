# Call Analytics Backend

This project provides a robust, scalable backend for a call analytics dashboard using FastAPI and PostgreSQL.

## Features

- **Layered Architecture**: Clear separation of API, Services, and CRUD layers.
- **Async Support**: Built with `asyncio` and `asyncpg` for high performance.
- **ORM and Schemas**: Uses SQLAlchemy for database interaction and Pydantic for data validation.
- **Dependency Injection**: Leverages FastAPI's dependency injection system for clean, testable code.
- **Configuration Management**: Centralized settings management via `.env` files.

## Project Structure

\`\`\`
/
├── api/          # FastAPI routers and endpoints
├── core/         # Application configuration
├── crud/         # Data Access Layer (Create, Read, Update, Delete)
├── db/           # Database session management and base models
├── models/       # SQLAlchemy ORM models
├── schemas/      # Pydantic data transfer objects
├── services/     # Business logic layer
├── .env          # Environment variables
├── main.py       # Main application entrypoint
└── requirements.txt
\`\`\`

## Setup and Installation

### 1. Prerequisites

- Python 3.9+
- PostgreSQL server

### 2. Clone and Setup Virtual Environment

\`\`\`bash
git clone <your-repo-url>
cd conversation-ai-backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
\`\`\`

### 3. Install Dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Configure Database

1.  Make sure your PostgreSQL server is running.
2.  Create a database (e.g., `call_analytics`).
3.  Copy the `.env.example` to `.env` and update the `DATABASE_URL` with your connection string.

    \`\`\`
    DATABASE_URL="postgresql+asyncpg://USER:PASSWORD@HOST:PORT/DB_NAME"
    \`\`\`

### 5. Run Database Migrations

Run the SQL scripts provided in the `scripts` folder of the main project to set up your database schema.

### 6. Run the Application

\`\`\`bash
uvicorn main:app --reload
\`\`\`

The API will be available at `http://127.0.0.1:8000`.
Interactive API documentation (Swagger UI) can be found at `http://127.0.0.1:8000/docs`.
