# import re
# from googlesearch import search
# from scraper import fetch_web_content, fetch_pdf_content

# def extract_keywords(url, top_n=5):
#     """
#     Extract keywords from a given webpage or PDF URL.

#     Args:
#         url (str): The URL of the research paper (HTML or PDF).
#         top_n (int): Number of top keywords to extract.

#     Returns:
#         list: Extracted keywords.
#     """
#     try:
#         # Determine content type
#         if url.endswith('.pdf'):
#             content = fetch_pdf_content(url)
#         else:
#             content = fetch_web_content(url)
        
#         words = re.findall(r'\b[A-Za-z]{4,}\b', content)  # Extract words with 4+ characters
#         freq_dict = {}
#         for word in words:
#             freq_dict[word] = freq_dict.get(word, 0) + 1
        
#         # Get top N keywords based on frequency
#         keywords = sorted(freq_dict, key=freq_dict.get, reverse=True)[:top_n]
        
#         return keywords
    
#     except Exception as e:
#         return f"Error extracting keywords: {str(e)}"

# def find_related_articles(url):
#     """
#     Find related articles based on extracted keywords from the given URL.

#     Args:
#         url (str): The URL of the research paper (HTML or PDF).

#     Returns:
#         dict: Keywords and related article links.
#     """
#     try:
#         keywords = extract_keywords(url)
#         related_articles = {}
        
#         for keyword in keywords:
#             query = f"{keyword} research paper site:arxiv.org"
#             links = list(search(query, num_results=3))  # Get top 3 links
#             related_articles[keyword] = links
        
#         return related_articles
    
#     except Exception as e:
#         return f"Error finding related articles: {str(e)}"

# # Example usage
# if __name__ == "__main__":
#     paper_url = "https://arxiv.org/pdf/2104.00065.pdf"  # Replace with a real URL
#     print("Extracted Keywords:")
#     print(extract_keywords(paper_url))

#     print("\nRelated Topics and Links:")
#     print(find_related_articles(paper_url))

