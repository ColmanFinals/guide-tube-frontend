import { Link } from 'react-router-dom'; // Import Link component
import { useState } from 'react';

const LandingPage = () => {
  const [showArrow, setShowArrow] = useState(false);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="bg-gray-800 flex justify-between items-center p-4">
        <div>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            GuideTube
          </button>
        </div>
        <div>
          <Link to="/login" className="text-gray-400 hover:text-gray-200 mr-4">
            Log In
          </Link>

          <Link to="/signup" className="text-gray-400 hover:text-gray-200">
            Sign Up
          </Link>
          <button className="text-gray-400 hover:text-gray-200 ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="container mx-auto mt-8 px-4">
        <div className="bg-black p-6 rounded-lg relative">
          <h1 className="text-2xl font-bold mb-2">Meet GuideTube</h1>
          <p className="text-gray-400">The app that will help you succeed</p>
          {/* Learn More Button */}
          <button
            className="bg-white text-black px-6 py-3 rounded-lg mt-4 w-80 flex items-center"
            onMouseEnter={() => setShowArrow(true)}
            onMouseLeave={() => setShowArrow(false)}
          >
            Learn More
            {showArrow && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a.75.75 0 01.75.75V12h6a.75.75 0 110 1.5h-6v7.25a.75.75 0 01-1.5 0V13.5H3.75a.75.75 0 010-1.5H10V3.75A.75.75 0 0110 3z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="container mx-auto mt-20 relative flex-grow">
        <img src="/image 3.png" alt="Image 3" className="rounded-lg h-auto max-w-full" style={{ zIndex: 0, position: 'absolute', top: 10}} />
        <img src="/image 4.png" alt="Image 4" className="absolute top-0 left-20 rounded-lg shadow-lg transform scale-75 mt-[-60px] h-auto max-w-full" style={{ zIndex: 1}} />
        <img src="/image 5.png" alt="Image 5" className="absolute top-0 left-12 rounded-lg shadow-lg transform scale-75 mt-80 h-auto max-w-full" style={{ zIndex: 1 }} />
      </div>
    </div>
  );
};

export default LandingPage;
