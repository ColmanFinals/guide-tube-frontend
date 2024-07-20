import {useRef, useState} from 'react';
import YouTube, {YouTubePlayer, YouTubeProps} from 'react-youtube';
import Button from '@mui/material/Button';
const HomePage = () => {
    const videoIds = ['SSn1g1micfs', 'fnEPYg2cb1g', 'eyDk9MZ-odk'];
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const playerRef = useRef<YouTubePlayer>(null);

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // Store a reference to the player
        playerRef.current = event.target;
    };

    const ApplyPlayPause = () =>
        isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();

    const toggleMute = () => {
        setIsMuted(!isMuted);
        console.log(isMuted ? 'Mute' : 'Unmute');
        ApplyMute(isMuted);
    };

    const ApplyMute = (toMute: boolean) =>
        toMute ? playerRef.current.unMute() : playerRef.current.mute();

    const playNextVideo = () => {
        const nextIndex = (currentVideoIndex + 1) % videoIds.length;
        setCurrentVideoIndex(nextIndex);
    };

    const playPreviousVideo = () => {
        const previousIndex = (currentVideoIndex - 1 + videoIds.length) % videoIds.length;
        setCurrentVideoIndex(previousIndex);
    };

    const syncStateChange = (PlayerStateNumber: number) => {
        if (PlayerStateNumber === -1)
            playerRef.current.playVideo();
        else if (PlayerStateNumber === 0) {
            playNextVideo();
            setIsPlaying(false);
        } else if (PlayerStateNumber === 1) {
            setIsPlaying(true);
            ApplyMute(!isMuted);
        } else if (PlayerStateNumber === 2)
            setIsPlaying(false);
    };

    const opts: YouTubeProps['opts'] = {
        height: '640',
        width: '360',
        playerVars: {'autoplay': 1, 'controls': 0,},    
    };

    return (
        <div className="w-full">
            <div className=' flex flex-col flex-wrap justify-center items-center text-center w-full'>
                <div className='w-full flex justify-center items-center'>
                    <YouTube videoId={videoIds[currentVideoIndex]} opts={opts} onReady={onPlayerReady}
                             onStateChange={(PlayerStateNumber: { data: number; }) => syncStateChange(PlayerStateNumber.data)}/>
                </div>
                <div className='flex flex-row gap-2 '>
                    <Button variant="contained" onClick={ApplyPlayPause}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button variant="contained" onClick={playPreviousVideo}>
                        Previous
                    </Button>
                    <Button variant="contained" onClick={playNextVideo}>
                        Next
                    </Button>
                    <Button variant="contained" onClick={toggleMute}>
                        {isMuted ? 'Unmute' : 'Mute'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
