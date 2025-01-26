import requests

def summarize_text(text):
    """
    Summarize text using Hugging Face Inference API.
    """
    api_url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
    # headers = {"Authorization": f"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"}  # Replace with your API key

    payload = {"inputs": text}
    response = requests.post(api_url, json=payload)

    if response.status_code == 200:
        return response.json().get("summary_text", "No summary available.")
    else:
        return f"Error summarizing content: {response.status_code}"
