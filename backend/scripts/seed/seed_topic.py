from .seed_config import fake, NUM_PRODUCTS  # You can define a new constant if needed, e.g. NUM_TOPICS
from models.topic import Topic
import asyncio

async def seed_topics(db, num_records=5):  # default 20 topics, adjust as needed
    try:
        records = []
        categories = ['General', 'Sales', 'Support', 'Technical', 'Billing']

        for _ in range(num_records):
            name_en = fake.unique.word().capitalize()
            name_ur = fake.unique.word().capitalize()  # Faker doesn't support Urdu; just for demo
            category = fake.random_element(categories)
            
            record = Topic(
                name_en=name_en,
                name_ur=name_ur,
                category=category
            )
            records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records

    except Exception as e:
        raise Exception(f"Error while seeding topics: {e}") 