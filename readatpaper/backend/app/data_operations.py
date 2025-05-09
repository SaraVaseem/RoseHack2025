from database import db, AnalysisResult, app  # Import 'app' from database.py
import json

# Function to insert data
def insert_data(title, url, summary, topics, articles_dict):
    """Insert a new record into the database."""
    with app.app_context():  # Set up the application context
        new_entry = AnalysisResult(
            title=title,
            url=url,
            summary=summary,
            topics=", ".join(topics),
            articles=json.dumps(articles_dict)  # Convert articles dict to JSON string
        )
        db.session.add(new_entry)
        db.session.commit()
        print("New entry added.")

# Function to query all data
def query_all_data():
    """Query and display all records from the database."""
    with app.app_context():  # Set up the application context
        results = AnalysisResult.query.all()
        for result in results:
            print(f"ID: {result.id}")
            print(f"Title: {result.title}")
            print(f"URL: {result.url}")
            print(f"Summary: {result.summary}")
            print(f"Topics: {result.topics}")
            print(f"Articles: {result.get_articles()}")

# Function to query a specific entry by title
def query_by_title(title):
    """Query a record by title."""
    with app.app_context():  # Set up the application context
        result = AnalysisResult.query.filter_by(title=title).first()
        if result:
            print(f"Found entry: {result}")
            return result
        else:
            print("No entry found.")
            return None

# Example usage
insert_data(
    title='How old is will',
    url='willywonka.com',
    summary='will is very epic but we do not know how old he is.',
    topics=['bob', 'sara', 'cheese', 'rose'],
    articles_dict={
        "bob": ["url92.com", "url22266.com"],
        "sara": ["url36.com"],
        "cheese": ["curl4.com"],
        "rose": ["urlll5.com", "url222dsadasd66.com"]
    }
)

query_all_data()
