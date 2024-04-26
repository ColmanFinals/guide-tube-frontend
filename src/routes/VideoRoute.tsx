import { useState, useRef } from 'react';
import YouTube, {YouTubePlayer, YouTubeProps} from 'react-youtube';
import { Button } from '@mui/material';

export const VideoRoute = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef<YouTubePlayer>(null);

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // Store a reference to the player
        playerRef.current = event.target;
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
        // Toggle the playing state
        setIsPlaying(!isPlaying);
    };

    const opts: YouTubeProps['opts'] = {
        height: '640',
        width: '390',
        playerVars: {
            autoplay: 0,
        },
    };

    return (
        <div className='bg-[linear-gradient(#141e30, #243b55)] items-center'>
            <div className='flex-col text-center'>
                <YouTube videoId="SSn1g1micfs" opts={opts} onReady={onPlayerReady} />
                <Button variant={"contained"} onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Resume'}</Button>
            </div>
        </div>
    );
};
