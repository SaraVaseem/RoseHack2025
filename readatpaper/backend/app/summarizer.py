import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def truncate_content(content, max_length=1024): #1024

    # Truncate content to fit the Hugging Face token limit (approx. 1024 tokens).

    return content[:max_length]

def summarize_text(content):

# Generate a summary using the Hugging Face API
    # API endpoint for the Hugging Face model
    api_url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
    # Load API key from the environment variable
    api_key = os.getenv("HUGGINGFACE_API_KEY")
    if not api_key:
        return "Error: API key not found. Check your .env file."

    # Truncate content to ensure it's within token limits
    truncated_content = truncate_content(content)

    headers = {"Authorization": f"Bearer {api_key}"}

    try:
        # Make a POST request to the Hugging Face API
        response = requests.post(api_url, headers=headers, json={"inputs": truncated_content})
        response.raise_for_status()  # Raise an error for HTTP status codes 4xx/5xx

        # Parse the API response
        result = response.json()

        # Debugging: Print the API response
        print(f"API response: {result}")

        # Extract the summary from the response
        if isinstance(result, list):  # Handle cases where response is a list
            return result[0].get("summary_text", "No summary available.")
        return result.get("summary_text", "No summary available.")

    except requests.exceptions.HTTPError as http_err:
        # Log the HTTP error details
        print(f"HTTP Error: {response.status_code} - {response.json()}")
        return f"Error summarizing content: {response.status_code} - {response.json().get('error', 'Unknown error')}"
    except Exception as e:
        # Log unexpected errors
        print(f"Unexpected Error: {e}")
        return f"An unexpected error occurred: {e}"

# Test the summarizer independently
if __name__ == "__main__":
    # Sample content for testing
    test_content = (
        "The field of artificial intelligence has undergone rapid growth in recent years. "
        "With advancements in deep learning, natural language processing, and computer vision, "
        "AI applications have become integral to industries such as healthcare, finance, and transportation. "
        "However, ethical considerations and regulatory frameworks remain critical challenges."
    )
    print("Summary:", summarize_text(test_content))
