import {Result} from "../Base";

export default interface SitAndGoGame {
    id: string;
    dateTime: Date;
    buyIn: number;
    toWin: number;
    result: Result;
    balance: number;
}