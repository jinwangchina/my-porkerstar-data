import {firestore} from "firebase-admin";
import {ctx} from "../context/Context";
import SitAndGoGame, {SitAndGoData, SitAndGoGameData, SitAndGoStats} from "common/lib/model/SitAndGoModel";
import {loadHistoryData, START_BALANCE_SITANDGO} from "../history/HistoryTool";
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

const COL_SITANDGOGAME = "SitAndGoGame";

export const initWithHistoryData = async (): Promise<void> => {
    const historyData = loadHistoryData();
    for ( const record of historyData.data ) {
        for ( let i = 0; i < record.games.length; i++ ) {
            const game = record.games[i];
            await addGame( {
                dateTime: ctx.utilMgr.addMinutes( new Date( record.dateTime ), i ).toString(),
                buyIn: record.buyIn,
                result: game.result,
                toWin: game.toWin
            } as SitAndGoGameData );
        }
    }
};

export const addGame = async ( gameData: SitAndGoGameData ): Promise<void> => {
    const lastGame = await getLastGame();
    const game = {
        createDateTime: new Date().toString(),
        data: gameData,
        buyInStats: createStats( gameData, 0, lastGame?.data.buyIn === gameData.buyIn ? lastGame.buyInStats : undefined ),
        totalStats: createStats( gameData, START_BALANCE_SITANDGO, lastGame?.totalStats ),
    } as SitAndGoGame;
    await ctx.dbMgr.getCollection( COL_SITANDGOGAME ).add( game );
};

export const getAllGames = async (): Promise<SitAndGoData> => {
    const docs = await ctx.dbMgr.getDocuments( COL_SITANDGOGAME );
    const data = {
        games: []
    } as SitAndGoData;
    if ( docs && docs.length > 0 ) {
        data.games = docs.map( doc => convertDocToSitAndGoGame( doc ) );
    }
    return data;
};

export const getLastGame = async (): Promise<SitAndGoGame | undefined> => {
    const doc = await ctx.dbMgr.getLastDocument( COL_SITANDGOGAME );
    if ( !doc ) {
        return;
    }
    return convertDocToSitAndGoGame( doc );
};

export const convertDocToSitAndGoGame = ( doc: QueryDocumentSnapshot ): SitAndGoGame => {
    const docData = doc.data();
    return {
        ...docData,
        id: doc.id
    } as SitAndGoGame;
};

const createStats = ( gameData: SitAndGoGameData, startBalance: number, lastStats?: SitAndGoStats ): SitAndGoStats => {
    const stats = lastStats || {
        games: 0,
        winGames: 0,
        balance: startBalance
    } as SitAndGoStats;
    stats.games++;
    stats.balance = stats.balance - gameData.buyIn;
    if ( isWin(gameData) ) {
        stats.winGames++;
        stats.balance += gameData.toWin;
    }
    return stats;
};

const isWin = ( gameData: SitAndGoGameData ): boolean => gameData.result === "win";

