"use client"; // This will mark the page component as a Client Component

import NavBar from "../../components/NavBar";
import { useSearchParams } from "next/navigation"; // Import useSearchParams hook
import { useState, useEffect } from "react";

import { Lekton } from "next/font/google";

const lektonFont = Lekton({
  subsets: ["latin"],
  weight: "400",
});

export default function Page() {
  const searchParams = useSearchParams();
  const summary = searchParams.get("summary"); // Access 'summary' safely using .get

  // State to manage whether the tab is open or not
  const [isTabOpen, setIsTabOpen] = useState(false);

  // Function to toggle the tab's visibility
  const handleClick = () => {
    setIsTabOpen((prevState) => !prevState);
  };

  // Log the summary when it's available
  useEffect(() => {
    console.log(summary); // Log after the component has mounted and query is available
  }, [summary]); // This ensures the log happens when summary changes

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-t from-gray-100 via-gray-200 to-gray-300 min-h-screen">
        <div className={lektonFont.className}>
          <h1 className="text-4xl font-bold text-center mt-8 text-gray-800">
            Saved Articles
          </h1>

          {/* Render the summary in the UI */}
          {summary ? (
            <p>Summary: {summary}</p>
          ) : (
            <p>No summary provided in the URL.</p>
          )}
        </div>
      </div>
    </>
  );
}
