import SitAndGoGame from "../model/sitAndGo/SitAndGoGame";
import {firestore} from "firebase-admin";

export const addGame = async ( game: SitAndGoGame ): Promise<void> => {
    await firestore().collection( "SitAndGoGame" ).add( game );
};