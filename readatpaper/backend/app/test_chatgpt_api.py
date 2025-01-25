import openai

# Set your OpenAI API key here
openai.api_key = 'your-api-key-here'

def summarize_paper(text):
    """Summarizes the input text using the ChatGPT API."""
    response = openai.ChatCompletion.create(
        model="gpt-4",  # Or "gpt-3.5-turbo"
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes research papers."},
            {"role": "user", "content": f"Please summarize the following paper:\n\n{text}"}
        ]
    )
    return response['choices'][0]['message']['content']

def get_related_topics(text):
    """Returns related topics to the input paper using the ChatGPT API."""
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that suggests related topics to research papers."},
            {"role": "user", "content": f"Please suggest related topics to the following paper:\n\n{text}"}
        ]
    )
    return response['choices'][0]['message']['content']

def test_chatgpt_api():
    """Test function to summarize paper and suggest related topics."""
    paper_text = """Artificial intelligence (AI) is a field of study that emphasizes the creation of algorithms and systems capable of performing tasks that would typically require human intelligence, such as recognizing speech, understanding natural language, and making decisions. The field has advanced rapidly, with machine learning models, particularly deep learning, driving much of the progress. AI has found applications in a wide range of industries, from healthcare and finance to transportation and entertainment."""
    
    # Summarize the paper
    print("Testing Summarization...\n")
    summary = summarize_paper(paper_text)
    print("Summary:\n")
    print(summary)
    
    # Get related topics
    print("\nTesting Related Topics...\n")
    related_topics = get_related_topics(paper_text)
    print("Related Topics:\n")
    print(related_topics)

# Run the test
test_chatgpt_api()
