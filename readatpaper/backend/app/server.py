from flask import Flask, request, jsonify
from flask_cors import CORS

from summarizer import summarize_text  # Import the summarizer function
from scraper import fetch_paper  # Import your fetch_paper function
from scraper import fetch_article_titles  # Import your fetch article titles


app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Hello World \nServer is opened!'  # Simple message to check if the server is running

@app.route('/api/data', methods=['POST'])
def handle_data():
    """Fetch the article, summarize it, and send the summary and title back."""
    try:
        # Get the JSON payload
        data = request.get_json()
        link = data.get("link")
        
        if not link:
            return jsonify({"error": "No link provided"}), 400

        # Fetch the title from the link
        titles = fetch_article_titles(link)
        if not titles or "Error" in titles[0]:
            return jsonify({"error": "Failed to fetch titles from the provided link."}), 400

        # Use the first title if multiple titles are found
        title = titles[0]

        # Fetch the content from the link
        content = fetch_paper(link)
        if not content:
            return jsonify({"error": "Failed to fetch content from the provided link."}), 400

        # Generate a summary using the summarizer
        summary = summarize_text(content)
        if "Error" in summary:
            return jsonify({"error": summary}), 500

        # Return the title and summary to the frontend
        return jsonify({"title": title, "summary": summary})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
