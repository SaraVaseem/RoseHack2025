from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# MySQL Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://redatuser:rosehack123@localhost/redatpaper'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy

db = SQLAlchemy(app)

# Define the AnalysisResult model

class AnalysisResult(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    input_text = db.Column(db.Text, nullable = False)   # User-provided input text
    summary = db.Column(db.Text, nullable = False)      # Generated summary
    topics = db.Column(db.Text, nullable = False)       # Extracted topics (comma-separated string)
    articles = db.Column(db.Text, nullable = False)     # Related articles (stored as JSON string)

    def __repr_(self):
        return f"<AnalysisResult {self.id}"