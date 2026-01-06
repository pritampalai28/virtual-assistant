import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse


def scrape_url(url: str) -> dict:
    """
    Scrape content from a URL (LinkedIn profile, company website, etc.)
    Returns extracted text content.
    """
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    
    try:
        # Validate URL
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return {
                "success": False,
                "error": "Invalid URL format"
            }
        
        # Fetch the page
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()
        
        # Get text content
        text = soup.get_text(separator='\n', strip=True)
        
        # Clean up whitespace
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        text = '\n'.join(lines)
        
        # Get page title
        title = soup.title.string if soup.title else parsed.netloc
        
        # Get meta description if available
        meta_desc = ""
        meta_tag = soup.find("meta", attrs={"name": "description"})
        if meta_tag:
            meta_desc = meta_tag.get("content", "")
        
        # Detect source type
        source_type = "website"
        if "linkedin.com" in url:
            source_type = "linkedin"
        elif "twitter.com" in url or "x.com" in url:
            source_type = "twitter"
        elif "github.com" in url:
            source_type = "github"
        
        return {
            "success": True,
            "data": {
                "url": url,
                "title": title,
                "description": meta_desc,
                "content": text[:20000],  # Limit content size
                "source_type": source_type
            }
        }
        
    except requests.Timeout:
        return {
            "success": False,
            "error": "Request timed out. Please try again."
        }
    except requests.RequestException as e:
        return {
            "success": False,
            "error": f"Failed to fetch URL: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Error processing URL: {str(e)}"
        }
