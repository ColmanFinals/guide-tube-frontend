import {ICreator} from "./ICreator.tsx";

export interface ICompany {
    _id: string;
    name: string;
    creator: ICreator;
}