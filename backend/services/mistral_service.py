import os
from mistralai import Mistral
from config import Config

# Initialize Mistral client
client = Mistral(api_key=Config.MISTRAL_API_KEY)


def generate_conversation_starters(content: str, source_type: str = "url") -> dict:
    """
    Generate personalized conversation starters and insights from content.
    Uses mistral-small for cost-effective processing.
    """
    
    system_prompt = """You are an expert Sales Research Assistant helping solopreneurs and founders generate leads.
    
Your task is to analyze the provided content (from a LinkedIn profile, company website, or document) and generate:

1. **5 Personalized Conversation Starters**: Opening lines that show you've done your research. These should be specific, genuine, and reference something from their content.

2. **3 Pain Points**: Identify potential challenges or problems this person/company might be facing based on their content.

3. **3 Market Gap Opportunities**: Identify potential untapped opportunities or areas where they could improve.

Be specific, not generic. Reference actual details from the content.

Respond in this exact JSON format:
{
    "conversation_starters": [
        "Starter 1...",
        "Starter 2...",
        "Starter 3...",
        "Starter 4...",
        "Starter 5..."
    ],
    "pain_points": [
        "Pain point 1...",
        "Pain point 2...",
        "Pain point 3..."
    ],
    "market_gaps": [
        "Opportunity 1...",
        "Opportunity 2...",
        "Opportunity 3..."
    ],
    "summary": "A brief 2-sentence summary of what this person/company is about."
}"""

    user_prompt = f"""Analyze the following {source_type} content and generate insights:

---
{content[:15000]}
---

Provide personalized conversation starters, pain points, and market gap opportunities based on this content."""

    try:
        response = client.chat.complete(
            model="mistral-small-latest",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        import json
        result = json.loads(response.choices[0].message.content)
        return {
            "success": True,
            "data": result
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def generate_email_draft(content: str, conversation_starter: str) -> dict:
    """
    Generate a personalized email draft based on the research.
    Uses mistral-small for fast processing.
    """
    
    system_prompt = """You are an expert email writer for sales professionals.
    
Write a short, personalized outreach email (max 150 words) that:
1. Uses the provided conversation starter naturally
2. Is genuine and not salesy
3. Ends with a soft call-to-action
4. Feels human, not AI-generated

Respond in JSON format:
{
    "subject": "Email subject line",
    "body": "Email body text"
}"""

    user_prompt = f"""Based on this research about the prospect:
{content[:3000]}

Using this conversation starter as inspiration:
"{conversation_starter}"

Write a personalized outreach email."""

    try:
        response = client.chat.complete(
            model="mistral-small-latest",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        import json
        result = json.loads(response.choices[0].message.content)
        return {
            "success": True,
            "data": result
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
