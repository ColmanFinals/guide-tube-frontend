import { IPlaylist } from "./IPlaylist";
import {INewVideoRequest} from "./INewVideoRequest";

export interface IGuideData {
    createdAt: string;
    name: string;
    views: number;
    privacyStatus: string;
}

export interface INewGuideRequest {
    companyName: string;
    guideData: IGuideData;
    playlistData: IPlaylist;
    videoData: INewVideoRequest[];
}