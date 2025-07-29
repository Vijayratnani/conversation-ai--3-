import asyncio
from db.session import async_session, engine, Base
from .seed_agent import seed_agents
from .seed_call_analysis_metadata import seed_call_analysis_metadata
from .seed_call_environment_factor import seed_call_environment_factor
from .seed_call_topic import seed_call_topic
from .seed_call import seed_calls
from .seed_customer import seed_customers
from .seed_missed_script_point import seed_missed_script_points
from .seed_product_knowledge_score import seed_product_knowledge_scores
from .seed_product import seed_products
from .seed_product_knowledge_score import seed_product_knowledge_scores
from .seed_script_adherence import seed_script_adherence
from .seed_topic import seed_topics
from .seed_transcript_tag import seed_transcript_tags
from .seed_transcript import seed_transcripts
from sqlalchemy import text

# async def main():
#     async with engine.begin() as conn:
#        await conn.run_sync(Base.metadata.create_all)

#     async with async_session() as session:
#         try:
#             print("🌱 Seeding Agents...")
#             agents = await seed_agents(session)
#             print(f"✅ Seeded {len(agents)} agents.")

#             print("🌱 Seeding Calls...")
#             calls = await seed_calls(session)
#             print(f"✅ Seeded {len(calls)} calls.")


#             print("🌱 Seeding Call Analysis Metadata...")
#             call_analysis = await seed_call_analysis_metadata(session)
#             print(f"✅ Seeded {len(call_analysis)} call analysis metadata records.")

#             print("🌱 Seeding Call Environment Factors...")
#             env_factors = await seed_call_environment_factor(session, [call.call_id for call in calls])
#             print(f"✅ Seeded {len(env_factors)} call environment factors.")

#             print("🌱 Seeding Call Topics...")
#             #call_topics = await seed_call_topic(session, [call.call_id for call in calls], [topic.topic_id for topic in topics])
#             call_topics = await seed_call_topic(session)
#             print(f"✅ Seeded {len(call_topics)} call topics.")

#             print("🌱 Seeding Customers...")
#             customers = await seed_customers(session)
#             print(f"✅ Seeded {len(customers)} customers.")

#             print("🌱 Seeding Missed_script_points...")
#             missed_points = await seed_missed_script_points(session)
#             print(f"✅ Seeded {len(missed_points)} missed_points .")

#             print("🌱 Seeding Product_knowledge_scores...")
#             scores = await seed_product_knowledge_scores(session)
#             print(f"✅ Seeded {len(scores)} scores.")

#             print("🌱 Seeding Products...")
#             products = await seed_products(session)
#             product_ids = [product.product_id for product in products]
#             print(f"✅ Seeded {len( products)} products.")

#             print("🌱 Seeding Script_adherence...")
#             #script_adherences = await seed_script_adherence(session, call_ids, product_ids)
#             script_adherences = await seed_script_adherence(session,[call.call_id for call in calls], product_ids)
#             print(f"✅ Seeded {len(script_adherences)} script_adherences.")

#             print("🌱 Seeding Seed_topics...")
#             topics = await seed_topics(session)
#             print(f"✅ Seeded {len(topics)} topics.")

#             print("🌱 Seeding Seed_transcripts...")
#             transcripts = await seed_transcripts(session, calls)
#             print(f"✅ Seeded {len(transcripts)} transcripts.")

#             print("🌱 Seeding Seed_transcript_tags...")
#             transcript_tags = await seed_transcript_tags(session, transcripts)
#             print(f"✅ Seeded {len(transcript_tags)} transcript tags.")

#             await session.commit()
#             print("🎉 All seed data committed successfully!")

#         except Exception as e:
#             await session.rollback()
#             print(f"❌ Error during seeding: {e}")
#             raise

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        try:
            # 🧹 Delete all data from tables before seeding
            print("🧹 Deleting all existing data...")
            await session.execute(
                text("TRUNCATE TABLE transcript_tags, transcripts, script_adherence, product_knowledge_scores, missed_script_points, call_topics, call_environment_factors, call_analysis_metadata, calls, products, customers, agents RESTART IDENTITY CASCADE;")
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
                print(f"✅ Seeded {len(customers)} customers.")
                await session.commit()
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
                calls = await seed_calls(session)
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
                call_analysis = await seed_call_analysis_metadata(session)
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
                script_adherence = await seed_script_adherence(session, [call.call_id for call in calls], product_ids)
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
