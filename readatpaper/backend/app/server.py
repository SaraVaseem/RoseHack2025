from flask import Flask, request, jsonify
from flask_cors import CORS

from summarizer import summarize_text  # Import the summarizer function
from scraper import fetch_paper  # Import your fetch_paper function


app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Hello World \nServer is opened!'  # Simple message to check if the server is running

@app.route('/api/data', methods=['POST'])
def handle_data():

    """Fetch the article, summarize it, and send the summary back."""
    try:
        # Get the JSON payload
        data = request.get_json()
        link = data.get("link")
        
        if not link:
            return jsonify({"error": "No link provided"}), 400


        # Fetch the content from the link
        content = fetch_paper(link)
        if not content:
            return jsonify({"error": "Failed to fetch content from the provided link."}), 400

        # Generate a summary using the summarizer
        summary = summarize_text(content)
        if "Error" in summary:
            return jsonify({"error": summary}), 500

        # Return the summary to the frontend
        return jsonify({"summary": summary})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
