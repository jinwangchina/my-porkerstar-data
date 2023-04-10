import React, {useEffect} from 'react';
import { getApp } from "firebase/app";
import {getFunctions, httpsCallable, connectFunctionsEmulator} from 'firebase/functions';

const App = () => {
    // useEffect(() => {
    //     const functions = getFunctions( getApp() );
    //     connectFunctionsEmulator(functions, "localhost", 5001);
    //     const getAllSitAndGoGames = httpsCallable( functions, "getAllSitAndGoGames" );
    //     const games = getAllSitAndGoGames().then( ( result ) => {
    //         console.log( result );
    //     } );
    // }, [] );
    return (
        <div className="App">
            NEW APP
        </div>
    );
};

export default App;
