import asyncio
import random
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import sys
import os
from datetime import datetime, timedelta

# Add project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db.session import async_session as AsyncSessionLocal
from models.agent import Agent
from models.customer import Customer
from models.product import Product
from models.call import Call
from models.transcript import Transcript
from models.topic import Topic
from models.call_topic import CallTopic
from models.script_adherence import ScriptAdherence
from models.missed_script_point import MissedScriptPoint
from models.call_analysis_metadata import CallAnalysisMetadata
from models.call_environment_factor import CallEnvironmentFactor
from models.product_knowledge_score import ProductKnowledgeScore
from models.transcript_tag import TranscriptTag

fake = Faker()

NUM_AGENTS = 10
NUM_CUSTOMERS = 30
NUM_PRODUCTS = 5
NUM_CALLS_PER_AGENT = 25

async def seed_agents(db: AsyncSession):
    print("Seeding agents...")
    agents = [
        Agent(
            name=fake.name(),
            email=fake.unique.email(),
            team=fake.word(),
            hire_date=fake.date_this_decade(),
        )
        for _ in range(NUM_AGENTS)
    ]
    db.add_all(agents)
    await db.commit()
    return agents

async def seed_customers(db: AsyncSession):
    print("Seeding customers...")
    customers = [Customer(identifier=fake.unique.uuid4()) for _ in range(NUM_CUSTOMERS)]
    db.add_all(customers)
    await db.commit()
    return customers

async def seed_products(db: AsyncSession):
    print("Seeding products...")
    products = [Product(name=fake.unique.word().capitalize(), category=fake.word().capitalize()) for _ in range(NUM_PRODUCTS)]
    db.add_all(products)
    await db.commit()
    return products

async def seed_topics(db: AsyncSession):
    print("Seeding topics...")
    topics = [Topic(name_en=name, name_ur=f"{name} (Urdu)", category=fake.word()) for name in ["Pricing", "Support", "Login", "Upgrade", "Cancellation"]]
    db.add_all(topics)
    await db.commit()
    return topics

