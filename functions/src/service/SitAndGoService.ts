import {firestore} from "firebase-admin";
import SitAndGoGame from "common/lib/model/sitAndGo/SitAndGoGame";
import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import Timestamp = firestore.Timestamp;
import SitAndGoGameStats from "common/lib/model/sitAndGo/SitAndGoGameStats";

export const createGame = async ( game: SitAndGoGame ): Promise<void> => {
    await getCollection().add( game );
    const lastGameStats = await getLastGameStats( game.buyIn );
    const gameStats = fromStats( game, lastGameStats );
    await getStatsCollection().add( gameStats );
};

export const getLastGame = async (): Promise<SitAndGoGame> => {
    const query = await getCollection()
        .orderBy("createDateTime", "desc")
        .limit(1)
        .get();
    return fromDocument( query.docs[0] );
};

export const getLastGameStats = async ( buyIn: number ): Promise<SitAndGoGameStats | undefined> => {
    const query = await getStatsCollection()
        .where( "buyIn", "==", buyIn )
        .orderBy("createDateTime", "desc")
        .limit(1)
        .get();
    return fromStatsDocument( query.docs[0] );
};

const fromStatsDocument = ( doc: QueryDocumentSnapshot ): SitAndGoGameStats | undefined => {
    if ( !doc ) {
        return;
    }
    const docData = doc.data();
    return {
        ...docData,
        id: doc.id,
        dateTime: ( docData.dateTime as Timestamp ).toDate(),
        createDateTime: ( docData.createDateTime as Timestamp ).toDate()
    } as SitAndGoGameStats;
};

const fromStats = ( game: SitAndGoGame, stats?: SitAndGoGameStats ): SitAndGoGameStats => {
    if ( !stats ) {
        return {
            createDateTime: new Date(),
            dateTime: game.dateTime,
            buyIn: game.buyIn,
            buyInData: {
                games: 1,
                winGames: game.result === "win" ? 1 : 0,
                winRate: game.result === "win" ? 1 : 0
            },
            totalData: {
                games: 1,
                winGames: game.result === "win" ? 1 : 0,
                winRate: game.result === "win" ? 1 : 0
            }
        };
    }
    return {
        createDateTime: new Date(),
        dateTime: game.dateTime,
        buyIn: game.buyIn,
        buyInData: {
            games: stats.buyInData.games + 1,
            winGames: game.result === "win" ? stats.buyInData.winGames + 1 : stats.buyInData.winGames,
            winRate: stats.buyInData.winGames / stats.buyInData.games
        },
        totalData: {
            games: stats.totalData.games + 1,
            winGames: stats.totalData.winGames / stats.totalData.games,
            winRate: stats.totalData.winGames / stats.totalData.games
        }
    };
};

export const fromDocument = ( doc: QueryDocumentSnapshot ): SitAndGoGame => {
    const docData = doc.data();
    return {
        ...docData,
        id: doc.id,
        dateTime: ( docData.dateTime as Timestamp ).toDate(),
        createDateTime: ( docData.createDateTime as Timestamp ).toDate()
    } as SitAndGoGame;
};

export const fromRequestBody = ( requestBody: any ): SitAndGoGame => {
    const game = requestBody as SitAndGoGame;
    if ( typeof game.dateTime === "string" ) {
        game.dateTime = new Date( game.dateTime );
    }
    game.createDateTime = new Date();
    return game;
};

const getCollection = (): CollectionReference<DocumentData> => {
    return firestore().collection( "SitAndGoGame" );
};

const getStatsCollection = (): CollectionReference<DocumentData> => {
    return firestore().collection( "SitAndGoGameStats" );
};
