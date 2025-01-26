'use client';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const [userInput, setUserInput] = useState<string>(''); // Input from the user
  const [finalSummary, setFinalSummary] = useState<string>(''); // The final summary
  const [displayedSummary, setDisplayedSummary] = useState<string>(''); // Summary with typing effect
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message state
  const [typingIndex, setTypingIndex] = useState<number>(0); // Typing effect state
  const [showCursor, setShowCursor] = useState<boolean>(true); // Cursor blinking effect
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // Track if Enter was pressed

  // Reference to the summary section
  const summaryRef = useRef<HTMLDivElement | null>(null);

  // Typing effect logic
  useEffect(() => {
    if (typingIndex < finalSummary.length) {
      const timeout = setTimeout(() => {
        setDisplayedSummary((prev) => prev + finalSummary[typingIndex]);
        setTypingIndex(typingIndex + 1);
      }, 20); // Typing speed (adjust as needed)
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, finalSummary]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // Blink every 500ms
    return () => clearInterval(interval);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setIsSubmitted(false); // reset enter key tracking when storing input
  };

  // Handle key down (Enter key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSubmitted(true); // Set submission flag
      sendLink(); // Call the backend
    }
  };

  // Send link to backend
  const sendLink = async () => {
    if (!userInput) {
      alert('Please enter a valid link!');
      return;
    }
  
    setErrorMessage(''); // Clear error messages
    setFinalSummary(''); // Clear old summaries
    setDisplayedSummary(''); // Reset typing effect
    setTypingIndex(0); // Reset typing effect
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
  

  // Scroll to summary when finalSummary is updated
  useEffect(() => {
    if (finalSummary && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [finalSummary]); // Trigger scroll when finalSummary changes

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
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendLink}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
        <p className="italic mt-4">Streamline Your Research, Organize Your Success</p>
      </main>

      {errorMessage && <p className="mt-4 text-lg text-red-500">{errorMessage}</p>}

      {finalSummary && (
        <section className="bg-white py-16" ref={summaryRef}>
          <div className="container mx-auto px-4">
            <h3 className="text-4xl text-center text-gray-800 mb-6">
              Here is a summary for you
            </h3>
            <div className="text-lg text-gray-700 whitespace-pre-wrap">
              <span>{displayedSummary}</span>
              {showCursor && <span className="inline-block bg-black h-6 w-1 align-middle"></span>} {/* Blinking cursor */}
            </div>
          </div>
        </section>
      )}
      {finalSummary && (
        <div className="flex items-center justify-center space-x-10">
          <Link
            href={{
              pathname: "/dashboard",
              query: {
                summary: displayedSummary,
              },
            }}
          >
            <button className="bg-black text-white rounded px-6 py-4 hover:bg-blue-600 mt-8 mb-10">
              Save Summary
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
