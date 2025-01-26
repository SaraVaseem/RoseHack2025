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
        className={`p-4 w-full max-w-xs bg-white shadow-md text-gray-800 rounded-lg border border-gray-300 hover:shadow-lg hover:bg-gray-100 focus:outline-none transition-all duration-300 ${className}`}
      >
        {text}
      </button>

      {/* Tab that covers the screen */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity duration-500 ease-in-out ${
          isTabOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex justify-center items-center h-full text-white">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 text-center max-w-md w-full">
            <h2 className="text-2xl mb-4">Tab Content</h2>
            <p className="mb-4">Here you can put anything you want in the tab!</p>
            <button
              onClick={handleClick}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
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
