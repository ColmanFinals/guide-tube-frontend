export interface INewVideoRequest {
    index: number;
    id: string;
    playlistItemId: string;
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
}