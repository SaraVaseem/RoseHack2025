from flask import Flask
from flask_sqlalchemy import SQLAlchemy

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
        return f"<AnalysisResult {self.id}>"

# Create the database tables (only when this script is run directly)
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database and tables created")