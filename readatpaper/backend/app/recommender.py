from transformers import TFBartForConditionalGeneration, BartTokenizer
import requests
from bs4 import BeautifulSoup
from googlesearch import search
import re

def extract_keywords(summary, top_n=5):
    """
    Extracts keywords from the summarized text.

    Args:
        summary (str): The summarized text of the research paper.
        top_n (int): Number of keywords to extract.

    Returns:
        list: A list of extracted keywords.
    """
    words = re.findall(r'\b[A-Za-z]{4,}\b', summary)  # Extract words with 4 or more characters
    freq_dict = {}
    for word in words:
        freq_dict[word] = freq_dict.get(word, 0) + 1

    # Get the top N keywords based on frequency
    keywords = sorted(freq_dict, key=freq_dict.get, reverse=True)[:top_n]
    
    return keywords

def find_related_articles(keywords):
    """
    Searches for related articles using the extracted keywords.

    Args:
        keywords (list): List of keywords extracted from the summary.

    Returns:
        dict: A dictionary of keywords and corresponding related article links.
    """
    related_articles = {}
    for keyword in keywords:
        query = f"{keyword} research paper site:arxiv.org"
        links = list(search(query, num_results=3))  # Get top 3 links from Google search
        related_articles[keyword] = links
    
    return related_articles