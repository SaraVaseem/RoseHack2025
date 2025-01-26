from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Function to connect to the SQLite database
def connect_db():
    """Connect to the SQLite database."""
    return sqlite3.connect("research_papers.db")

# Endpoint 1: Get the main link from frontend
@app.route('/get-main-link', methods=['POST'])
def get_main_link():
    """Receive and process the main link from the frontend."""
    data = request.json
    link = data.get('link')
    if not link:
        return jsonify({'error': 'No link provided'}), 400
    return jsonify({'message': 'Link received successfully', 'link': link})

# Endpoint 2: Post summary, keywords, and links to the frontend
@app.route('/post-summary', methods=['POST'])
def post_summary():
    """Send summary, keywords, and related links to the frontend."""
    data = request.json
    summary = data.get('summary')
    keywords = data.get('keywords')
    links = data.get('links')
    if not summary or not keywords or not links:
        return jsonify({'error': 'Missing summary, keywords, or links'}), 400
    return jsonify({
        'message': 'Summary data sent successfully',
        'summary': summary,
        'keywords': keywords,
        'links': links
    })

# Endpoint 3: Get summary, keywords, and links from the database
@app.route('/get-summary-db', methods=['GET'])
def get_summary_from_db():
    """Retrieve summary, keywords, and related links for a given link."""
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

# Endpoint 4: Post summary, keywords, and links to the database
@app.route('/post-summary-db', methods=['POST'])
def post_summary_to_db():
    """Save summary, keywords, and related links to the database."""
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

if __name__ == "__main__":
    app.run(debug=True, port=5000)
