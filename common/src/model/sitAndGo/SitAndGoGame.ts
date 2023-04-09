import {Result} from "../Base";

export default interface SitAndGoGame {
    dateTime: Date;
    buyIn: number;
    toWin: number;
    result: Result;
    balance: number;
}