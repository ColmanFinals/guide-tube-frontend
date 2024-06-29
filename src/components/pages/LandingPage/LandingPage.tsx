import LandingPageNavbar from './LandingPageNavbar';
import LearnMore from './LearnMore';

const LandingPage = () => {
  return (
    <div className="text-white min-h-screen w-full flex flex-col">  
      <LandingPageNavbar/>    
      <div className="flex justify-center items-center flex-row flex-wrap">
            <LearnMore/>
            <img src="/image 6.png" alt="Image 3" className="rounded-lg h-auto" style={{width:"80%", margin:"1vh"}} />
          </div>
      </div>
  );
};

export default LandingPage;
