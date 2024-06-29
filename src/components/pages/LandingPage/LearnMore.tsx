import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Shake } from 'reshake';

const LearnMore = () => {
    return (
        <div className="flex flex-col items-center w-full" style={{margin:"2vh", maxHeight:"50%"}}>
            <p style={{ fontSize: "1.5em" }} className="text-center">Guidance. Voice-Activated.</p>
            <div className="bg-black p-6 rounded-lg ">
                <p className="text-white-400" style={{ fontSize: "1em" }}>GuideTube is the premier voice-controlled platform for seamless, hands-free guide navigation, perfect for any task that requires your full attention.</p>
                <Link to="/signup" className="text-gray-400 hover:text-gray-200 mr-4 flex justify-center">
                    <Shake h={10} v={0} r={0} dur={1000} freez={false} fixed={true} fixedStop={false}>
                        <Button variant="contained">
                            Sign Up
                        </Button>
                    </Shake>                 
                </Link>
                <button className="bg-white text-black px-6 py-3 rounded-lg mt-4 flex justify-between w-full">
                    <span className="flex items-center" style={{ fontSize: "0.8em" }}>Learn More</span>
                    <span className="flex items-center ml-auto"><ArrowRightAltIcon /></span>
                </button>
            </div>
        </div>
    )
}

export default LearnMore;