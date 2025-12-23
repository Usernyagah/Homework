# Project 3: FastMCP Integration and Web Scraping Tool

## Overview
This project demonstrates the integration of FastMCP (Fast Model Control Protocol) with web scraping capabilities, providing a powerful tool for searching and analyzing web content. It includes a FastMCP server implementation, web scraping functionality, and a search engine for markdown/MDX files.

## Features

### 1. FastMCP Server
- Implements a FastMCP server with custom tools
- Supports STDIO transport protocol
- Easy-to-extend architecture for adding new tools

### 2. Web Scraping
- Fetches and processes web page content using Jina Reader
- Converts web pages to markdown format
- Counts word occurrences in web pages

### 3. Search Functionality
- Indexes markdown and MDX files from GitHub repositories
- Full-text search with relevance ranking
- Returns top matching documents for any query

## Prerequisites
- Python 3.8+
- pip (Python package manager)
- Git (for cloning the repository)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project-3
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Running the FastMCP Server
```bash
uv --directory . run python main.py
```

### Web Scraping Examples

1. **Scrape a webpage**:
   ```python
   from web_scraper import scrape_webpage
   content = scrape_webpage("https://example.com")
   print(content)
   ```

2. **Count word occurrences**:
   ```bash
   python count_data.py
   ```

### Search Functionality

1. **Index and search repository content**:
   ```bash
   python search.py
   ```
   This will search for the term "demo" in the FastMCP repository.

2. **Custom search**:
   ```python
   from search import create_search_index, search_docs
   
   # Create search index
   search_index = create_search_index()
   
   # Search for documents
   results = search_docs("your search query", search_index)
   for i, result in enumerate(results, 1):
       print(f"{i}. {result}")
   ```

## Project Structure

```
project-3/
├── main.py                # FastMCP server implementation
├── web_scraper.py         # Web scraping functionality
├── search.py              # Search implementation
├── count_data.py          # Word counting functionality
├── test_web_scraper.py    # Tests for web scraper
├── test_count_word.py     # Tests for word counting
├── requirements.txt       # Project dependencies
└── README.md              # This file
```

## Dependencies

- `fastmcp`: For the Model Control Protocol server
- `requests`: For making HTTP requests
- `whoosh`: For full-text search functionality
- `python-dotenv`: For environment variable management

## Examples

### Example 1: Count Word Occurrences
Counts how many times the word "data" appears on datatalks.club:
```bash
python count_data.py
```

### Example 2: Search Repository Content
Searches for the term "demo" in the FastMCP repository:
```bash
python search.py
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025

[Full license text provided in the LICENSE file]
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements
- [FastMCP](https://github.com/jlowin/fastmcp) - For the Model Control Protocol implementation
- [Jina Reader](https://r.jina.ai) - For web page to markdown conversion
- [Whoosh](https://whoosh.readthedocs.io/) - For full-text search functionality