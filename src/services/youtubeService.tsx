import axios from 'axios';

const accessToken = localStorage.getItem('accessToken');
let apiKey = 'AIzaSyDSljXeq1kx_QtqACnguzVZEC2nqEHz0o4';


export const createPlaylist = async (title: any, description: any) => {
    console.log(`accessToken is ${accessToken}`);
    const response = await axios.post(
        'https://www.googleapis.com/youtube/v3/playlists',
        {
            snippet: {
                title: title,
                description: description,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
            params: {
                part: 'snippet',
                 key: apiKey,
                // key: apiKey,
            },
        }
    );

    return response.data;
};

export const uploadVideo = async (playlistId: any, videoUrl: any, title: any, description: any) => {
    const response = await axios.post(
        'https://www.googleapis.com/youtube/v3/videos',
        {
            snippet: {
                title: title,
                description: description,
            },
            status: {
                privacyStatus: 'private', // Change as needed
            },
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            params: {
                part: 'snippet,status',
                key: apiKey,
            },
        }
    );

    const videoId = response.data.id;

    await axios.post(
        'https://www.googleapis.com/youtube/v3/playlistItems',
        {
            snippet: {
                playlistId: playlistId,
                resourceId: {
                    kind: 'youtube#video',
                    videoId: videoId,
                },
            },
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
            params: {
                part: 'snippet',
                key: apiKey,
            },
        }
    );

    return response.data;
};
