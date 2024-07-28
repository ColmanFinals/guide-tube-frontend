import { useState } from 'react';
import VideoInput from './VideoInput';
import PageTopTitle from '../../PageTopTitle';
import Input from '@mui/material/Input';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import { Grid, Box } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { createPlaylist, uploadVideo, addVideoToPlaylist } from '../../../services/guideService';
import { ToastContainer, toast } from 'react-toastify';
import PlaylistConfiguration from './PlaylistConfiguration';

export interface Video {
    "file"?: File,
    "fragment": number,
    "source": string,
    "title": string
}
const UploadGuidePage = () => {
    const defaultPlaylistName = "New Guide"
    const [videos, setVideos] = useState<Video[]>([{ "file": undefined, "fragment": 1, "source": "", "title": "" }]);
    const [playlistName, setPlaylistName] = useState(defaultPlaylistName);
    const theme = useTheme();
    const [isPrivate, setIsPrivate] = useState(false);
    const [company, setCompany] = useState("");
    const [userCompanies, setUserCompanies] = useState(["Company1", "Company2", "Company3"]);
    const [openModal, setOpenModal] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const addVideoInput = () => {
        setVideos(prevVideosList => {
            if (prevVideosList.length < 10) {
                return [...prevVideosList, { "file": undefined, "fragment": prevVideosList.length + 1, "source": "", "title": "" }];
            } else {
                toast.error("You can only add up to 10 videos");
                return prevVideosList;
            }
        });
    };

    const handleSave = async () => {
        try {
            const playlistID = await createPlaylist(playlistName, isPrivate, "Created by GuideTube!");
            for (const video of videos) {
                if (video.file) {
                    const title = video.title !== "" ? video.title : String(video.fragment);
                    const videoID = await uploadVideo(video.file, title, isPrivate, "Created by GuideTube!");
                    await addVideoToPlaylist(playlistID, videoID, video.fragment - 1);
                }
            }

            toast.success("Guide created successfully!");

        } catch (e) {
            toast.error("An error occurred during guide creation.");
        }
    };

    const handleStartAgain = () => {
        console.log('Start Again clicked');
        setIsPrivate(false);
        setVideos([{ "file": undefined, "fragment": 1, "source": "", "title": "" }])
    };


    const handleDeleteVideo = (videoToRemove: Video) => {
        const fragmentToRemove = videoToRemove.fragment;
        setVideos(prevVideosList => prevVideosList.filter(video => video.fragment !== fragmentToRemove));
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
                <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ width: '100%', marginBottom: 2, marginTop: 5 }}>
                    <Grid item xs={11} lg={4} container alignItems="center" justifyContent="center">
                        <Input
                            fullWidth
                            sx={{ fontSize: '1.2em', padding: '0.5em', mb: 2, border: 'none', maxWidth: isMobile ? '90%' : '300px' }}
                            defaultValue={defaultPlaylistName}
                            placeholder="Enter video title"
                            onChange={(event) => setPlaylistName(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3} container justifyContent="center">
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<RestartAltIcon />}
                            onClick={handleStartAgain}
                            sx={{ mt: 2 }}
                        >
                            Start Again
                        </Button>
                    </Grid>
                </Grid>

                <Grid container spacing={3} justifyContent="center">
                    {videos.map(video => (
                        <Grid item key={video.fragment} xs={12} sm={6} md={4} lg={3}>
                            <VideoInput
                                video={video}
                                setVideos={setVideos}
                                onDelete={() => handleDeleteVideo(video)}
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
                    onClick={() => setOpenModal(true)}
                    sx={{ width: '50%', maxWidth: '300px' }}
                >
                    Finish
                </Button>
            </Box>

            <Fab
                size="large"
                color="secondary"
                onClick={addVideoInput}
                sx={{ position: 'fixed', right: '2em', bottom: '80px', zIndex: 1000 }}
            >
                <AddCardRoundedIcon fontSize="large" />
            </Fab>
            <PlaylistConfiguration handleSave={handleSave} isPrivate={isPrivate} open={openModal} setCompany={setCompany}
                setIsOpen={setOpenModal} setIsPrivate={setIsPrivate} userCompanies={userCompanies} />
            <ToastContainer theme="dark" position="top-center" autoClose={5000} hideProgressBar={false}
                newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss pauseOnHover />
        </Box>
    );
};

export default UploadGuidePage;
