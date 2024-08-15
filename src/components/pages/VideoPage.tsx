import React, {useCallback, useEffect, useRef, useState} from 'react';
import YouTube, {YouTubePlayer, YouTubeProps} from 'react-youtube';
import 'regenerator-runtime/runtime';
import {Box, Button, Card, CardContent, Grid, useMediaQuery, useTheme} from '@mui/material';
import {useParams} from 'react-router-dom';
import api from "../../services/serverApi.tsx";
import SpeechRecognition from '../Video/SpeechRecognition';
import PageTopTitle from '../PageTopTitle';
import './VideoPage.css';

interface IVideo {
    id: string;
    title: string;
}

interface IGuide {
    name: string;
    views: number;
    videos: IVideo[];
}

const VideoPage: React.FC = () => {
    const {guideId} = useParams<{ guideId: string }>();
    const [guide, setGuide] = useState<IGuide | null>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const playerRef = useRef<YouTubePlayer | null>(null);
    const [error, setError] = useState<string | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const response = await api.post<IGuide>('/guide/byId', {guideId});
                setGuide(response.data);
            } catch (err) {
                setError('Failed to fetch companies.');
            }
        };

        fetchGuide();
    }, [guideId]);

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target;
    };

    const startVideo = () => {
        playerRef.current?.playVideo();
        setIsPlaying(true);
    };

    const stopVideo = () => {
        playerRef.current?.pauseVideo();
        setIsPlaying(false);
    };

    const ApplyPlayPause = () => {
        if (playerRef.current) {
            if (isPlaying) {
                stopVideo();
            } else {
                startVideo();
            }
        }
    };

    const toggleMute = () => {
        setIsMuted((prev) => {
            const newMutedState = !prev;
            ApplyMute(newMutedState);
            return newMutedState;
        });
    };

    const ApplyMute = (toMute: boolean) => {
        if (playerRef.current) {
            if (toMute) {
                playerRef.current.mute();
            } else {
                playerRef.current.unMute();
            }
        }
    };

    const playNextVideo = () => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % (guide?.videos.length || 1));
    };

    const playPreviousVideo = () => {
        setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + (guide?.videos.length || 1)) % (guide?.videos.length || 1));
    };

    const syncStateChange = (event: { data: number }) => {
        const PlayerStateNumber = event.data;
        if (playerRef.current) {
            if (PlayerStateNumber === -1) {
                playerRef.current.playVideo();
            } else if (PlayerStateNumber === 0) {
                playNextVideo();
                setIsPlaying(false);
            } else if (PlayerStateNumber === 1) {
                setIsPlaying(true);
                ApplyMute(!isMuted);
            } else if (PlayerStateNumber === 2) {
                setIsPlaying(false);
            }
        }
    };

    const handleCommand = useCallback(
        (command: string) => {
            const lower_command = command.toLowerCase();

            if (lower_command.includes('pause') || lower_command.includes('stop')) {
                stopVideo();
            } else if (lower_command.includes('mute')) {
                toggleMute();
            } else if (lower_command.includes('next')) {
                playNextVideo();
            } else if (lower_command.includes('previous')) {
                playPreviousVideo();
            } else if (lower_command.includes('play')) {
                startVideo();
            }
        },
        [isPlaying, isMuted]
    );

    const opts: YouTubeProps['opts'] = {
        height: isMobile ? '300' : '400',
        width: '100%',
        playerVars: {autoplay: 1, controls: 0},
    };

    if (error) return <div>{error}</div>;
    if (!guide) return <div>Loading...</div>;

    return (
        <Box sx={{flexGrow: 1, padding: 2}}>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'background.paper',
                    zIndex: 1200,
                }}
            >
                <PageTopTitle pageTitle={guide.name}/>
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
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={10} md={8}>
                        <Card>
                            <CardContent>
                                <YouTube
                                    videoId={guide.videos[currentVideoIndex]?.id}
                                    opts={opts}
                                    onReady={onPlayerReady}
                                    onStateChange={syncStateChange}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={10} md={8}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={ApplyPlayPause}>
                                    {isPlaying ? 'Pause' : 'Play'}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={playPreviousVideo}>
                                    Previous
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={playNextVideo}>
                                    Next
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={toggleMute}>
                                    {isMuted ? 'Unmute' : 'Mute'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Box mt={4}>
                    <SpeechRecognition onCommand={handleCommand}/>
                </Box>
            </Box>
        </Box>
    );
};

export default VideoPage;
