'use client';
import { useState } from "react";
import SaveButton from "./SaveButton";
import DontSaveButton from "./DontSaveButton";

export default function Home() {
  const [userInput, setUserInput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [backendResponse, setBackendResponse] = useState<string>(''); // New state for backend response

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setIsSubmitted(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsSubmitted(true);
      sendInputToBackend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setErrorMessage('');
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFileName(selectedFile.name);
        setFile(selectedFile);
      } else {
        setErrorMessage('Please upload a valid PDF file.');
        setFileName('');
        setFile(null);
      }
    }
  };

  const sendInputToBackend = async () => {
    if (!userInput && !file) {
      setErrorMessage('Please provide a link or upload a PDF file.');
      return;
    }

    try {
      const formData = new FormData();
      if (userInput) {
        formData.append('link', userInput);
      }
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process the request.');
      }

      const result = await response.json();
      setBackendResponse(result.summary); // Assuming backend sends a "summary" field
    } catch (error) {
      console.error('Error sending data to backend:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <h2 className="text-6xl text-black mb-8">Readatpaper.io</h2>

        <div className="relative flex flex-col items-center w-full max-w-lg space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Input article link here..."
            className="w-full px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          <label
            htmlFor="pdfUpload"
            className="w-12 h-10 flex items-center justify-center text-white bg-black rounded-md cursor-pointer hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3H6v18h12V10h-5zm0 0l5 5m-5-5l-5 5" />
            </svg>
          </label>
          <input
            id="pdfUpload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <p className="italic mt-4">Streamline Your Research, Organize Your Success</p>
      </main>

      {fileName && (
        <p className="mt-4 text-lg text-green-500">Uploaded: {fileName}</p>
      )}
      {errorMessage && (
        <p className="mt-4 text-lg text-red-500">{errorMessage}</p>
      )}

      {isSubmitted && backendResponse && ( // Show backend response if available
        <>
          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-4xl text-center text-gray-800 mb-6">
                Here is a summary for you
              </h3>
              <p className="text-lg text-gray-700">
                {backendResponse}
              </p>
            </div>
          </section>

          <div className="flex item-center justify-center space-x-10">
            <SaveButton />
            <DontSaveButton />
          </div>
        </>
      )}
    </div>
  );
}