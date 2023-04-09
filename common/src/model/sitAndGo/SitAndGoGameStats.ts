import {BaseModel} from "../Base";

export interface SitAndGoGameStatsData {
    games: number;
    winGames: number;
    winRate: number;
}

export default interface SitAndGoGameStats extends BaseModel {
    dateTime: Date;
    buyIn: number;
    buyInData: SitAndGoGameStatsData;
    totalData: SitAndGoGameStatsData;
}