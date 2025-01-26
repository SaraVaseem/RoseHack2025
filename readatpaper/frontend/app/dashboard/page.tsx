'use client'; // This will mark the page component as a Client Component

import { useState } from 'react';
import Button from '../../components/Button';
import NavBar from '../../components/NavBar';
import { Lekton } from "next/font/google";

const lektonFont = Lekton({
    subsets: ["latin"],
    weight: "400",
})

export default function Page() {
    // State to manage whether the tab is open or not
    const [isTabOpen, setIsTabOpen] = useState(false);

    // Function to toggle the tab's visibility
    const handleClick = () => {
        setIsTabOpen((prevState) => !prevState);
    };
    return (
        <div className="bg-gradient-to-t from-gray-100 via-gray-200 to-gray-300 min-h-screen">
            <div className={ lektonFont.className}>
                <NavBar/>
                <h1 className="text-4xl fond-bold text-center mt-8 text-gray-800">
                    Saved Articles
                </h1>
                {/* Button that toggles the tab */}
                <Button text="Open Tab" className="mt-4" />
            </div>
        </div>
    );
  }