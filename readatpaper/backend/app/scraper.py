import requests
from bs4 import BeautifulSoup
import PyPDF2
from io import BytesIO

def fetch_paper(url):
    if url.endswith('.pdf'):
        return fetch_pdf_content(url)
    else:
        return fetch_web_content(url)

def fetch_web_content(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup.get_text().strip()
    except requests.exceptions.RequestException as e:
        return f"Error fetching webpage: {e}"

def fetch_pdf_content(url):
    response = requests.get(url)
    if response.status_code == 200:
        pdf_reader = PyPDF2.PdfReader(BytesIO(response.content))
        content = ""
        for page in pdf_reader.pages:
            content += page.extract_text() or ""
        return content.strip()
    else:
        raise Exception(f"Failed to fetch PDF. Status code: {response.status_code}")
