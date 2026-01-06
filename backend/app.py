from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid

from config import Config
from models import create_report, get_reports, get_usage, increment_usage
from services.mistral_service import generate_conversation_starters, generate_email_draft
from services.scraper_service import scrape_url
from services.pdf_service import extract_pdf_text

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://*.vercel.app"])

app.config.from_object(Config)


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "Lead Research SaaS API"})


@app.route("/api/analyze-url", methods=["POST"])
def analyze_url():
    """
    Analyze a URL and generate research insights.
    
    Request body:
    {
        "url": "https://example.com",
        "session_id": "optional-session-id"
    }
    """
    data = request.get_json()
    
    if not data or not data.get("url"):
        return jsonify({"success": False, "error": "URL is required"}), 400
    
    url = data["url"]
    session_id = data.get("session_id", str(uuid.uuid4()))
    
    # Check usage limits
    if not increment_usage(session_id):
        return jsonify({
            "success": False,
            "error": "Usage limit reached. Please upgrade your plan.",
            "upgrade_required": True
        }), 429
    
    # Scrape the URL
    scrape_result = scrape_url(url)
    if not scrape_result["success"]:
        return jsonify(scrape_result), 400
    
    content = scrape_result["data"]["content"]
    source_type = scrape_result["data"]["source_type"]
    
    # Generate insights using Mistral
    insights = generate_conversation_starters(content, source_type)
    if not insights["success"]:
        return jsonify(insights), 500
    
    # Save report to database
    report_data = {
        "source_url": url,
        "source_type": source_type,
        "source_content": content[:5000],
        "conversation_starters": insights["data"].get("conversation_starters", []),
        "pain_points": insights["data"].get("pain_points", []),
        "market_gaps": insights["data"].get("market_gaps", []),
        "session_id": session_id
    }
    report_id = create_report(report_data)
    
    return jsonify({
        "success": True,
        "report_id": report_id,
        "data": {
            "url": url,
            "title": scrape_result["data"]["title"],
            "summary": insights["data"].get("summary", ""),
            "conversation_starters": insights["data"].get("conversation_starters", []),
            "pain_points": insights["data"].get("pain_points", []),
            "market_gaps": insights["data"].get("market_gaps", [])
        }
    })


@app.route("/api/analyze-pdf", methods=["POST"])
def analyze_pdf():
    """
    Analyze a PDF file and generate research insights.
    
    Request: multipart/form-data with 'file' field
    """
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file provided"}), 400
    
    file = request.files["file"]
    session_id = request.form.get("session_id", str(uuid.uuid4()))
    
    if not file.filename.endswith(".pdf"):
        return jsonify({"success": False, "error": "Only PDF files are supported"}), 400
    
    # Check usage limits
    if not increment_usage(session_id):
        return jsonify({
            "success": False,
            "error": "Usage limit reached. Please upgrade your plan.",
            "upgrade_required": True
        }), 429
    
    # Extract PDF content
    pdf_result = extract_pdf_text(file.read())
    if not pdf_result["success"]:
        return jsonify(pdf_result), 400
    
    content = pdf_result["data"]["content"]
    
    # Generate insights using Mistral
    insights = generate_conversation_starters(content, "pdf")
    if not insights["success"]:
        return jsonify(insights), 500
    
    # Save report
    report_data = {
        "source_url": file.filename,
        "source_type": "pdf",
        "source_content": content[:5000],
        "conversation_starters": insights["data"].get("conversation_starters", []),
        "pain_points": insights["data"].get("pain_points", []),
        "market_gaps": insights["data"].get("market_gaps", []),
        "session_id": session_id
    }
    report_id = create_report(report_data)
    
    return jsonify({
        "success": True,
        "report_id": report_id,
        "data": {
            "filename": file.filename,
            "metadata": pdf_result["data"]["metadata"],
            "summary": insights["data"].get("summary", ""),
            "conversation_starters": insights["data"].get("conversation_starters", []),
            "pain_points": insights["data"].get("pain_points", []),
            "market_gaps": insights["data"].get("market_gaps", [])
        }
    })


@app.route("/api/generate-email", methods=["POST"])
def generate_email():
    """
    Generate a personalized email draft.
    
    Request body:
    {
        "content": "Research content...",
        "conversation_starter": "Selected starter..."
    }
    """
    data = request.get_json()
    
    if not data or not data.get("content") or not data.get("conversation_starter"):
        return jsonify({"success": False, "error": "Content and conversation_starter are required"}), 400
    
    result = generate_email_draft(data["content"], data["conversation_starter"])
    return jsonify(result)


@app.route("/api/reports", methods=["GET"])
def list_reports():
    """Get reports for a session."""
    session_id = request.args.get("session_id", "anonymous")
    limit = request.args.get("limit", 10, type=int)
    
    reports = get_reports(session_id, limit)
    return jsonify({
        "success": True,
        "reports": reports
    })


@app.route("/api/usage", methods=["GET"])
def get_usage_stats():
    """Get usage statistics for a session."""
    session_id = request.args.get("session_id", "anonymous")
    
    usage = get_usage(session_id)
    
    # Calculate limits based on tier
    tier = usage.get("tier", "free")
    limits = {
        "free": Config.FREE_TIER_LIMIT,
        "pro": Config.PRO_TIER_LIMIT,
        "business": float('inf')
    }
    
    return jsonify({
        "success": True,
        "usage": {
            "reports_generated": usage.get("reports_generated", 0),
            "limit": limits.get(tier, 5),
            "tier": tier,
            "reset_date": usage.get("reset_date", "").isoformat() if usage.get("reset_date") else None
        }
    })


if __name__ == "__main__":
    print("🚀 Lead Research SaaS API starting...")
    print(f"📊 Debug mode: {Config.DEBUG}")
    app.run(host="0.0.0.0", port=8000, debug=Config.DEBUG)
