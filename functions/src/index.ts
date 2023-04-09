import * as functions from "firebase-functions";
import {ctx} from "./context/Context";
import SitAndGoGame from "../../common/src/model/sitAndGo/SitAndGoGame";

export const addGame = functions.https.onRequest(async (request, response) => {
  ctx.logMgr.info( "Adding game: ", request.body );
  await ctx.service.sitAndGoService.addGame( request.body as SitAndGoGame );
  response.send("OK");
});
