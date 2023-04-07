import * as functions from "firebase-functions";

export const info = ( message: string, obj?: any ) => {
    functions.logger.info( message, obj );
};