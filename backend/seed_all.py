import asyncio
from db.session import async_session, engine, Base
from scripts.seed.seed_agent import seed_agents
from scripts.seed.seed_call_analysis_metadata import seed_call_analysis_metadata
from scripts.seed.seed_call_environment_factor import seed_call_environment_factor
from scripts.seed.seed_call_topic import seed_call_topic
from scripts.seed.seed_call import seed_calls
from scripts.seed.seed_customer import seed_customers
from scripts.seed.seed_missed_script_point import seed_missed_script_points
from scripts.seed.seed_product_knowledge_score import seed_product_knowledge_scores
from scripts.seed.seed_product import seed_products
from scripts.seed.seed_product_knowledge_score import seed_product_knowledge_scores
from scripts.seed.seed_script_adherence import seed_script_adherence
from scripts.seed.seed_topic import seed_topics
from scripts.seed.seed_transcript_tag import seed_transcript_tags
from scripts.seed.seed_transcript import seed_transcripts
# from seed import seed_call_analysis_metadata2
from sqlalchemy import text

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
 
    async with async_session() as session:
        try:
            # 🧹 Delete all data from tables before seeding
            print("🧹 Deleting all existing data...")
            await session.execute(
                text("TRUNCATE TABLE transcript_tags, transcripts, script_adherence, product_knowledge_scores, missed_script_points, call_topics, call_environment_factors, call_analysis_metadata, calls, products, customers, agents RESTART IDENTITY CASCADE;")
                # text("TRUNCATE TABLE transcript_tags, transcripts, script_adherence, product_knowledge_scores, missed_script_points, call_topics, call_environment_factors, calls, products, customers, agents RESTART IDENTITY CASCADE;")
            )
            await session.commit()
            print("✅ All tables truncated.")
            try:
                print("🌱 Seeding Agents...")
                agents = await seed_agents(session)
                await session.commit()
                agent_ids = [agent.agent_id for agent in agents if agent.agent_id is not None]
                print(f"✅ Seeded {len(agents)} agents.")
            except Exception as e:
                print(f"❌ {e}")
 
            try:
                print("🌱 Seeding Customers...")
                customers = await seed_customers(session)
                await session.commit()
                customer_ids = [customer.customer_id for customer in customers if customer.customer_id is not None]  
                print(f"✅ Seeded {len(customers)} customers.")
            except Exception as e:
                raise Exception(f"Error in seed_customers: {e}")
 
            try:
                print("🌱 Seeding Products...")
                products = await seed_products(session)
                await session.commit()
                product_ids = [product.product_id for product in products if product.product_id is not None]
                print(f"✅ Seeded {len(products)} products.")
            except Exception as e:
                raise Exception(f"Error in seed_products: {e}")
 
            try:
                print("🌱 Seeding Calls...")
                calls = await seed_calls(session,agent_ids, customer_ids )
                await session.commit()
                call_ids = [call.call_id for call in calls]
                print(f"✅ Seeded {len(calls)} calls.")
            except Exception as e:
                raise Exception(f"Error in seed_calls: {e}")
           
            try:
                print("🌱 Seeding Topics...")
                topics = await seed_topics(session)
                await session.commit()
                topic_ids = [topic.topic_id for topic in topics]
                print(f"✅ Seeded {len(topics)} topics.")
            except Exception as e:
                raise Exception(f"Error in seed_topics: {e}")
 
            try:
                print("🌱 Seeding Call Analysis Metadata...")
                call_analysis = await seed_call_analysis_metadata(session,call_ids)
                await session.commit()
                print(f"✅ Seeded {len(call_analysis)} call analysis metadata records.")
            except Exception as e:
                raise Exception(f"Error in seed_call_analysis_metadata: {e}")
 
            try:
                print("🌱 Seeding Call Environment Factors...")
                env_factors = await seed_call_environment_factor(session, [call.call_id for call in calls])
                await session.commit()
                print(f"✅ Seeded {len(env_factors)} call environment factors.")
            except Exception as e:
                raise Exception(f"Error in seed_call_environment_factor: {e}")
 
            try:
                print("🌱 Seeding Call Topics...")
                call_topics = await seed_call_topic(session, call_ids, topic_ids)
                await session.commit()
                print(f"✅ Seeded {len(call_topics)} call topics.")
            except Exception as e:
                raise Exception(f"Error in seed_call_topic: {e}")
 
            try:
                print("🌱 Seeding Script Adherence...")
                script_adherence = await seed_script_adherence(session, [call.call_id for call in calls], product_ids, agent_ids)
                await session.commit()
                adherence_ids = [adherence.adherence_id for adherence in script_adherence if adherence.adherence_id is not None]
                print(f"✅ Seeded {len(script_adherence)} script adherence.")
            except Exception as e:
                raise Exception(f"Error in seed_script_adherence: {e}")
 
            try:
                print("🌱 Seeding Missed Script Points...")
                missed_points = await seed_missed_script_points(session, adherence_ids)
                await session.commit()
                print(f"✅ Seeded {len(missed_points)} missed script points.")
            except Exception as e:
                raise Exception(f"Error in seed_missed_script_points: {e}")
 
            try:
                print("🌱 Seeding Product Knowledge Scores...")
                scores = await seed_product_knowledge_scores(session, agent_ids, product_ids)
                await session.commit()
                print(f"✅ Seeded {len(scores)} scores.")
            except Exception as e:
                raise Exception(f"Error in seed_product_knowledge_scores: {e}")
 
            try:
                print("🌱 Seeding Transcripts...")
                transcripts = await seed_transcripts(session, calls)
                await session.commit()
                transcript_ids = [t.transcript_id for t in transcripts if t.transcript_id is not None]
                print(f"✅ Seeded {len(transcripts)} transcripts.")
            except Exception as e:
                raise Exception(f"Error in seed_transcripts: {e}")
 
            try:
                print("🌱 Seeding Transcript Tags...")
                transcript_tags = await seed_transcript_tags(session, transcript_ids)
                await session.commit()
                print(f"✅ Seeded {len(transcript_tags)} transcript tags.")
            except Exception as e:
                raise Exception(f"Error in seed_transcript_tags: {e}")
 
            await session.commit()
            print("🎉 All seed data committed successfully!")
 
        except Exception as e:
            await session.rollback()
            print(f"❌ Seeding failed: {e}")
            raise
 
if __name__ == "__main__":
    asyncio.run(main())
 
