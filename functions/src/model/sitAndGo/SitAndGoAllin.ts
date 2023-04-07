import {AllinType, Result} from "../Base";

export default interface SitAndGoAllin {
    id: string;
    dateTime: Date;
    buyIn: number;
    type: AllinType;
    result: Result;
}