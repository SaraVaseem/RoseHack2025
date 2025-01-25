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
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        content = soup.get_text()
        return content.strip()
    else:
        raise Exception(f"Failed to fetch webpage. Status code: {response.status_code}")

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
