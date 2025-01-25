# Define a list of keywords to search
keywords = ["Artificial Intelligence", "Machine Learning", "Deep Learning"]

from googlesearch import search

def get_related_topics(keywords):
    """
    Function to search for related topics based on a list of keywords.

    Args:
    keywords (list of str): A list of keywords to search for.

    Returns:
    list of str: A list of URLs related to the keywords.
    """
    related_links = []  # Initialize an empty list to store the URLs
    
    # Iterate over the list of keywords
    for keyword in keywords:
        try:
            # Perform the Google search by appending "tutorial" to the keyword
            links = search(keyword + " tutorial", num_results=5)  # Get 5 related links
            related_links.extend(links)  # Add the links to the result list
        except Exception as e:
            # Handle any exceptions that may occur (e.g., rate limiting)
            print(f"Error occurred while searching for '{keyword}': {e}")
    
    return related_links

# Call the function and print the results
related_links = get_related_topics(keywords)

# Print out the related links
print("Related Links:")
for link in related_links:
    print(link)
