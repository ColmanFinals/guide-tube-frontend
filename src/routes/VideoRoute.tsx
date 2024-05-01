import {useRef, useState} from 'react';
import YouTube, {YouTubePlayer, YouTubeProps} from 'react-youtube';

export const VideoRoute = () => {
    const videoIds = ['SSn1g1micfs', 'fnEPYg2cb1g', 'eyDk9MZ-odk'];
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
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

    const toggleMute = () => {
        if (isMuted) {
            playerRef.current.unMute();
        } else {
            playerRef.current.mute();
        }
        // Toggle the playing state
        setIsMuted(!isMuted);
    };

    const playNextVideo = () => {
        const nextIndex = (currentVideoIndex + 1) % videoIds.length;
        setCurrentVideoIndex(nextIndex);
    };

    const playPreviousVideo = () => {
        const previousIndex = (currentVideoIndex - 1 + videoIds.length) % videoIds.length;
        setCurrentVideoIndex(previousIndex);
    };

    const opts: YouTubeProps['opts'] = {
        height: '640',
        width: '390',
        playerVars: {'autoplay': 1, 'controls': 0},
    };

    return (
        <div className='bg-[linear-gradient(#141e30, #243b55)] items-center'>
            <div className='flex flex-col text-center items-center'>
                <div className=''>
                    <YouTube videoId={videoIds[currentVideoIndex]} opts={opts} onReady={onPlayerReady}/>
                </div>
                <div className='flex flex-row gap-2'>
                    <button className="bg-blue-400 w-18 hover:bg-blue-500 text-gray-800 py-2 px-4 rounded"
                            onClick={togglePlayPause}>
                        {isPlaying ? 'Pause' : 'Resume'}
                    </button>
                    <button className="bg-blue-400 w-18 hover:bg-blue-500 text-gray-800 py-2 px-4 rounded"
                            onClick={playPreviousVideo}>
                        Previous
                    </button>
                    <button className="bg-blue-400 w-18 hover:bg-blue-500 text-gray-800 py-2 px-4 rounded"
                            onClick={playNextVideo}>
                        Next
                    </button>
                    <button className="bg-blue-400 w-18 hover:bg-blue-500 text-gray-800 py-2 px-4 rounded"
                            onClick={toggleMute}>
                        {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                </div>
            </div>
        </div>
    );
};
