import { Link } from 'react-router-dom'; // Import Link component
import MenuIcon from '@mui/icons-material/Menu';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const LandingPage = () => {

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="bg-gray-800 flex justify-between items-center p-2">
        <div>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            GuideTube
          </button>
        </div>
        <div>
          <Link to="/login" className="text-gray-400 hover:text-gray-200 mr-4">
            Log In
          </Link>
  
          <Link to="/signup" className="text-gray-400 hover:text-gray-200 mr-4">
            Sign Up
          </Link>
          <MenuIcon />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <div className="container mx-auto mt-8 px-10 max-w-screen-md">
          <div className="bg-black p-6 rounded-lg relative">
            <p className="text-white-400">Meet GuideTube: The app that will help you succeed</p>
            <button className="bg-white text-black px-6 py-3 rounded-lg mt-4 flex justify-between w-full">
              <span className="flex items-center">Learn More</span>
              <span className="flex items-center ml-auto"><ArrowRightAltIcon /></span>
            </button>
          </div>
        </div>
  
      <div className="container mx-auto mt-10 relative">
        <img src="/image 3.png" alt="Image 3" className="rounded-lg h-auto max-w-full" style={{ zIndex: 0, position: 'absolute', top: 10, height: 450,width:360 }} />
        <img src="/image 4.png" alt="Image 4" className="absolute top-0 left-20 rounded-lg shadow-lg transform scale-75 mt-[-60px] h-auto max-w-full" style={{ zIndex: 1 }} />
        <img src="/image 5.png" alt="Image 5" className="absolute top-0 left-10 rounded-lg shadow-lg transform scale-75 mt-56 h-auto max-w-full" style={{ zIndex: 1 }} />
      </div>
      



      </div>
    </div>
  );
  
};

export default LandingPage;
