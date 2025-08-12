from .seed_config import fake
from models.script_adherence import ScriptAdherence
import random
import asyncio
from datetime import datetime, timedelta

async def seed_script_adherence(db, call_ids, product_ids, agent_ids):
    try:
        records = []
        
        today = datetime.today().date()
        first_day_of_month = today.replace(day=1)
        delta_days = (today - first_day_of_month).days

        # Shuffle for randomness
        random.shuffle(call_ids)
        random.shuffle(agent_ids)

        for i, call_id in enumerate(call_ids):
            product_id = random.choice(product_ids)
            agent_id = agent_ids[i % len(agent_ids)]
            assessment_date = first_day_of_month + timedelta(days=random.randint(0, delta_days))

            record = ScriptAdherence(
                call_id=call_id,
                agent_id=agent_id,
                product_id=product_id,
                score=round(random.uniform(60, 100), 2),
                trend_from_previous=round(random.uniform(-5, 5), 2),
                top_missed_area=fake.sentence(nb_words=5),
                assessment_date=assessment_date,
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records

    except Exception as e:
        raise Exception(f"Error while seeding script_adherence: {e}")
