import { useState } from 'react';
import VideoInput from "./VideoInput";
import PageTopTitle from "../../PageTopTitle";
import Input from '@mui/material/Input';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import Fab from '@mui/material/Fab';

const UploadGuidePage = () => {
    const [videoInputs, setVideoInputs] = useState<number[]>([1]);

    const addVideoInput = () => {
        setVideoInputs(prevVideosList => {
            if (prevVideosList.length < 10) {
                return [...prevVideosList, prevVideosList.length + 1];
            }
            return prevVideosList;
        });
    };

    return (
        <div className="h-full w-full relative"> {/* Outer container with relative positioning */}
            <div className="flex items-center justify-start flex-col w-full h-full">
                <PageTopTitle pageTitle="Create a new guide" />
                <div style={{ margin: "1.5em" }}>
                    <Input sx={{ fontSize: "1.5em" }} defaultValue="New Video" />
                </div>
                <div style={{overflowY: 'auto', overflowX: 'hidden', width: '100%', padding: '1.5em'}}>
                    {videoInputs.map(fragment => (
                        <VideoInput key={fragment} fragment={fragment} />
                    ))}
                </div>
            </div>
            <Fab size="large" color="secondary" onClick={addVideoInput}
                style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                <AddCardRoundedIcon fontSize="large" />
            </Fab>
        </div>
    );
}

export default UploadGuidePage;
