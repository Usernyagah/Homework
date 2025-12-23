import requests
import json

def test_count_word():
    # The FastMCP server should be running on localhost:8000 by default
    url = "http://localhost:8000/count_word_on_webpage"
    
    # Parameters for the request
    params = {
        "url": "https://datatalks.club",
        "word": "data"
    }
    
    try:
        # Make the request to our FastMCP server
        response = requests.post(url, json=params)
        response.raise_for_status()
        
        result = response.json()
        count = result.get("count", 0)
        
        print(f"The word 'data' appears {count} times on {params['url']}")
        
        # Find the closest option
        options = [61, 111, 161, 261]
        closest = min(options, key=lambda x: abs(x - count))
        print(f"\nClosest option to {count}: {closest}")
        
        return count
        
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    test_count_word()
