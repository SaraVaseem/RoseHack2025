'use client';

import { useState } from 'react';

interface ButtonProps {
  text: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ text, className = '', type = 'button' }) => {
  // State to manage whether the tab is open or not
  const [isTabOpen, setIsTabOpen] = useState(false);

  // Function to toggle the tab's visibility
  const handleClick = () => {
    setIsTabOpen((prevState) => !prevState);
  };

  return (
    <div className="relative">
      {/* Button that toggles the tab */}
      <button
        type={type}
        onClick={handleClick}
        className={`px-14 py-10 bg-white shadow-lg text-black rounded-md hover:bg-gray-100 ${className}`}
      >
        {text}
      </button>

      {/* Tab that covers the screen */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-75 transition-all duration-500 ease-in-out ${
          isTabOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex justify-center items-center h-full text-white">
          <div className="text-center">
            <h2 className="text-2xl mb-4">This is the Tab Content</h2>
            <p>Here you can put anything you want in the tab!</p>
            <button
              onClick={handleClick}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-4"
            >
              Close Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Button;
