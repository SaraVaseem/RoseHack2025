import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

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
    id = db.Column(db.Integer, primary_key=True)
    input_text = db.Column(db.Text, nullable=False)
    summary = db.Column(db.Text, nullable=False)
    topics = db.Column(db.Text, nullable=False)
    articles = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<AnalysisResult {self.id}>"

# Create the database tables
if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Database and tables created")
        except Exception as e:
            print(f"Error: {e}")
