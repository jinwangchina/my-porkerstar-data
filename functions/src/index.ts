import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {ctx} from "./context/Context";
import {SitAndGoGameData} from "common/lib/model/SitAndGoModel";

admin.initializeApp();

export const initSitAndGoGameData = functions.runWith({
    timeoutSeconds: 540,
}).https.onRequest(
    async (request, response) => {
        ctx.logMgr.info( "Initializing SitAndGo game data ..." );
        await ctx.service.sitAndGoService.initWithHistoryData();
        response.send( "OK" );
    }
);

export const addSitAndGoGame = functions.https.onRequest(
    async (request, response) => {
        ctx.logMgr.info( "Creating SitAndGo game ..." );
        const gameData = request.body as SitAndGoGameData;
        await ctx.service.sitAndGoService.addGame( gameData );
        response.send( "OK" );
    }
);

export const getAllSitAndGoGames = functions.https.onRequest(
    async (request, response) => {
        ctx.logMgr.info( "Getting all SitAndGo games ..." );
        // const games = await ctx.service.sitAndGoService.getAllGames();
        const games = await ctx.service.sitAndGoService.getAllGamesFromHistory();
        response.send( games );
    }
);


