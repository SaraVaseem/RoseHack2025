from transformers import pipeline

# Load the summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text):
    # Use the summarizer to generate a summary
    summary = summarizer(text, max_length=100, min_length=25, do_sample=False)
    
    # Return the summarized text
    return summary[0]['summary_text']


# Example text to summarize
text = """
Hugging Face is a company that provides tools for Natural Language Processing (NLP). 
It offers a variety of models that are pre-trained on various NLP tasks, such as text classification, 
question answering, and text generation. The company also provides an API and a platform to make it easy to use 
state-of-the-art NLP models. Hugging Face has become one of the most popular repositories for machine learning models, 
and it offers several pre-trained models that are publicly available for research and deployment.
"""

# Get the summary of the text
summary = summarize_text(text)

# Print the summarized text
print("Original Text:")
print(text)
print("\nSummary:")
print(summary)