import { youtubeAPI } from "./youtubeApi";
import { INewGuideRequest, IPlaylist, IVideo } from "../utillity/types";
import serverApi from "./serverApi";

export const generateOauth2Token = async (): Promise<string> => {
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
};

export const getOauth2Token = async (): Promise<string> => {
    var googleOauth2AccessToken = localStorage.getItem('googleOauth2AccessToken');
    if (!googleOauth2AccessToken) {
        googleOauth2AccessToken = await generateOauth2Token()
    }
    return googleOauth2AccessToken;
};

export const createPlaylist = async (playlistName: string, isPrivate: boolean, description: string): Promise<IPlaylist> => {
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
                    privacyStatus: isPrivate ? "unlisted" : "public"
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
        const playlist: IPlaylist = {
            channelId: response.data.snippet.channelId,
            description: response.data.snippet.description,
            publishedAt: response.data.snippet.publishedAt,
            title: response.data.snippet.title,
            id: response.data.id
        }
        console.log(response.data)
        console.log(playlist)
        return playlist;
    } catch (e) {
        console.error("Failed to create playlist:", e);
        throw e;
    }
};

export const uploadVideo = async (videoFile: File, videoName: string, isPrivate: boolean, description: string): Promise<string> => {
    const token = await getOauth2Token();

    // Construct the FormData
    const formData = new FormData();
    const snippet = {
        snippet: {
            title: videoName,
            description: description,
            defaultLanguage: 'en',
        },
        status: {
            privacyStatus: isPrivate ? 'unlisted' : 'public',
        }
    };

    // Append the snippet and status as JSON blob
    formData.append('snippet', new Blob([JSON.stringify(snippet)], { type: 'application/json' }));

    // Append the video file
    formData.append('file', videoFile);

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    };

    try {
        const response = await youtubeAPI.post(
            '/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status',
            formData,
            config
        );
        return response.data.id;
    } catch (error) {
        console.error('Failed to upload video:', error);
        throw error;
    }
};

export const addVideoToPlaylist = async (playlistID: string, videoID: string, fragment: number): Promise<IVideo> => {
    try {
        const googleOauth2AccessToken = await getOauth2Token();
        console.log(googleOauth2AccessToken);

        const response = await youtubeAPI.post(
            `/youtube/v3/playlistItems?part=snippet,status&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`,
            {
                snippet: {
                    playlistId: playlistID,
                    position: fragment,
                    resourceId: {
                        kind: "youtube#video",
                        videoId: videoID
                    },
                    defaultLanguage: "en"
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${googleOauth2AccessToken}`
                }
            }
        );
        const video: IVideo = {
            channelId: response.data.snippet.channelId,
            description: response.data.snippet.description,
            publishedAt: response.data.snippet.publishedAt,
            id: response.data.snippet.resourceId.videoId,
            index: response.data.snippet.position,
            playlistItemId: response.data.id,
            title: response.data.snippet.title
        }
        console.log(response.data)
        console.log(video)
        return video;
    } catch (e) {
        console.error("Failed to create playlist:", e);
        throw e;
    }
};

export const addGuideToCompany = async (guide: INewGuideRequest) => {
    serverApi.post("/guide", guide).then((response) => {
        return response.data
    }).catch(e => {
        return e
    })
}