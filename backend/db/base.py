# This file ensures all models are imported before table creation

from db.base_class import Base

# Import all models here to register with Base
from models.agent import Agent
from models.customer import Customer
from models.call_environment_factor import CallEnvironmentFactor
from models.call_topic import CallTopic
from models.product import Product
from models.call import Call
from models.transcript import Transcript
from models.call_analysis_metadata import CallAnalysisMetadata
from models.missed_script_point import MissedScriptPoint
from models.product_knowledge_score import ProductKnowledgeScore
from models.script_adherence import ScriptAdherence
from models.topic import Topic
from models.transcript_tag import TranscriptTag
from models.transcript import Transcript
# Add more models as needed
