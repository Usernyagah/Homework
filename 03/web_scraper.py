import requests
from typing import Optional

def scrape_webpage(url: str) -> str:
    """
    Scrape the content of a webpage using Jina Reader.
    
    Args:
        url (str): The URL of the webpage to scrape
        
    Returns:
        str: The content of the webpage in markdown format
        
    Example:
        >>> content = scrape_webpage("https://github.com/alexeygrigorev/minsearch")
        >>> len(content) > 1000
        True
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
        response.raise_for_status()  # Raise an exception for bad status codes
        
        return response.text
        
    except requests.RequestException as e:
        return f"Error scraping {url}: {str(e)}"
