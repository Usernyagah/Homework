from fastmcp import FastMCP
import requests
from typing import Dict

mcp = FastMCP("Web Tools 🛠️")

def count_word_occurrences(text: str, word: str) -> int:
    """Count how many times a word appears in a text (case-insensitive)."""
    return text.lower().count(word.lower())

@mcp.tool
def count_word_on_webpage(url: str, word: str) -> Dict[str, int]:
    """
    Count how many times a word appears on a webpage.
    
    Args:
        url: The URL of the webpage to search
        word: The word to count
        
    Returns:
        Dictionary with the word count result
    """
    try:
        # Add Jina reader prefix to the URL
        jina_url = f"https://r.jina.ai/{url}"
        
        # Set headers to mimic a browser request
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        # Make the request
        response = requests.get(jina_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        content = response.text
        count = count_word_occurrences(content, word)
        
        return {
            "word": word,
            "count": count,
            "url": url,
            "content_length": len(content)
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "url": url,
            "word": word
        }

if __name__ == "__main__":
    mcp.run()
