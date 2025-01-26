import openai

# Set your OpenAI API key
# <<<<<<< bach-branch
# # openai.api_key = 'your-api-key-here'
# =======
# #openai.api_key = 'your-api-key-here'
# >>>>>>> main

def summarize_paper(text):
    response = openai.ChatCompletion.create(
        model="gpt-4",  # Or "gpt-3.5-turbo"
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes research papers."},
            {"role": "user", "content": f"Please summarize the following paper:\n\n{text}"}
        ]
    )
    return response['choices'][0]['message']['content']

# Example usage
paper_text = """<Insert the full content of the research paper here>"""  # Example text input
summary = summarize_paper(paper_text)
print("Summary of the Paper:")
print(summary)
