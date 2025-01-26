"use client"; // This will mark the page component as a Client Component

import NavBar from "../../components/NavBar";
import Link from "next/link";
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

  // State to manage summaries
  const [summaries, setSummaries] = useState<string[]>([]);

  // Load summaries from localStorage on initial render
  useEffect(() => {
    const storedSummaries = localStorage.getItem("summaries");
    if (storedSummaries) {
      setSummaries(JSON.parse(storedSummaries)); // Load saved summaries from localStorage
    }
  }, []);

  // Add new summary to the array and update localStorage
  useEffect(() => {
    if (summary) {
      setSummaries((prev) => {
        if (!prev.includes(summary)) {
          const updatedSummaries = [...prev, summary];
          localStorage.setItem("summaries", JSON.stringify(updatedSummaries)); // Save to localStorage
          return updatedSummaries;
        }
        return prev;
      });
    }
  }, [summary]);

  const handleRemove = (item: string) => {
    const updatedSummaries = summaries.filter((summary) => summary !== item);
    setSummaries(updatedSummaries); // Update the state
    localStorage.setItem("summaries", JSON.stringify(updatedSummaries)); // Persist to localStorage
  };

  return (
    <>
      <div className={ lektonFont.className}>
        <NavBar/>
      </div>
      <div className="bg-gradient-to-t from-gray-100 via-gray-200 to-gray-300 min-h-screen">
        <div className={lektonFont.className}>
          <h1 className="text-4xl font-bold text-center mt-8 text-gray-800">
            Saved Articles
          </h1>

          {/* Render the summaries in the UI */}
          <div className="mt-10 ml-8">
            {summaries.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {summaries.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white shadow rounded-md text-gray-800 flex justify-between items-center"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemove(item)}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700 focus:outline-none"
                    >
                      &times; {/* This is the "X" symbol for removal */}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No summaries saved yet.</p>
            )}
          </div>
        </div>

        <footer className="flex justify-center mt-auto">
          <Link
            href={{
              pathname: "/",
            }}
          >
            <button className="bg-black text-white rounded px-6 py-4 hover:bg-blue-600 mt-8 mb-10">
              Back
            </button>
          </Link>
        </footer>
      </div>
    </>
  );
}