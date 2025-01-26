'use client';
import { useState, useEffect } from "react";
import SaveButton from "./SaveButton";
import DontSaveButton from "./DontSaveButton";
import Link from "next/link";

export default function Home() {
  const [userInput, setUserInput] = useState<string>(''); // Input from the user
  const [responseChunks, setResponseChunks] = useState<string[]>([]); // To handle streamed responses
  const [finalSummary, setFinalSummary] = useState<string>(''); // The final summary
  const [displayedSummary, setDisplayedSummary] = useState<string>(''); // Summary with typing effect
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message state

  // Typing effect state
  const [typingIndex, setTypingIndex] = useState<number>(0);

  // Typing effect logic
  useEffect(() => {
    if (typingIndex < finalSummary.length) {
      const timeout = setTimeout(() => {
        setDisplayedSummary((prev) => prev + finalSummary[typingIndex]);
        setTypingIndex(typingIndex + 1);
      }, 25); // Typing speed set to 25ms for faster effect
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, finalSummary]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value); // Update input state
    setFinalSummary(''); // Clear previous summary
    setDisplayedSummary(''); // Reset typing effect
    setTypingIndex(0); // Reset typing index
  };

  const sendLink = async () => {
    if (!userInput) {
      alert('Please enter a valid link!');
      return;
    }

    setErrorMessage(''); // Clear error messages
    setFinalSummary(''); // Clear old summaries
    setDisplayedSummary(''); // Reset typing effect
    setResponseChunks([]);
    setIsLoading(true); // Start loading state

    try {
      const res = await fetch('http://127.0.0.1:5000/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: userInput }),
      });

      if (res.ok) {
        const json = await res.json();
        setFinalSummary(json.summary); // Set final summary for typing effect
        setTypingIndex(0); // Reset typing effect
      } else {
        const error = await res.json();
        setErrorMessage(error.error || 'An error occurred while processing your request.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading state
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
          backgroundAttachment: 'fixed',
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
          />
          <button
            onClick={sendLink}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
        <p className="italic mt-4"> Streamline Your Research, Organize Your Success </p>
      </main>

      {errorMessage && <p className="mt-4 text-lg text-red-500">{errorMessage}</p>}

      {finalSummary && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl text-center text-gray-800 mb-6">
              Here is a summary for you
            </h3>
            <div className="text-lg text-gray-700 whitespace-pre-wrap">
              {displayedSummary || "Typing..."}
            </div>
          </section>

          <div className="flex item-center justify-center space-x-10">
            <Link
                href={{
                  pathname: "/dashboard",
                  query: {
                    summary: userInput,
                  },
                }}
              >
                Save Summary
              </Link>
            <DontSaveButton />
          </div>
        </section>
      )}
      {finalSummary && (
        <div className="flex items-center justify-center space-x-10">
          <SaveButton />
          <DontSaveButton />
        </div>
      )}
    </div>
  );
}
