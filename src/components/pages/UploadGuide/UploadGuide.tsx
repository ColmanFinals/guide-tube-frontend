import {useEffect, useState} from 'react';
import VideoInput from './VideoInput';
import PageTopTitle from '../../PageTopTitle';
import Input from '@mui/material/Input';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import {Box, Grid, useMediaQuery, useTheme} from '@mui/material';
import {addGuideToCompany, addVideoToPlaylist, createPlaylist, uploadVideo} from '../../../services/guideService';
import {toast, ToastContainer} from 'react-toastify';
import PlaylistConfiguration from './PlaylistConfiguration';
import {ICompany, IGuide, INewGuideRequest, IVideo} from '../../../utillity/types';
import {fetchMyCompanies} from '../../../services/companiesService';

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
    const [userCompanies, setUserCompanies] = useState<string[]>([]);
    const [company, setCompany] = useState<string>("");
    const [openModal, setOpenModal] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const companyData: ICompany[] = await fetchMyCompanies();
                const companyNames = companyData.map(company => company.name);
                setUserCompanies(companyNames);
                setCompany(userCompanies[0])
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };
        loadCompanies();
    }, []);

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
            const privacy = isPrivate ? "unlisted" : "public";
            const guideData: IGuide = {
                createdAt: new Date().toISOString(),
                name: playlistName,
                views: 0,
                privacyStatus: privacy
            };
            const videosData: IVideo[] = [];

            // Create the playlist
            const playlist = await createPlaylist(playlistName, isPrivate, "Created by GuideTube!");

            // Iterate over videos and upload them
            for (const video of videos) {
                if (video.file) {
                    const title = video.title !== "" ? video.title : String(video.fragment);

                    // Upload video
                    const videoID = await uploadVideo(video.file, title, isPrivate, "Created by GuideTube!");

                    // Add video to playlist
                    const videoData = await addVideoToPlaylist(playlist.id, videoID, video.fragment - 1);
                    videosData.push({...videoData});
                }
            }
            const newGuideRequest: INewGuideRequest = {
                guideData: guideData, companyName: company, playlistData: playlist,
                videoData: videosData
            }
            await addGuideToCompany(newGuideRequest);
            toast.success("Guide created successfully!");
        } catch (e) {
            // Handle any errors that occur during the guide creation process
            toast.error("An error occurred during guide creation.");
        }
    };

    const handleStartAgain = () => {
        setIsPrivate(false);
        setVideos([{"file": undefined, "fragment": 1, "source": "", "title": ""}])
    };


    const handleDeleteVideo = (videoToRemove: Video) => {
        setVideos(prevVideosList => {
            const updatedVideos = prevVideosList.filter(video => video.fragment !== videoToRemove.fragment);
            return updatedVideos.map((video, index) => ({
                ...video,
                fragment: index + 1,
            }));
        });
    };


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
            }}
        >
            <PageTopTitle pageTitle="Companies manager" />
            <Box
                sx={{
                    flex: 1,
                    padding: 2,
                }}
            >

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        paddingBottom: '6rem',
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
                    sx={{ position: 'fixed', right: '2em', bottom: '80px', zIndex: 1300 }}
                >
                    <AddCardRoundedIcon fontSize="large" />
                </Fab>
                <PlaylistConfiguration handleSave={handleSave} isPrivate={isPrivate} open={openModal} setCompany={setCompany}
                    setIsOpen={setOpenModal} setIsPrivate={setIsPrivate} userCompanies={userCompanies} />
                <ToastContainer theme="dark" position="top-center" autoClose={5000} hideProgressBar={false}
                    newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss pauseOnHover />
            </Box>
        </Box>
    );
};

export default UploadGuidePage;
