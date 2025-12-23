import os
import requests
import zipfile
from pathlib import Path
from whoosh.index import create_in, exists_in, open_dir
from whoosh.fields import Schema, TEXT, ID
import shutil

def download_file(url, local_path):
    """Download a file if it doesn't exist locally."""
    if os.path.exists(local_path):
        print(f"File {local_path} already exists, skipping download")
        return True
        
    try:
        print(f"Downloading {url}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"Error downloading file: {e}")
        return False

def process_zip_file(zip_path, index):
    """Process a zip file and index markdown files."""
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        for file_info in zip_ref.infolist():
            if file_info.filename.endswith(('.md', '.mdx')):
                # Remove the first part of the path
                rel_path = '/'.join(file_info.filename.split('/')[1:])
                
                # Skip if it's a directory
                if file_info.is_dir():
                    continue
                    
                # Read and index the file
                with zip_ref.open(file_info) as f:
                    try:
                        content = f.read().decode('utf-8')
                        index.add_document({
                            'id': rel_path,
                            'filename': rel_path,
                            'content': content
                        })
                        print(f"Indexed: {rel_path}")
                    except Exception as e:
                        print(f"Error processing {file_info.filename}: {e}")

def create_search_index():
    """Create and populate the search index."""
    # Define the schema for the index
    schema = Schema(
        filename=ID(stored=True),
        content=TEXT(stored=True)
    )
    
    # Create or clear the index directory
    index_dir = "whoosh_index"
    if os.path.exists(index_dir):
        shutil.rmtree(index_dir)
    os.mkdir(index_dir)
    
    # Create the index
    ix = create_in(index_dir, schema)
    
    # Download the repository
    zip_url = "https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip"
    zip_path = "fastmcp-main.zip"
    
    if not download_file(zip_url, zip_path):
        return None
    
    # Process the zip file
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        for file_info in zip_ref.infolist():
            if file_info.filename.endswith(('.md', '.mdx')) and not file_info.is_dir():
                # Remove the first part of the path
                rel_path = '/'.join(file_info.filename.split('/')[1:])
                
                # Read the file content
                with zip_ref.open(file_info) as f:
                    try:
                        content = f.read().decode('utf-8')
                        
                        # Add to index
                        writer = ix.writer()
                        writer.add_document(
                            filename=rel_path,
                            content=content
                        )
                        writer.commit()
                        print(f"Indexed: {rel_path}")
                    except Exception as e:
                        print(f"Error processing {file_info.filename}: {e}")
    
    return ix

def search_docs(query, index, limit=5):
    """Search the index and return results."""
    from whoosh.qparser import QueryParser
    
    results = []
    with index.searcher() as searcher:
        query_parser = QueryParser("content", index.schema)
        query = query_parser.parse(query)
        search_results = searcher.search(query, limit=limit)
        
        for hit in search_results:
            results.append(hit['filename'])
    
    return results

if __name__ == "__main__":
    # Create the search index
    print("Creating search index...")
    search_index = create_search_index()
    
    if search_index:
        # Test search
        print("\nSearching for 'demo'...")
        results = search_docs("demo", search_index)
        
        print("\nSearch Results:")
        for i, result in enumerate(results, 1):
            print(f"{i}. {result}")
            
            # Print the first result's full path for verification
            if i == 1:
                print("\nFirst result path:", result)
    else:
        print("Failed to create search index")
