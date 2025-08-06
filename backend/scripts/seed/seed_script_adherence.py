from .seed_config import fake, NUM_PRODUCTS, NUM_CALLS_PER_AGENT
from models.script_adherence import ScriptAdherence
import random
import asyncio
from datetime import datetime, timedelta
from calendar import monthrange

async def seed_script_adherence(db, call_ids, product_ids, agent_ids):
    try:
        """
        call_ids: list of existing call UUIDs from seeded calls
        product_ids: list of existing product IDs
        """
        records = []
        
        # Limit to min of actual IDs or configured max counts
        # max_records = min(len(call_ids), len(product_ids), len(agent_ids), NUM_CALLS_PER_AGENT, NUM_PRODUCTS)

        today = datetime.today().date()
        first_day_of_month = today.replace(day=1) 
        delta_days = (today - first_day_of_month).days
        #NUM_MONTHS = 2
        #days_in_month = monthrange(today.year, today.month)[1]

        # Shuffle IDs for distribution
        random.shuffle(call_ids)
        random.shuffle(agent_ids)
        call_index = 0
        agent_index = 0

        for product_id in product_ids:
            for _ in range(NUM_CALLS_PER_AGENT):  
                random_offset = random.randint(0, delta_days)
                assessment_date = first_day_of_month + timedelta(days=random_offset)

                call_id = call_ids[call_index % len(call_ids)]
                agent_id = agent_ids[agent_index % len(agent_ids)]
                call_index += 1
                agent_index += 1

                #From here the database tables entry starts(please hardcode data in variable above this )
                record = ScriptAdherence(
                            call_id=call_id,
                            agent_id = agent_id,  
                            product_id = product_id,
                            score=round(random.uniform(60, 100), 2),
                            trend_from_previous=round(random.uniform(-5, 5), 2),
                            top_missed_area=fake.sentence(nb_words=5),
                            assessment_date=assessment_date
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records
        # commit will be handled in seed_all.py

    except Exception as e:
        raise Exception(f"Error while seeding script_adherence: {e}") 