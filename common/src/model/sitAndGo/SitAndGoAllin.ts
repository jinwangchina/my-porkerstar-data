import {AllinType, Result} from "../Base";

export default interface SitAndGoAllin {
    dateTime: Date;
    buyIn: number;
    type: AllinType;
    result: Result;
}