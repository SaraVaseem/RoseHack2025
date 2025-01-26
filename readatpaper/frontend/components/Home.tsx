"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Data {
  link: string;
}

interface ResponseData {
  summary: string;
}

export default function Home() {
  // State to track user input
  const [userInput, setUserInput] = useState<string>("");
  const router = useRouter();

  // State to handle the file upload (string for file name and string for error message)
  const [fileName, setFileName] = useState<string>(""); // Type as string
  const [errorMessage, setErrorMessage] = useState<string>(""); // Type as string

  // State to track if user enters input
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [response, setResponse] = useState<string>(""); // State to store the response from the backend

  // Create a ref for the section to scroll into view
  const summaryRef = useRef<HTMLDivElement | null>(null);

  // Update state with user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setIsSubmitted(false); // reset enter key tracking when storing input
  };

  // Mark as submitted when Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSubmitted(true); // Set submission flag
      sendLink(); // Call the backend
    }
  };

  // Handle the file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setErrorMessage(""); // Reset error message
    if (file) {
      // Check if the file is a PDF
      if (file.type === "application/pdf") {
        setFileName(file.name); // Set the file name to display
        console.log("Uploaded file:", file.name); // Replace with your file handling logic
      } else {
        setErrorMessage("Please upload a valid PDF file.");
        setFileName(""); // Clear file name if invalid
      }
    }
  };

  // Trigger submit when the "Enter" button is clicked
  const handleEnterButtonClick = () => {
    setIsSubmitted(true);
    sendLink();
  };

  const sendLink = async () => {
    if (!userInput) {
      alert("Please enter a valid link!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link: userInput }), // Send the link as part of the request body
      });

      if (res.ok) {
        // Check if the response is successful (status code 200-299)
        const json: ResponseData = await res.json();
        setResponse(json.summary); // Set the backend response to be displayed in the component
      } else {
        console.error("Server error:", res.statusText);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // UseEffect to trigger scroll when isSubmitted is true
  useEffect(() => {
    if (isSubmitted && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isSubmitted]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content Section with Cropped Background Image */}
      <main
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Centered Content */}
        <h2 className="text-6xl text-black mb-8">Readatpaper.io</h2>

        {/* Search Bar and File Upload */}
        <div className="relative flex flex-col items-center w-full max-w-lg space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Input article link here..."
            className="w-full px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          {/* Enter Button */}
          <button
            onClick={handleEnterButtonClick}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enter
          </button>

          {/* Upload Button */}
          <label
            htmlFor="pdfUpload" // Corrected to match the id of the input
            className="w-12 h-10 flex items-center justify-center text-white bg-black rounded-md cursor-pointer hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* Paperclip Icon (Heroicons) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3H6v18h12V10h-5zm0 0l5 5m-5-5l-5 5"
              />
            </svg>
          </label>
          <input
            id="pdfUpload" // Corrected to match the label's htmlFor
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Slogan */}
        <p className="italic mt-4">
          {" "}
          Streamline Your Research, Organize Your Success{" "}
        </p>
      </main>

      {/* Display file name or error message */}
      {fileName && (
        <p className="mt-4 text-lg text-green-500">Uploaded: {fileName}</p>
      )}
      {errorMessage && (
        <p className="mt-4 text-lg text-red-500">{errorMessage}</p>
      )}

      {/* Text Section: only opens when user submits input */}
      {isSubmitted && userInput && (
        <>
          <section className="bg-white py-16" ref={summaryRef}>
            <div className="container mx-auto px-4">
              <h3 className="text-4xl text-center text-gray-800 mb-6">
                Here is a summary for you
              </h3>
              <p className="text-lg text-gray-700">
                {response ? response : "No response from the backend yet."}
              </p>
            </div>
          </section>

          <div className="flex item-center justify-center space-x-10">
            <Link
              href={{
                pathname: "/dashboard",
                query: {
                  summary: response,
                },
              }}
            >
              <button className="bg-black text-white rounded px-6 py-4 hover:bg-blue-600 mt-8 mb-10">
                Save Summary
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}