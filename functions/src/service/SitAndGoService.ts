import {firestore} from "firebase-admin";
import SitAndGoGame from "../../../common/src/model/sitAndGo/SitAndGoGame";

export const addGame = async ( game: SitAndGoGame ): Promise<void> => {
    await firestore().collection( "SitAndGoGame" ).add( game );
};