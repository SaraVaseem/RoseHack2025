from fetch_paper import fetch_paper

# Test with a web page
web_url = "https://arxiv.org/html/2501.13662v1"  # Replace with an actual research paper link
print("Testing Web URL...")
try:
    web_content = fetch_paper(web_url)
    print("Web Content Retrieved Successfully:")
    print(web_content[:500])  # Print first 500 characters for verification
except Exception as e:
    print(f"Error: {e}")

# Test with a PDF file
pdf_url = "https://arxiv.org/pdf/2301.00001.pdf"  # Replace with a valid PDF URL
print("\nTesting PDF URL...")
try:
    pdf_content = fetch_paper(pdf_url)
    print("PDF Content Retrieved Successfully:")
    print(pdf_content[:500])  # Print first 500 characters for verification
except Exception as e:
    print(f"Error: {e}")
