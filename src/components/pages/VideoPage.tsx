import React, { useCallback, useEffect, useRef, useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';
import { Box, Button, Card, CardContent, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from "../../services/serverApi";
import SpeechRecognition from '../Video/SpeechRecognition';
import PageTopTitle from '../PageTopTitle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { IGuide } from '../../interfaces/IGuide';

const VideoPage: React.FC = () => {
    const { guideId } = useParams<{ guideId: string }>();
    const [guide, setGuide] = useState<IGuide | null>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const playerRef = useRef<YouTubePlayer | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false); // Flag for listening state

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const response = await api.post<IGuide>('/guide/byId', { guideId });
                setGuide(response.data);
            } catch (err) {
                setError('Failed to fetch guide.');
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

    const applyPlayPause = () => {
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
            applyMute(newMutedState);
            return newMutedState;
        });
    };

    const applyMute = (toMute: boolean) => {
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
        startVideo()
    };

    const playPreviousVideo = () => {
        setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + (guide?.videos.length || 1)) % (guide?.videos.length || 1));
        startVideo()
    };

    const syncStateChange = (event: { data: number }) => {
        const playerStateNumber = event.data;
        if (playerRef.current) {
            if (playerStateNumber === -1) {
                playerRef.current.playVideo();
            } else if (playerStateNumber === 0) {
                playNextVideo();
                setIsPlaying(false);
            } else if (playerStateNumber === 1) {
                setIsPlaying(true);
                setIsMuted(false);
            } else if (playerStateNumber === 2) {
                setIsPlaying(false);
            }
        }
    };
    const handleCommand = useCallback(
        (command: string) => {
            const lowerCommand = command.toLowerCase();
            let feedbackMessage = '';

            if (lowerCommand.includes('pause') || lowerCommand.includes('stop')) {
                if (!isListening) { 
                    stopVideo();
                    // feedbackMessage = 'Pausing video.';
                }
            } else if (lowerCommand.includes('mute')) {
                toggleMute();
                feedbackMessage = isMuted ? 'Unmuting video.' : 'Muting video.';
            } else if (lowerCommand.includes('unmute')) {
                if (isMuted) {
                    toggleMute();
                    feedbackMessage = 'Unmuting video.';
                } else {
                    feedbackMessage = 'Video is already unmuted.';
                }
            } else if (lowerCommand.includes('next')) {
                playNextVideo();
                feedbackMessage = 'Playing next video.';
            } else if (lowerCommand.includes('previous')) {
                playPreviousVideo();
                feedbackMessage = 'Playing previous video.';
            } else if (lowerCommand.includes('play')) {
                startVideo();
                feedbackMessage = 'Playing video.';
            } else {
                feedbackMessage = 'Sorry, I didn’t understand that command.';
            }

            if (feedbackMessage && !isListening) {
                speak(feedbackMessage);
            }
        },
        [isPlaying, isMuted, isListening]
    );

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

    const opts: YouTubeProps['opts'] = {
        height: isMobile ? '300' : '400',
        width: '100%',
        playerVars: { autoplay: 1, controls: 0 },
    };

    if (error) return <div>{error}</div>;
    if (!guide) return <div>Loading...</div>;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
            }}
        >
            <PageTopTitle pageTitle={guide.name} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflowY: 'auto',
                    paddingTop: '4rem',
                    paddingBottom: '6rem',
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
                                <Box
                                    display="flex"
                                    flexWrap="wrap"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mt={1}
                                    sx={{ px: '3%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{ flexShrink: 0, fontSize: isMobile ? '1rem' : '1.25rem' }}
                                    >
                                        {guide.name}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ flexShrink: 0, fontSize: isMobile ? '1rem' : '1.25rem' }}
                                    >
                                        Views: {guide.views}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ flexShrink: 0, fontSize: isMobile ? '1rem' : '1.25rem' }}
                                    >
                                        Currently watching: {guide.videos[currentVideoIndex]?.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ flexShrink: 0, fontSize: isMobile ? '1rem' : '1.25rem' }}
                                    >
                                        {currentVideoIndex + 1} out of {guide.videos.length}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={10} md={8}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={applyPlayPause}
                                >
                                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={playPreviousVideo}
                                >
                                    <SkipPreviousIcon />
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={playNextVideo}
                                >
                                    <SkipNextIcon />
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={toggleMute}
                                >
                                    {isMuted ? <VolumeUpIcon /> : <VolumeOffIcon />}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <SpeechRecognition
                onCommand={handleCommand}
                stopVideo={stopVideo}
            />
        </Box>
    );
};

export default VideoPage;
