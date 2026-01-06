from pymongo import MongoClient
from datetime import datetime, timedelta
from config import Config

# MongoDB Connection
client = MongoClient(Config.MONGODB_URI)
db = client[Config.DATABASE_NAME]

# Collections
reports_collection = db["reports"]
usage_collection = db["usage"]


def create_report(data: dict) -> str:
    """Create a new research report."""
    report = {
        "source_url": data.get("source_url", ""),
        "source_type": data.get("source_type", "url"),
        "source_content": data.get("source_content", ""),
        "conversation_starters": data.get("conversation_starters", []),
        "pain_points": data.get("pain_points", []),
        "market_gaps": data.get("market_gaps", []),
        "session_id": data.get("session_id", "anonymous"),
        "created_at": datetime.utcnow()
    }
    result = reports_collection.insert_one(report)
    return str(result.inserted_id)


def get_reports(session_id: str, limit: int = 10) -> list:
    """Get reports for a session."""
    reports = reports_collection.find(
        {"session_id": session_id}
    ).sort("created_at", -1).limit(limit)
    
    result = []
    for report in reports:
        report["_id"] = str(report["_id"])
        result.append(report)
    return result


def get_usage(session_id: str) -> dict:
    """Get usage stats for a session."""
    usage = usage_collection.find_one({"session_id": session_id})
    
    if not usage:
        # Create new usage record
        usage = {
            "session_id": session_id,
            "reports_generated": 0,
            "tier": "free",
            "reset_date": datetime.utcnow() + timedelta(days=30)
        }
        usage_collection.insert_one(usage)
        usage["_id"] = str(usage.get("_id", ""))
    else:
        usage["_id"] = str(usage["_id"])
        
        # Check if reset is needed
        if datetime.utcnow() > usage.get("reset_date", datetime.utcnow()):
            usage_collection.update_one(
                {"session_id": session_id},
                {"$set": {
                    "reports_generated": 0,
                    "reset_date": datetime.utcnow() + timedelta(days=30)
                }}
            )
            usage["reports_generated"] = 0
    
    return usage


def increment_usage(session_id: str) -> bool:
    """Increment usage count. Returns True if within limits."""
    usage = get_usage(session_id)
    tier = usage.get("tier", "free")
    current = usage.get("reports_generated", 0)
    
    # Check limits
    limits = {
        "free": Config.FREE_TIER_LIMIT,
        "pro": Config.PRO_TIER_LIMIT,
        "business": Config.BUSINESS_TIER_LIMIT
    }
    
    if current >= limits.get(tier, 5):
        return False
    
    usage_collection.update_one(
        {"session_id": session_id},
        {"$inc": {"reports_generated": 1}}
    )
    return True
