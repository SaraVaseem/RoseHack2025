from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will allow all domains by default

# Define the root route
@app.route('/')
def index():
    return 'Hello, World!'  # This is a simple message for testing

# Define your existing /api/data route
@app.route('/api/data', methods=['POST'])
def handle_data():
    data = request.get_json()
    link = data.get('link')
    # Your logic here to process the link
    return jsonify({"summary": "This is a summary of the link: " + link})

if __name__ == '__main__':
    app.run(debug=True)
