from datetime import datetime
import random
from models.script_adherence import ScriptAdherence
from models.call import Call

# Accepts a list of Call objects to link script adherence properly
async def seed_script_adherence(db, calls: list[Call]):
    adherence_entries = []

    for call in calls:
        adherence_entries.append(ScriptAdherence(
            agent_id=call.agent_id,                     # assume call has agent_id FK
            product_id=call.product_id,                 # assume call has product_id FK
            score=round(random.uniform(0.6, 0.95), 2),
            assessment_date=call.call_timestamp.date(),
            call_id=call.call_id                        # ✅ link to real call
        ))

    db.add_all(adherence_entries)
    await db.commit()
