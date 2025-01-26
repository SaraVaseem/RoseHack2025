from transformers import pipeline

# Load the summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text):
    # Use the summarizer to generate a summary
    summary = summarizer(text, max_length=100, min_length=25, do_sample=False)
    
    # Return the summarized text
    return summary[0]['summary_text']
