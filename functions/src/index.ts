import * as functions from "firebase-functions";
import {ctx} from "./context/Context";

export const addGame = functions.https.onRequest(async (request, response) => {
  ctx.logMgr.info( "Adding game: ", request.body );
  await ctx.service.sitAndGoService.addGame( request.body as any );
  response.send("OK");
});
