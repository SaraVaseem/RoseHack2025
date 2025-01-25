from googlesearch import search

def get_related_topics(keywords):
    related_links = []
    for keyword in keywords:
        links = search(keyword + " tutorial", num_results=5)
        related_links.extend(links)
    return related_links
