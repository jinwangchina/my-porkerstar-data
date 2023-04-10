import {firestore} from "firebase-admin";
import {ctx} from "../context/Context";
import SitAndGoGame, {SitAndGoGameData, SitAndGoStats} from "common/lib/model/SitAndGoModel";
import {Request} from "firebase-functions";
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import Timestamp = firestore.Timestamp;

const START_BALANCE = 5400000;
const COL_SITANDGOGAME = "SitAndGoGame";

export const addGame = async ( gameData: SitAndGoGameData ): Promise<void> => {
    const lastGame = await getLastGame();
    const game = {
        createDateTime: new Date(),
        data: gameData,
        buyInStats: createStats( gameData, 0, lastGame?.buyInStats ),
        totalStats: createStats( gameData, START_BALANCE, lastGame?.totalStats ),
    } as SitAndGoGame;
    await ctx.dbMgr.getCollection( COL_SITANDGOGAME ).add( game );
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
        id: doc.id,
        createDateTime: ( docData.createDateTime as Timestamp ).toDate()
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

export const validateSitAndGoGameData = ( req: Request ): SitAndGoGameData => {
    const data = req.body as SitAndGoGameData;
    if ( typeof data.dateTime === "string" ) {
        data.dateTime = new Date( data.dateTime );
    }
    return data;
};
