from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import fetch_paper
from summarizer import summarize_text
from recommender import extract_keywords, find_related_articles
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Database connection helper
def connect_db():
    return sqlite3.connect("research_papers.db")

# Initialize the database
def initialize_db():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS papers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            link TEXT,
            summary TEXT,
            keywords TEXT,
            links TEXT
        )
    ''')
    conn.commit()
    conn.close()

initialize_db()

# Route 1: Process link or file and return a summary
@app.route('/api/process', methods=['POST'])
def process():
    try:
        if 'link' in request.form:
            link = request.form['link']
            content = fetch_paper(link)
        elif 'file' in request.files:
            file = request.files['file']
            content = file.read().decode('utf-8')  # Adjust decoding as needed for PDFs
        else:
            return jsonify({"error": "No valid input provided"}), 400

        summary = summarize_text(content)
        keywords = extract_keywords(summary)
        related_links = find_related_articles(keywords)

        return jsonify({
            "summary": summary,
            "related_links": related_links
        })
    except Exception as e:
        print(f"Error in /api/process: {e}")
        return jsonify({"error": "An internal error occurred."}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5000)
