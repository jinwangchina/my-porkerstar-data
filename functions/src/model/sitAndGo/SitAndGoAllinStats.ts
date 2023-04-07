import {AllinType} from "../Base";

export interface SitAndGoAllinStatsData {
    type: AllinType;
    allins: number;
    winAllins: number;
    winRate: number;
}

export default interface SitAndGoAllinStats {
    id: string;
    dateTime: Date;
    buyIn: number;
    buyInMpData: SitAndGoAllinStatsData;
    buyInOpData: SitAndGoAllinStatsData;
    totalMpData: SitAndGoAllinStatsData;
    totalOpData: SitAndGoAllinStatsData;
}