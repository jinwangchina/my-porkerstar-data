import {firestore} from "firebase-admin";
import SitAndGoGame from "common/lib/model/sitAndGo/SitAndGoGame";
import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import Timestamp = firestore.Timestamp;

export const createGame = async ( game: SitAndGoGame ): Promise<void> => {
    await getCollection().add( game );
};

export const getLastGame = async (): Promise<SitAndGoGame> => {
    const query = await getCollection()
        .orderBy("createDateTime", "desc")
        .limit(1)
        .get();
    return fromDocument( query.docs[0] );
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
