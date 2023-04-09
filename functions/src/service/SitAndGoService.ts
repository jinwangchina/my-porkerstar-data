import {firestore} from "firebase-admin";

export const addGame = async ( game: any ): Promise<void> => {
    await firestore().collection( "SitAndGoGame" ).add( game );
};