# This file ensures all models are imported before table creation

from db.base_class import Base

# Import all models here to register with Base
from models.agent import Agent
# from models.customer import Customer
from models.product import Product
from models.call import Call
from models.transcript import Transcript
from models.call_analysis_metadata import CallAnalysisMetadata
# Add more models as needed
