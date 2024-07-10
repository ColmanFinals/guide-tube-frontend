import { useState } from 'react';
import VideoInput from "./VideoInput";
import PageTopTitle from "../../PageTopTitle";
import Input from '@mui/material/Input';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import IconButton from '@mui/material/IconButton';

const UploadGuidePage = () => {
    const [videoInputs, setVideoInputs] = useState<number[]>([1]);

    const addVideoInput = () => {
        setVideoInputs(prev => {
            if (prev.length < 10) {
                return [...prev, prev.length + 1];
            }
            return prev;
        });
    };

    return (
        <div className="h-full w-full">
            <div className="flex items-center justify-center flex-col w-full">
                <PageTopTitle pageTitle="Create a new guide" />
                <div className="flex flex-row" style={{ margin: "1.5em" }}>
                    <Input sx={{ fontSize: "1.5em" }} defaultValue="New Video" />
                    <IconButton onClick={addVideoInput}>
                        <AddCardRoundedIcon fontSize="large" />
                    </IconButton>
                </div>
                {videoInputs.map(fragment => (
                    <VideoInput key={fragment} fragment={fragment} />
                ))}
            </div>
        </div>
    );
}

export default UploadGuidePage;
