# seed_agent.py

from .seed_config import fake, NUM_AGENTS
from models.agent import Agent  
import asyncio

async def seed_agents(db):
    try:
        records = []

        agent_names = ['Sarah K.','Michael R.', 'Jessica T.','Brad J.', 'James M.']

        # for _ in range(NUM_AGENTS):
        for agent_name in agent_names:

            #From here the database tables entry starts(please hardcode data in variable above this )
            record = Agent(
                name=agent_name,
                email=fake.unique.email(),
                team=fake.word().capitalize(),
                hire_date=fake.date_this_decade(),
                is_active=True
            )
            records.append(record)
            
        db.add_all(records)

        await asyncio.sleep(0)
        return records
    
    except Exception as e:
        raise Exception(f"Error while seeding agents: {e}") 
