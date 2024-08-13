export interface IGuide {
    createdAt: string;
    name: string;
    views: number;
    privacyStatus: string;
}

export interface IVideo {
    index: number;
    id: string;
    playlistItemId: string;
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
}


export interface IPlaylist {
    id: string;  
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
}

export interface INewGuideRequest {
        companyName: string;
        guideData: IGuide;
        playlistData: IPlaylist;
        videoData: IVideo[];
}

export interface IUser {
    _id: string;
    username: string;
    fullName: string;
    imgUrl: string;
    role: string;
}

export interface ICompany {
    _id: string;
    name: string;
}