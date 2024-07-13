import { useState } from 'react';
import VideoInput from "./VideoInput";
import PageTopTitle from "../../PageTopTitle";
import Input from '@mui/material/Input';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import Fab from '@mui/material/Fab';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const UploadGuidePage = () => {
    const [videoInputs, setVideoInputs] = useState<number[]>([1]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const addVideoInput = () => {
        setVideoInputs(prevVideosList => {
            if (prevVideosList.length < 10) {
                return [...prevVideosList, prevVideosList.length + 1];
            } else {
                setSnackbarOpen(true);
                return prevVideosList;
            }
        });
    };



    return (
        <div className="h-full w-full relative">
            <div className="flex items-center justify-start flex-col w-full h-full">
                <PageTopTitle pageTitle="Create a new guide" />
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                    <Alert variant="outlined" severity="info">
                        You can only add up to 10 videos
                    </Alert>
                </Snackbar>
                <div style={{ margin: "1.5em" }}>
                    <Input sx={{ fontSize: "1.5em" }} defaultValue="New Video" />
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden w-full flex flex-row flex-wrap items-start justify-center p-4 h-full">
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
