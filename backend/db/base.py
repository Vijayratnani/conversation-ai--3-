# db/base.py

from db.base_class import Base

# Core Entities
from models.agent import Agent
from models.customer import Customer
from models.product import Product
from models.call import Call
from models.transcript import Transcript
from models.topic import Topic

# Join/Link Tables
from models.call_topic import CallTopic
from models.transcript_tag import TranscriptTag

# QA & Training
from models.script_adherence import ScriptAdherence
from models.missed_script_point import MissedScriptPoint
from models.product_knowledge_score import ProductKnowledgeScore
from models.call_environment_factor import CallEnvironmentFactor

# AI-Powered Analysis
from models.call_analysis_metadata import CallAnalysisMetadata

# # ✅ Add these missing model imports
from models.script_adherence import ScriptAdherence
from models.product_knowledge_score import ProductKnowledgeScore
