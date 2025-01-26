"use client"; // This will mark the page component as a Client Component

import NavBar from "../../components/NavBar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Lekton } from "next/font/google";

const lektonFont = Lekton({
  subsets: ["latin"],
  weight: "400",
});

interface ButtonProps {
  title: string;
  summary: string;
  onRemove: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, summary, onRemove }) => {
  const [isTabOpen, setIsTabOpen] = useState(false);

  const handleClick = () => setIsTabOpen((prevState) => !prevState);

  return (
    <div className="relative">
      {/* Full-width Button */}
      <button
        onClick={handleClick}
        className="p-4 w-full bg-white shadow-md text-gray-800 rounded-lg border border-gray-300 hover:shadow-lg hover:bg-gray-100 focus:outline-none transition-all duration-300"
      >
        {title}
      </button>

      {/* Modal */}
      {isTabOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center text-white z-10">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 text-center max-w-md w-full">
            <h2 className="text-2xl mb-4">{title}</h2>
            <p className="mb-4">{summary || "No summary available."}</p>
            <button
              onClick={handleClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all mr-2"
            >
              Close Tab
            </button>
            <button
              onClick={onRemove}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
            >
              Remove Title
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Page() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const summary = searchParams.get("summary");

  const [titles, setTitles] = useState<{ title: string; summary: string }[]>([]);

  useEffect(() => {
    const storedTitles = localStorage.getItem("titles");
    if (storedTitles) {
      setTitles(JSON.parse(storedTitles));
    }
  }, []);

  useEffect(() => {
    if (title && summary) {
      setTitles((prev) => {
        if (!prev.some((item) => item.title === title)) {
          const updatedTitles = [...prev, { title, summary }];
          localStorage.setItem("titles", JSON.stringify(updatedTitles));
          return updatedTitles;
        }
        return prev;
      });
    }
  }, [title, summary]);

  const handleRemove = (itemTitle: string) => {
    const updatedTitles = titles.filter((item) => item.title !== itemTitle);
    setTitles(updatedTitles);
    localStorage.setItem("titles", JSON.stringify(updatedTitles));
  };

  return (
    <>
      <div className={lektonFont.className}>
        <NavBar />
      </div>
      <div className="bg-gradient-to-t from-gray-100 via-gray-200 to-gray-300 min-h-screen">
        <div className={lektonFont.className}>
          <h1 className="text-4xl font-bold text-center mt-8 text-gray-800">
            Saved Articles
          </h1>

          {/* Render the titles as full-width buttons */}
          <div className="mt-10 mx-4 space-y-4">
            {titles.length > 0 ? (
              titles.map((item, index) => (
                <Button
                  key={index}
                  title={item.title}
                  summary={item.summary}
                  onRemove={() => handleRemove(item.title)}
                />
              ))
            ) : (
              <p className="text-center text-gray-700">No articles saved yet.</p>
            )}
          </div>
        </div>

        <footer className="flex justify-center mt-auto">
          <Link href={{ pathname: "/" }}>
            <button className="bg-black text-white rounded px-6 py-4 hover:bg-blue-600 mt-8 mb-10">
              Back
            </button>
          </Link>
        </footer>
      </div>
    </>
  );
}
