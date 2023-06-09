import DbModel from "../core/db/DbModel";
import {Result} from "./BaseModel";

export default interface SitAndGoGame extends DbModel {
    data: SitAndGoGameData;
    buyInStats: SitAndGoStats;
    totalStats: SitAndGoStats;
}

export interface SitAndGoGameData {
    dateTime: string;
    buyIn: number;
    toWin: number;
    result: Result;
}

export interface SitAndGoStats {
    games: number;
    winGames: number;
    balance: number;
}

export interface SitAndGoData {
    games: SitAndGoGame[];
}