async def seed_calls_and_related(db: AsyncSession, agents, customers, products, topics):
    print("Seeding calls and related models...")
    calls = []
    call_topics = []
    script_adherences = []
    missed_points = []
    transcripts = []
    transcript_tags = []
    call_analysis_list = []
    environment_factors = []
    knowledge_scores = []

    for agent in agents:
        for _ in range(NUM_CALLS_PER_AGENT):
            customer = random.choice(customers)
            product = random.choice(products)

            call = Call(
                agent_id=agent.agent_id,
                customer_id=customer.customer_id,
                call_timestamp=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
                duration_seconds=random.randint(60, 600),
                direction=random.choice(["Inbound", "Outbound"]),
                outcome=random.choice(["Resolved", "Escalated", "Dropped"]),
                customer_sentiment=random.choice(["Positive", "Neutral", "Negative"]),
                agent_sentiment=random.choice(["Positive", "Neutral", "Negative"]),
                flagged_for_review=random.choice([True, False]),
                summary=fake.paragraph(),
                next_action=fake.sentence(),
                contains_sensitive_info=random.choice([True, False]),
                transcript_available=True,
                agent_talk_time_seconds=random.randint(30, 300),
                customer_talk_time_seconds=random.randint(30, 300),
                silence_duration_seconds=random.randint(0, 60),
                interruptions=random.randint(0, 10),
                compliance_score=round(random.uniform(70, 100), 2),
                audio_recording_url=f"https://fake-recordings.com/{fake.uuid4()}.mp3",
                analysis_metadata={"summary": fake.paragraph(), "intent_classification": ["inquiry", "feedback"]}
            )
            db.add(call)
            await db.flush()

            for topic in random.sample(topics, k=random.randint(1, 3)):
                call_topics.append(CallTopic(call_id=call.call_id, topic_id=topic.topic_id))

            adherence = ScriptAdherence(
                call_id=call.call_id,
                product_id=product.product_id,
                score=round(random.uniform(60, 100), 2),
                trend_from_previous=round(random.uniform(-10, 10), 2),
                top_missed_area=fake.word()
            )
            db.add(adherence)
            await db.flush()

            for _ in range(random.randint(0, 2)):
                missed_points.append(MissedScriptPoint(
                    adherence_id=adherence.adherence_id,
                    point_description=fake.sentence(),
                    frequency=random.randint(1, 5),
                    impact=fake.word()
                ))

            # Flush each transcript before using its ID in tags
            timestamp_counter = 0
            for _ in range(random.randint(3, 6)):
                timestamp_counter += random.randint(5, 15)
                transcript = Transcript(
                    call_id=call.call_id,
                    timestamp_in_call_seconds=timestamp_counter,
                    speaker=random.choice(["Agent", "Customer"]),
                    speaker_name=fake.name(),
                    original_text=fake.sentence(),
                    translated_text=fake.sentence(),
                    is_sensitive=random.choice([True, False])
                )
                db.add(transcript)
                await db.flush()
                transcripts.append(transcript)

                if random.random() < 0.5:
                    transcript_tags.append(TranscriptTag(
                        transcript_id=transcript.transcript_id,
                        type=random.choice(["Intent", "Emotion"]),
                        text=random.choice(["Confused", "Interested", "Angry"]),
                        variant=random.choice(["Strong", "Mild", "Unclear"])
                    ))

            call_analysis_list.append(CallAnalysisMetadata(
    sentiment=random.choice(["positive", "neutral", "negative"]),
    emotions=[random.choice(["happy", "angry", "sad"])],
    intent=[random.choice(["inquire", "complain", "purchase"])],
    threat=random.choice([True, False]),
    churn_risk=random.choice(["low", "medium", "high"]),
    entities=[fake.word() for _ in range(2)],
    opportunity_detected=random.choice([True, False]),
    agent_responded=random.choice([True, False]),
    agent_response_score=round(random.uniform(0.0, 10.0), 2),
    compliance_score=round(random.uniform(0.0, 10.0), 2),
    customer_behavior={"tone": random.choice(["polite", "angry", "calm"])},
    product_mentions={"products": [fake.word() for _ in range(2)]},
    service_mentions={"services": [fake.word() for _ in range(2)]},
    agent_mentions={"agents": [fake.name()]},
    customer_wishes={"wishes": [fake.sentence()]},
    raw_json={"full_analysis": fake.text()}
))
            environment_factors.append(CallEnvironmentFactor(
                call_id=call.call_id,
                noise_type=random.choice(["Background Music", "Echo", "Static"]),
                detection_count=random.randint(1, 3),
                confidence_score=round(random.uniform(0.7, 1.0), 2)
            ))

            knowledge_scores.append(ProductKnowledgeScore(
                agent_id=agent.agent_id,
                product_id=product.product_id,
                score=round(random.uniform(50, 100), 2),
                issues_noted=fake.sentence(),
                assessment_date=datetime.utcnow().date()
            ))

            calls.append(call)

    db.add_all(call_topics + missed_points + call_analysis_list + environment_factors + knowledge_scores + transcript_tags)
    await db.commit()
    print(f"Seeded {len(calls)} calls and all related data.")

async def main():
    print("Starting database seeding process...")
    async with AsyncSessionLocal() as db:
        print("Clearing existing data...")
        await db.execute(text("""
            TRUNCATE TABLE 
                transcript_tags,
                product_knowledge_scores,
                call_environment_factors,
                call_analysis_metadata,
                missed_script_points,
                script_adherence,
                call_topics,
                transcripts,
                calls,
                topics,
                customers,
                products,
                agents 
            RESTART IDENTITY CASCADE;
        """))
        await db.commit()

        agents = await seed_agents(db)
        customers = await seed_customers(db)
        products = await seed_products(db)
        topics = await seed_topics(db)
        await seed_calls_and_related(db, agents, customers, products, topics)

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    asyncio.run(main())
