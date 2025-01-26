'use client';
import { useState } from "react";
import SaveButton from "./SaveButton";
import DontSaveButton from "./DontSaveButton";

export default function Home() {

  // CHANGE LATER WITH AI INPUT
  
  // state to track user input
  const [userInput, setUserInput] = useState('');

  // state to track if user enters input
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update state with user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value); 
    setIsSubmitted(false); // reset enter key tracking when storing input
  };

  // Mark as submitted when Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content Section with Cropped Background Image */}
      <main
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >

        {/* Centered Content */}
        <h2 className="text-6xl text-black mb-8">Readatpaper.io</h2>

        {/* Search Bar */}
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Input article link here..."
            className="w-full px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userInput}
            onChange={handleInputChange} // CHANGE LATER WITH AI
            onKeyDown={handleKeyDown} // CHANGE LATER WITH AI
          />
        </div>

        {/* Slogan */}
        <p className="italic mt-4"> Streamline Your Research, Organize Your Success </p>
      </main>

      {/* Text Section: only opens when user submits a input*/}
      {isSubmitted && userInput && (
        <>
          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-4xl text-center text-gray-800 mb-6">
                  Here is a summary for you
              </h3>
              <p className=" text-lg text-gray-700">
                  { /* CHANGE LATER WITH AI INPUT */}
                  { userInput }
              </p>
            </div>
          </section>

          <div className="flex item-center justify-center space-x-10">
            <SaveButton/>
            <DontSaveButton/>
          </div>
        </>

        
      )}

    </div>
  );
}