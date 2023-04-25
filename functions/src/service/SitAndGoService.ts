import {firestore} from "firebase-admin";
import {ctx} from "../context/Context";
import SitAndGoGame, {SitAndGoData, SitAndGoGameData, SitAndGoStats} from "common/lib/model/SitAndGoModel";
import {loadHistoryData, START_BALANCE_SITANDGO} from "../history/HistoryTool";
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

const COL_SITANDGOGAME = "SitAndGoGame";

export const initWithHistoryData = async (): Promise<void> => {
    await initWithHistoryDataImpl( getLastGame, addGameToDb );
};

const initWithHistoryDataImpl = async ( getLastGame: () => Promise<SitAndGoGame | undefined>, saveGame: (game: SitAndGoGame) => Promise<any> ): Promise<void> => {
    const historyData = loadHistoryData();
    for ( let i = 0; i < historyData.data.length; i++ ) {
        const record = historyData.data[i];
        for ( let j = 0; j < record.games.length; j++ ) {
            const game = record.games[j];
            const secondsToAdd = (i * 10) + j;
            await addGameImpl( {
                dateTime: ctx.utilMgr.addSeconds( new Date( record.dateTime ), secondsToAdd ).toString(),
                buyIn: record.buyIn,
                result: game.result,
                toWin: game.toWin
            } as SitAndGoGameData, getLastGame, saveGame );
        }
    }
};

export const addGame = async ( gameData: SitAndGoGameData ): Promise<void> => {
    await addGameImpl( gameData, getLastGame, addGameToDb );
};

const addGameImpl = async ( gameData: SitAndGoGameData, getLastGame: () => Promise<SitAndGoGame | undefined>, saveGame: (game: SitAndGoGame) => Promise<any> ): Promise<void> => {
    const lastGame = await getLastGame();
    const game = {
        createDateTime: new Date().getTime(),
        data: gameData,
        buyInStats: createStats( gameData, 0, lastGame?.data.buyIn === gameData.buyIn ? lastGame.buyInStats : undefined ),
        totalStats: createStats( gameData, START_BALANCE_SITANDGO, lastGame?.totalStats ),
    } as SitAndGoGame;
    await saveGame( game );
};

const addGameToDb = async ( game: SitAndGoGame ): Promise<void> => {
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

export const getAllGamesFromHistory = async (): Promise<SitAndGoData> => {
    const data: SitAndGoData = {
        games: []
    };
    let lastGame: SitAndGoGame | undefined;
    const getLastGame = async () => lastGame;
    const saveGame = async ( game: SitAndGoGame ) => {
        data.games.push( game );
        lastGame = game;
    };
    await initWithHistoryDataImpl( getLastGame, saveGame );
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
    const stats = lastStats ? { ...lastStats } : {
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

