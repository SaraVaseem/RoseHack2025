'use client';
import { useState, useEffect, useRef } from "react";


export default function Home() {
  const [userInput, setUserInput] = useState<string>(''); // Input from the user
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

  const summaryRef = useRef<HTMLDivElement | null>(null); // Reference for scrolling to summary
  const headerRef = useRef<HTMLDivElement | null>(null); // Reference for the white header

  // Typing effect logic
  useEffect(() => {
    if (currentSection === 'summary' && typingIndex < finalSummary.length) {
      const timeout = setTimeout(() => {
        setDisplayedSummary((prev) => prev + finalSummary[typingIndex]);
        setTypingIndex((prev) => prev + 1);
      }, 20); // Typing speed for summary
      return () => clearTimeout(timeout);
    }

    if (currentSection === 'keywords' && typingIndex < keywords.length) {
      const timeout = setTimeout(() => {
        setDisplayedKeywords((prev) => [...prev, keywords[typingIndex]]);
        setTypingIndex((prev) => prev + 1);
      }, 50); // Typing speed for keywords
      return () => clearTimeout(timeout);
    }

    if (currentSection === 'links' && typingIndex < Object.keys(relatedLinks).length) {
      const timeout = setTimeout(() => {
        const keyword = Object.keys(relatedLinks)[typingIndex];
        const links = relatedLinks[keyword];
        setDisplayedLinks((prev) => ({ ...prev, [keyword]: links }));
        setTypingIndex((prev) => prev + 1);
      }, 100); // Typing speed for links
      return () => clearTimeout(timeout);
    }

    // Transition between sections
    if (currentSection === 'summary' && typingIndex === finalSummary.length) {
      setCurrentSection('keywords');
      setTypingIndex(0);
    } else if (currentSection === 'keywords' && typingIndex === keywords.length) {
      setCurrentSection('links');
      setTypingIndex(0);
    } else if (currentSection === 'links' && typingIndex === Object.keys(relatedLinks).length) {
      setCurrentSection(null); // Typing effect complete
      // Scroll to the white header
      if (headerRef.current) {
        setTimeout(() => {
          const headerPosition = headerRef.current.getBoundingClientRect().top + window.scrollY;
          const offset = -50; // Adjust this value to scroll slightly higher or lower
          window.scrollTo({ top: headerPosition + offset, behavior: 'smooth' });
        }, 500); // Add slight delay for smooth scrolling
      }
    }
  }, [typingIndex, currentSection, finalSummary, keywords, relatedLinks]);

  // Blinking cursor logic
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // Cursor blinks every 500ms
    return () => clearInterval(interval);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    resetStates();
  };

  // Reset all states
  const resetStates = () => {
    setFinalSummary('');
    setDisplayedSummary('');
    setDisplayedKeywords([]);
    setDisplayedLinks({});
    setKeywords([]);
    setRelatedLinks({});
    setTypingIndex(0);
    setErrorMessage('');
    setCurrentSection(null);
  };

  // Fetch summary and related data
  const sendLink = async () => {
    if (!userInput) {
      alert('Please enter a valid link!');
      return;
    }

    resetStates();
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
        setFinalSummary(json.summary);
        setKeywords(json.keywords || []);
        setRelatedLinks(json.related_links || {});
        setCurrentSection('summary'); // Start typing effect
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

  // Scroll to summary when available
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

      {/* Summary Section */}
      {finalSummary && (
        <section className="bg-white py-16" ref={summaryRef}>
          <div className="container mx-auto px-4">
            <h3 className="text-4xl text-center text-gray-800 mb-6">Here is a summary for you</h3>
            <div className="text-lg text-gray-700 whitespace-pre-wrap">
              {displayedSummary}
              {currentSection === 'summary' && showCursor && (
                <span className="inline-block bg-black h-6 w-1 align-middle"></span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Keywords Section */}
      {displayedKeywords.length > 0 && (
        <section className="bg-white py-4">
          <div className="container mx-auto px-4">
            <h4 className="text-2xl text-gray-800 mb-4">Keywords:</h4>
            <ul className="list-disc pl-6">
              {displayedKeywords.map((keyword, idx) => (
                <li key={idx} className="text-lg text-gray-600">{keyword}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Related Links Section */}
      {Object.keys(displayedLinks).length > 0 && (
        <section className="bg-white py-4" ref={headerRef}>
          <div className="container mx-auto px-4">
            <h4 className="text-2xl text-gray-800 mb-4">Related Articles:</h4>
            {Object.entries(displayedLinks).map(([keyword, links], idx) => (
              <div key={idx} className="mt-4">
                <h5 className="text-xl font-bold">{keyword}</h5>
                <ul className="list-disc pl-6">
                  {links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
