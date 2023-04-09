import {BaseModel, Result} from "../Base";

export default interface SitAndGoGame extends BaseModel {
    dateTime: Date;
    buyIn: number;
    toWin: number;
    result: Result;
    balance: number;
}