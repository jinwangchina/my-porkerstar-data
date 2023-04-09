export interface SitAndGoGameStatsData {
    games: number;
    winGames: number;
    winRate: number;
}

export default interface SitAndGoGameStats {
    dateTime: Date;
    buyIn: number;
    buyInData: SitAndGoGameStatsData;
    totalData: SitAndGoGameStatsData;
}