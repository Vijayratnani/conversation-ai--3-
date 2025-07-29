# import asyncio
# import random
# from faker import Faker
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# import sys
# import os
# from datetime import datetime, timedelta

# # Add project root to the Python path
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# from db.session import AsyncSessionLocal
# from models.agent import Agent
# from models.call import Call, CallStatus
# from models.transcript import Transcript

# fake = Faker()

# # Configuration
# NUM_AGENTS = 10
# NUM_CALLS_PER_AGENT = 25

# async def seed_agents(db: AsyncSession):
#     """Seeds the database with mock agents."""
#     print("Seeding agents...")
#     agents = []
#     for _ in range(NUM_AGENTS):
#         agent = Agent(
#             name=fake.name(),
#             email=fake.unique.email(),
#         )
#         agents.append(agent)
#     db.add_all(agents)
#     await db.commit()
#     print(f"Seeded {len(agents)} agents.")
#     return agents

# async def seed_calls_and_transcripts(db: AsyncSession, agents: list[Agent]):
#     """Seeds calls and associated transcripts for the given agents."""
#     print("Seeding calls and transcripts...")
#     calls_to_create = []
    
#     for agent in agents:
#         for _ in range(NUM_CALLS_PER_AGENT):
#             start_time = fake.date_time_this_year(before_now=True, after_now=False, tzinfo=None)
#             duration = random.randint(30, 600)
#             end_time = start_time + timedelta(seconds=duration)
            
#             # Generate sample analysis data for the JSON field
#             analysis_metadata = {
#                 "detected_topics": random.sample(["Pricing", "Support", "Feature Request", "Cancellation", "Login Issue"], k=random.randint(1, 3)),
#                 "sentiment_trend": ["neutral", "positive", "positive"] if random.random() > 0.4 else ["neutral", "negative", "neutral"],
#                 "compliance_status": "Pass" if random.random() > 0.1 else "Fail",
#                 "competitor_mentioned": fake.company() if random.random() > 0.8 else None,
#                 "agent_emotion": random.choice(["calm", "energetic", "frustrated"]),
#             }

#             call = Call(
#                 agent_id=agent.id,
#                 customer_phone_number=fake.phone_number(),
#                 start_time=start_time,
#                 end_time=end_time,
#                 duration_seconds=duration,
#                 sentiment_score=round(random.uniform(-1, 1), 2),
#                 status=CallStatus.COMPLETED,
#                 recording_url=f"https://fake-recordings.com/{fake.uuid4()}.mp3",
#                 analysis_metadata=analysis_metadata
#             )
            
#             # Generate transcripts for the call
#             transcripts = []
#             current_time = start_time
#             while current_time < end_time:
#                 speaker = random.choice(["Agent", "Customer"])
#                 text = fake.sentence(nb_words=random.randint(5, 20))
#                 timestamp = current_time + timedelta(seconds=random.randint(5, 15))
#                 if timestamp > end_time:
#                     break
                
#                 transcripts.append(Transcript(
#                     call=call,
#                     timestamp=timestamp,
#                     speaker=speaker,
#                     text=text
#                 ))
#                 current_time = timestamp
            
#             call.transcripts = transcripts
#             calls_to_create.append(call)

#     db.add_all(calls_to_create)
#     await db.commit()
#     print(f"Seeded {len(calls_to_create)} calls with their transcripts.")


# async def main():
#     """Main function to run the seeding process."""
#     print("Starting database seeding process...")
#     async with AsyncSessionLocal() as db:
#         # Clear existing data
#         print("Clearing existing data...")
#         await db.execute(text("TRUNCATE TABLE transcripts, calls, agents RESTART IDENTITY CASCADE;"))
#         await db.commit()

#         # Seed new data
#         agents = await seed_agents(db)
#         await seed_calls_and_transcripts(db, agents)
    
#     print("Database seeding completed successfully!")

# if __name__ == "__main__":
#     # This allows running the script directly
#     # Ensure you have configured your .env file correctly
#     from dotenv import load_dotenv
#     load_dotenv()
#     asyncio.run(main())
