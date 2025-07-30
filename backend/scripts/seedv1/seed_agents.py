from datetime import date
from models.agent import Agent

async def seed_agents(db):
    agents = [
        Agent(name="Alice Johnson", email="alice@example.com", team="Sales", hire_date=date(2023, 5, 10), is_active=True),
        Agent(name="Bob Smith", email="bob@example.com", team="Support", hire_date=date(2022, 11, 1), is_active=True),
        Agent(name="Charlie Nguyen", email="charlie@example.com", team="Retention", hire_date=date(2024, 3, 21), is_active=True),
    ]
    db.add_all(agents)
    await db.commit()
