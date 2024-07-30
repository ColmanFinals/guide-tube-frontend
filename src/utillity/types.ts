interface IGuide {
    createdAt: Date;
    name: string;
    views: number;
    playlist: IPlaylist;
    videos: IVideo[];
}

interface IVideo {
    index: number;
    id: string;
    playlistItemId: string;
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
}

interface IPlaylistStatus extends Document {
    privacyStatus: string;
}

interface IPlaylist extends Document {  
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    status: IPlaylistStatus;
}