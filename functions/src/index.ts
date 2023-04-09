import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {ctx} from "./context/Context";

admin.initializeApp();

export const createGame = functions.https.onRequest(
    async (request, response) => {
        ctx.logMgr.info( "Creating game ..." );
        const game = ctx.service.sitAndGoService.fromRequestBody( request.body );
        await ctx.service.sitAndGoService.createGame( game );
        response.send( "OK" );
    }
);

export const getLastGame = functions.https.onRequest(
    async (request, response) => {
        ctx.logMgr.info( "Getting last game ..." );
        const lastGame = await ctx.service.sitAndGoService.getLastGame();
        response.send( lastGame );
    }
);
