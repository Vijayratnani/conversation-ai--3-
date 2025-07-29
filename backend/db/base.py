# db/base.py

from db.base_class import Base

# Import all models here to register them with SQLAlchemy Base
from models.agent import Agent
from models.product import Product
from models.call import Call
from models.transcript import Transcript
from models.call_analysis_metadata import CallAnalysisMetadata

# ✅ Add these missing model imports
from models.script_adherence import ScriptAdherence
from models.product_knowledge_scores import ProductKnowledgeScores
