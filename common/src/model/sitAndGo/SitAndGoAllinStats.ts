import {AllinType, BaseModel} from "../Base";

export interface SitAndGoAllinStatsData {
    type: AllinType;
    allins: number;
    winAllins: number;
    winRate: number;
}

export default interface SitAndGoAllinStats extends BaseModel {
    dateTime: Date;
    buyIn: number;
    buyInMpData: SitAndGoAllinStatsData;
    buyInOpData: SitAndGoAllinStatsData;
    totalMpData: SitAndGoAllinStatsData;
    totalOpData: SitAndGoAllinStatsData;
}