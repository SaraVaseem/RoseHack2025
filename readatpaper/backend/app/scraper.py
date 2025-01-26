import requests
from bs4 import BeautifulSoup
import PyPDF2
from io import BytesIO

def fetch_paper(url):
  
    # Fetches the content of a webpage or PDF based on the URL.
  
    if url.endswith('.pdf'):
        return fetch_pdf_content(url)
    else:
        return fetch_web_content(url)

def fetch_web_content(url):
    
    # Fetches and extracts the main content of a webpage.
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Attempt to locate <article> or <main> tag for main content
        main_content = soup.find('article') or soup.find('main')
        if main_content:
            text = main_content.get_text(separator=" ", strip=True)
            return clean_content(text)  # Clean irrelevant content

        # Fallback: Extract all paragraphs if <article> or <main> is not found
        paragraphs = soup.find_all('p')
        if paragraphs:
            text = " ".join([p.get_text(separator=" ", strip=True) for p in paragraphs])
            return clean_content(text)

        # If no meaningful content found, return the entire page text
        return clean_content(soup.get_text(separator=" ", strip=True))
    except requests.exceptions.RequestException as e:
        return f"Error fetching webpage: {e}"

def fetch_pdf_content(url):
    
    # Fetches and extracts the text from a PDF URL.
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        pdf_reader = PyPDF2.PdfReader(BytesIO(response.content))
        content = ""
        for page in pdf_reader.pages:
            content += page.extract_text() or ""
        return content.strip()
    except requests.exceptions.RequestException as e:
        return f"Error fetching PDF: {e}"
    except Exception as e:
        return f"Error processing PDF: {e}"

def fetch_article_titles(url):
    
    # Fetches potential article titles from a webpage.
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all possible title tags
        titles = [title.get_text(strip=True) for title in soup.find_all('h1')]
        
        # Try <h2> if no <h1> titles are found
        if not titles:
            titles = [title.get_text(strip=True) for title in soup.find_all('h2')]

        return titles if titles else ["No titles found"]
    except requests.exceptions.RequestException as e:
        return [f"Error fetching titles: {e}"]

def clean_content(text):
    
    # Removes boilerplate text like disclaimers and navigation menus.
    
    irrelevant_phrases = [
        "An official website of the United States government", 
        "Secure .gov websites use HTTPS",
        "Share sensitive information only on official, secure websites.",
        "For confidential support call", 
        "visit a local Samaritans branch",
        "see www.samaritans.org for details"
    ]
    for phrase in irrelevant_phrases:
        text = text.replace(phrase, "")
    return text.strip()
