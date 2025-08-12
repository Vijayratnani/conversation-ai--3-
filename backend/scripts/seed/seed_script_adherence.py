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

        random.shuffle(call_ids)
        random.shuffle(agent_ids)
        call_index = 0
        agent_index = 0

        # Map product_id to your desired fixed data (score, trend, top_missed_area)
        seed_data = {
            1: {  # Credit Cards
                "score": 92,
                "trend": 2.0,
                "top_missed_area": "Benefits explanation for premium cards",
            },
            2: {  # Personal Loans
                "score": 88,
                "trend": 0.0,
                "top_missed_area": "Terms & conditions, specifically prepayment penalties",
            },
            3: {  # Savings Account
                "score": 95,
                "trend": 1.0,
                "top_missed_area": "None significant; high overall adherence",
            },
            5: {  # Mortgages
                "score": 79,
                "trend": -3.0,
                "top_missed_area": "Rate comparison details and closing cost estimation",
            },
        }

        for product_id in product_ids:
            # Skip products with no predefined data (optional)
            if product_id not in seed_data:
                continue

            data = seed_data[product_id]

            for _ in range(len(agent_ids)):  # You can adjust how many records per product
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
                            score=data["score"],
                            trend_from_previous=data["trend"],
                            top_missed_area=data["top_missed_area"],
                            assessment_date=assessment_date
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records

    except Exception as e:
        raise Exception(f"Error while seeding script_adherence: {e}")
