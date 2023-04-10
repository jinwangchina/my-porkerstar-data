import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {ctx} from "./context/Context";

admin.initializeApp();

export const addGame = functions.https.onRequest(
    async (request, response) => {
        ctx.logMgr.info( "Creating game ..." );
        const gameData = ctx.service.sitAndGoService.validateSitAndGoGameData( request );
        await ctx.service.sitAndGoService.addGame( gameData );
        response.send( "OK" );
    }
);
