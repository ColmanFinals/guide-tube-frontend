import { useState } from 'react';
import VideoInput from './VideoInput';
import PageTopTitle from '../../PageTopTitle';
import Input from '@mui/material/Input';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { Grid, Box } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

const UploadGuidePage = () => {
    const [videoInputs, setVideoInputs] = useState<number[]>([1]);
    const [videoSources, setVideoSources] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

    const handleSave = () => {
        // Implement save logic here
        console.log('Save clicked');
    };

    const handleStartAgain = () => {
        // Implement start again logic here
        console.log('Start Again clicked');
        // Clear video inputs and sources
        setVideoInputs([1]);
        setVideoSources([]);
    };

    const handleDeleteVideo = (fragment: number) => {
        // Remove video input from state
        setVideoInputs(prevVideos => {
            const updatedVideos = prevVideos.filter(frag => frag !== fragment);
            return updatedVideos.map((_, index) => index + 1);
        });
        // Remove video source from state
        setVideoSources(prevSources => {
            const updatedSources = prevSources.filter((_, index) => index !== fragment - 1);
            return updatedSources;
        });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: theme.palette.background.paper,
                    zIndex: 1200,
                }}
            >
                <PageTopTitle pageTitle="Create a new guide" />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflowY: 'auto',
                    paddingTop: '4rem', // Space for the fixed header
                    paddingBottom: '6rem', // Space for the fixed footer
                }}
            >
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert variant="outlined" severity="info">
                        You can only add up to 10 videos
                    </Alert>
                </Snackbar>

                <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ width: '100%', marginBottom: 2, marginTop: 5 }}>
                    <Grid item xs={11} lg={4} container alignItems="center" justifyContent="center">
                        <Input
                            fullWidth
                            sx={{ fontSize: '1.2em', padding: '0.5em', mb: 2, border: 'none', maxWidth: isMobile ? '90%' : '300px' }}
                            defaultValue="New Video"
                            placeholder="Enter video title"
                        />
                    </Grid>

                    <Grid item xs={12} lg={3} container justifyContent="center">
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<RestartAltIcon />}
                            onClick={handleStartAgain}
                            sx={{ mt: 2 }} // Margin top
                        >
                            Start Again
                        </Button>
                    </Grid>
                </Grid>

                <Grid container spacing={3} justifyContent="center">
                    {videoInputs.map(fragment => (
                        <Grid item key={fragment} xs={12} sm={6} md={4} lg={3}>
                            <VideoInput
                                fragment={fragment}
                                source={videoSources[fragment - 1]}
                                onDelete={() => handleDeleteVideo(fragment)}
                                onFileChange={(url) => {
                                    setVideoSources(prevSources => {
                                        const newSources = [...prevSources];
                                        newSources[fragment - 1] = url;
                                        return newSources;
                                    });
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 85,
                    left: 0,
                    right: 0,
                    zIndex: 1200,
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '0 1rem',
                    gap: '1rem',
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ width: '100%', maxWidth: '300px' }}
                >
                    Save
                </Button>
            </Box>

            <Fab
                size="large"
                color="secondary"
                onClick={addVideoInput}
                sx={{ position: 'fixed', right: '16px', bottom: '80px', zIndex: 1000 }}
            >
                <AddCardRoundedIcon fontSize="large" />
            </Fab>
        </Box>
    );
};

export default UploadGuidePage;
