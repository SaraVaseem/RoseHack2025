'use client';

export default function Home() {
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
        <h2 className="text-6xl text-black mb-4">Readatpaper.io</h2>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Input article link here..."
            className="w-full px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </main>
    </div>
  );
}
