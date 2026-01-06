import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Mistral AI
    MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "")
    
    # MongoDB
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "lead_research_saas")
    
    # App Settings
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    
    # Rate Limits
    FREE_TIER_LIMIT = 5
    PRO_TIER_LIMIT = 50
    BUSINESS_TIER_LIMIT = float('inf')
