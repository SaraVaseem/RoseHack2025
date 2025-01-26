from .helper import helper

def main():
    print ("Hello from the main file")
    helper()

if __name__ == "__main__":
    main()

from fastapi import FastAPI
from scraper import fetch_paper
from summarizer import summarize_text
from recommender import get_related_topics

app = FastAPI()

@app.post("/analyze")
def analyze_paper(url: str):
    content = fetch_paper(url)
    summary = summarize_text(content)
    related_topics = get_related_topics(summary.split()[:5])
    return {"summary": summary, "related_links": related_topics}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Function to connect to the database
def connect_db():
    return sqlite3.connect("research_papers.db")

# 1. Get main link from frontend
@app.route('/get-main-link', methods=['POST'])
def get_main_link():
    data = request.json
    link = data.get('link')
    
    if not link:
        return jsonify({'error': 'No link provided'}), 400

    # Process the link (e.g., fetch content, summarize, etc.)
    return jsonify({'message': 'Link received successfully', 'link': link})

# 2. Post summary, keywords & links to frontend
@app.route('/post-summary', methods=['POST'])
def post_summary():
    data = request.json
    summary = data.get('summary')
    keywords = data.get('keywords')
    links = data.get('links')

    if not summary or not keywords or not links:
        return jsonify({'error': 'Missing summary, keywords, or links'}), 400

    # Return the data to frontend
    return jsonify({
        'message': 'Summary data sent successfully',
        'summary': summary,
        'keywords': keywords,
        'links': links
    })

# 3. Get link summary, keywords & links from database
@app.route('/get-summary-db', methods=['GET'])
def get_summary_from_db():
    link = request.args.get('link')
    if not link:
        return jsonify({'error': 'No link provided'}), 400

    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT summary, keywords, links FROM papers WHERE link=?", (link,))
    result = cursor.fetchone()
    conn.close()

    if result:
        summary, keywords, links = result
        return jsonify({
            'link': link,
            'summary': summary,
            'keywords': keywords.split(','),
            'links': links.split(',')
        })
    else:
        return jsonify({'error': 'No data found for the given link'}), 404

# 4. Post link summary, keywords & links to database
@app.route('/post-summary-db', methods=['POST'])
def post_summary_to_db():
    data = request.json
    link = data.get('link')
    summary = data.get('summary')
    keywords = ','.join(data.get('keywords', []))
    links = ','.join(data.get('links', []))

    if not link or not summary or not keywords or not links:
        return jsonify({'error': 'Missing required data'}), 400

    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO papers (link, summary, keywords, links) VALUES (?, ?, ?, ?)",
        (link, summary, keywords, links)
    )
    conn.commit()
    conn.close()

    return jsonify({'message': 'Data stored successfully'})

if __name__ == '__main__':
    app.run(debug=True)
