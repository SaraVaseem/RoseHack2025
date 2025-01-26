'use client';
import { useState, useEffect, useRef } from "react";


export default function Home() {
  const [userInput, setUserInput] = useState<string>(''); // Input from the user
  const [finalTitle, setFinalTitle] = useState<string>(''); // Article title
  const [finalSummary, setFinalSummary] = useState<string>(''); // The final summary
  const [keywords, setKeywords] = useState<string[]>([]); // Extracted keywords
  const [relatedLinks, setRelatedLinks] = useState<Record<string, string[]>>({}); // Related links
  const [displayedSummary, setDisplayedSummary] = useState<string>(''); // Typing effect for summary
  const [displayedKeywords, setDisplayedKeywords] = useState<string[]>([]); // Typing effect for keywords
  const [displayedLinks, setDisplayedLinks] = useState<Record<string, string[]>>({}); // Typing effect for links
  const [typingIndex, setTypingIndex] = useState<number>(0); // Typing index for current section
  const [currentSection, setCurrentSection] = useState<'summary' | 'keywords' | 'links' | null>(null); // Track current section
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message state
  const [showCursor, setShowCursor] = useState<boolean>(true); // Cursor blinking effect
  const summaryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentSection === 'summary' && typingIndex < finalSummary.length) {
      const timeout = setTimeout(() => {
        setDisplayedSummary((prev) => prev + finalSummary[typingIndex]);

        setTypingIndex(typingIndex + 1);
      }, 20);
      return () => clearTimeout(timeout);
    }


  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setIsSubmitted(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSubmitted(true);
      sendLink();
    }
  };

  const sendLink = async () => {
    if (!userInput) {
      alert('Please enter a valid link!');
      return;
    }
    setErrorMessage('');
    setFinalTitle(''); // Clear old title
    setFinalSummary('');
    setDisplayedSummary('');
    setTypingIndex(0);
    setIsLoading(true);

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
        setFinalTitle(json.title); // Set the article title
        setFinalSummary(json.summary); // Set the summary
      } else {
        const error = await res.json();
        setErrorMessage(error.error || 'An error occurred while processing your request.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (finalSummary && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [finalSummary]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Input Section */}
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
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </div>
        <p className="italic mt-4">Streamline Your Research, Organize Your Success</p>
      </main>

      {/* Error Section */}
      {errorMessage && <p className="mt-4 text-lg text-red-500">{errorMessage}</p>}
      {finalTitle && (
        <section className="bg-white py-12" ref={summaryRef}>
          <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Here's Your Summary
          </h2>
            <h3 className="text-2xl font-style: italic text-center text-gray-800 mb-6">
              {finalTitle}
            </h3>
            <div className="text-lg text-gray-700 whitespace-pre-wrap">
              <span>{displayedSummary}</span>
              {showCursor && <span className="inline-block bg-black h-6 w-1 align-middle"></span>}
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
            <button className="bg-black text-white rounded px-6 py-4 hover:bg-gray-600 mt-8 mb-10">
              Save Summary
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
