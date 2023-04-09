import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {ctx} from "./context/Context";
import {getMessage} from "common/lib/util/Util";

admin.initializeApp();

export const addGame = functions.https.onRequest(async (request, response) => {
  ctx.logMgr.info( "Adding game: ", request.body );
  await ctx.service.sitAndGoService.addGame( request.body as any );
  response.send("OK4: " + getMessage());
});
