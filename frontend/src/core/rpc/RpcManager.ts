import {connectFunctionsEmulator, getFunctions, httpsCallable} from "firebase/functions";
import {getApp} from "firebase/app";

export const call = async ( functionName: string, data?: any ): Promise<any> => {
    // TODO use sdkCall for production
    return devCall( functionName, data );
};

const sdkCall = async ( functionName: string, data?: any ): Promise<any> => {
    const functions = getFunctions( getApp() );
    const result = await httpsCallable( functions, functionName )();
    return result.data as any;
}

const devCall = async ( functionName: string, data?: any ): Promise<any> => {
    const url = `/devApi/${functionName}`;
    const response = await fetch( url, {
        method: "POST"
    } );
    return await response.json();
}


