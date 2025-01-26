import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Use the DATABASE_URI environment variable
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///default.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define the AnalysisResult model
class AnalysisResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)    # Unique identifier
    title = db.Column(db.Text, nullable=False)      # Title of the article or research paper
    url = db.Column(db.Text, nullable=False)        # URL of the input article
    summary = db.Column(db.Text, nullable=False)    # Generated summary of the article
    topics = db.Column(db.Text, nullable=False)     # Comma-separated list of extracted topics
    articles = db.Column(db.Text, nullable=False)   # JSON string of related links for each topic

    def __repr__(self):
        return f"<AnalysisResult {self.id}>"

    def get_articles(self):
        """Return articles as a parsed JSON object."""
        return json.loads(self.articles)

    def set_articles(self, articles_dict):
        """Set articles as a JSON string."""
        self.articles = json.dumps(articles_dict)

# Create the database tables
if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Database and tables created")
        except Exception as e:
            print(f"Error: {e}")
