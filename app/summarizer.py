from transformers import pipeline

summarizer = pipeline("summarization")

def summarize_text(text):
    summary = summarizer(text, max_length=300, min_length=100, do_sample=False)
    return summary[0]['summary_text']
