import requests
from bs4 import BeautifulSoup

def fetch_paper(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    content = soup.get_text()
    return content
