from web_scraper import scrape_webpage

def test_scrape_webpage():
    # Test with the provided URL
    url = "https://github.com/alexeygrigorev/minsearch"
    content = scrape_webpage(url)
    
    # Print the length of the content
    content_length = len(content)
    print(f"Content length: {content_length} characters")
    
    # Print the closest option
    options = [1184, 9184, 19184, 29184]
    closest = min(options, key=lambda x: abs(x - content_length))
    print(f"\nClosest option to {content_length}: {closest}")
    
    return content_length

if __name__ == "__main__":
    test_scrape_webpage()
