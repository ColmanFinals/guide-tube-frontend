import axios, { AxiosInstance } from "axios";

const youtubeAPI: AxiosInstance = axios.create({
    baseURL: 'https://youtube.googleapis.com',
});

export const getOauth2Token = async () => {
    const googleOauth2AccessToken = localStorage.getItem('googleOauth2AccessToken');
    if (googleOauth2AccessToken) {
        return googleOauth2AccessToken;
    } else {
        return new Promise((resolve, reject) => {
            google.accounts.oauth2.initTokenClient({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                scope: 'email profile https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl',
                callback: (response) => {
                    if (response.access_token) {
                        localStorage.setItem('googleOauth2AccessToken', response.access_token);
                        resolve(response.access_token);
                    } else {
                        reject(new Error("Unable to generate an access token"));
                    }
                },
            }).requestAccessToken();
        });
    }
};

export const createPlaylist = async (playlistName: string, isPrivate: boolean, description: string): Promise<string> => {
    try {
        const googleOauth2AccessToken = await getOauth2Token();
        console.log(googleOauth2AccessToken);
        
        const response = await youtubeAPI.post(
            `/youtube/v3/playlists?part=snippet,status&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`, 
            {
                snippet: {
                    title: playlistName,
                    description: description,
                    tags: ["sample playlist", "API call"],
                    defaultLanguage: "en"
                },
                status: {
                    privacyStatus: isPrivate ? "private" : "public"
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${googleOauth2AccessToken}`
                }
            }
        );
        
        return response.data.id;
    } catch (e) {
        console.error("Failed to create playlist:", e);
        throw e;
    }
};


export const uploadVideo = async (videoFile: File, videoName: string, isPrivate: boolean, description: string) => {
    const token = await getOauth2Token();
    const xhr = new XMLHttpRequest();

    // Set up the request
    xhr.open('POST', 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);

    // Construct the FormData
    const formData = new FormData();
    const snippet = {
        snippet: {
            title: videoName,
            description: description,
            defaultLanguage: 'en',
        },
        status: {
            privacyStatus: isPrivate ? 'private' : 'public',
        }
    };

    // Append the snippet and status as JSON blob
    formData.append('snippet', new Blob([JSON.stringify(snippet)], { type: 'application/json' }));

    // Append the video file
    formData.append('file', videoFile);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            return (response.id);
        } else {
            throw (new Error(`Failed to upload video: ${xhr.status} ${xhr.statusText}`));
        }
    };

    // Set up the error event
    xhr.onerror = () => {
        throw (new Error('Network error occurred'));
    };

    // Send the request
    xhr.send(formData);

};
