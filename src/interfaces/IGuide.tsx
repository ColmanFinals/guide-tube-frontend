import {IVideo} from "./IVideo.tsx";

export interface IGuide {
    name: string;
    views: number;
    videos: IVideo[];
}