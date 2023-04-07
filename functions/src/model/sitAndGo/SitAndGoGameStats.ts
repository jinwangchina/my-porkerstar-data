export interface SitAndGoGameStatsData {
    games: number;
    winGames: number;
    winRate: number;
}

export default interface SitAndGoGameStats {
    id: string;
    dateTime: Date;
    buyIn: number;
    buyInData: SitAndGoGameStatsData;
    totalData: SitAndGoGameStatsData;
}