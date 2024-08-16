import {IVideo} from "./IVideo.tsx";

export interface IGuide {
    _id: string;
    name: string;
    views: number;
    createdAt: string;
    videos: IVideo[];
}