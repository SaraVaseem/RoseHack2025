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
