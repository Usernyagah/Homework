import requests

def count_word_occurrences(text: str, word: str) -> int:
    """Count how many times a word appears in a text (case-insensitive)."""
    return text.lower().count(word.lower())

def count_word_on_webpage(url: str, word: str) -> dict:
    """
    Count how many times a word appears on a webpage using Jina Reader.
    
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
        print(f"Fetching content from {jina_url}...")
        response = requests.get(jina_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        content = response.text
        count = count_word_occurrences(content, word)
        
        result = {
            "word": word,
            "count": count,
            "url": url,
            "content_length": len(content)
        }
        
        return result
        
    except Exception as e:
        return {
            "error": str(e),
            "url": url,
            "word": word
        }

if __name__ == "__main__":
    # Count the word "data" on datatalks.club
    target_url = "https://datatalks.club"
    target_word = "data"
    
    print(f"Counting occurrences of '{target_word}' on {target_url}...")
    result = count_word_on_webpage(target_url, target_word)
    
    if "error" in result:
        print(f"Error: {result['error']}")
    else:
        count = result["count"]
        print(f"\nThe word '{target_word}' appears {count} times on {target_url}")
        
        # Find the closest option
        options = [61, 111, 161, 261]
        closest = min(options, key=lambda x: abs(x - count))
        print(f"\nClosest option to {count}: {closest}")
        
        # Print some debug info
        print(f"\nDebug info:")
        print(f"- Content length: {result['content_length']} characters")
        print(f"- Word: {result['word']}")
        print(f"- URL: {result['url']}")
