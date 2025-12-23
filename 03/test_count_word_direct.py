from main import count_word_on_webpage

def test_count_word_direct():
    # Call the function directly
    result = count_word_on_webpage(
        url="https://datatalks.club",
        word="data"
    )
    
    count = result.get("count", 0)
    print(f"The word 'data' appears {count} times on {result['url']}")
    
    # Find the closest option
    options = [61, 111, 161, 261]
    closest = min(options, key=lambda x: abs(x - count))
    print(f"\nClosest option to {count}: {closest}")
    
    return count

if __name__ == "__main__":
    test_count_word_direct()
