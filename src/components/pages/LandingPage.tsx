import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import LandingPageNavbar from '../LandingPageNavbar';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
const LandingPage = () => {

  return (
    <div className="text-white min-h-screen flex flex-col">  
    <LandingPageNavbar/>    
      <div className="flex-grow overflow-y-auto flex justify-center w-full">
        <div className="container mx-auto mt-8 px-10 max-w-screen-md absolute">
          <p style={{fontSize:"8vh"}}>Guidance. Voice-Activated.</p>
          <div className="bg-black p-6 rounded-lg relative">
            <p className="text-white-400" style={{fontSize:"3vh"}}>GuideTube is the premier voice-controlled platform for seamless, hands-free guide navigation, perfect for any task that requires your full attention.</p>
            <Link to="/signup" className="text-gray-400 hover:text-gray-200 mr-4 flex justify-center">
              <Button variant="contained" style={{width: "10vw" ,height: "8vh" ,fontSize: "large"}}>
                Sign Up
              </Button>
            </Link> 
            <button className="bg-white text-black px-6 py-3 rounded-lg mt-4 flex justify-between w-full">
              <span className="flex items-center">Learn More</span>
              <span className="flex items-center ml-auto"><ArrowRightAltIcon /></span>
            </button>
          </div>
        </div>
        
        <div className="container mt-10 absolute">
          <img src="/image 6.png" alt="Image 3" className="rounded-lg h-auto max-w-full" style={{ zIndex: 0, position: 'absolute', top: 10, height: 450,width:420 }} />
        </div>
      </div>
    </div>
  );
  
};

export default LandingPage;
