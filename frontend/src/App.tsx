import React, {useEffect} from 'react';
import {ctx} from "./context/Context";

const App = () => {
    useEffect(() => {
        ctx.rpcMgr.call( "getAllSitAndGoGames", {} ).then( ( result ) => {
            console.log( result );
        });
    }, [] );
    return (
        <div className="App">
            NEW APP
        </div>
    );
};

export default App;
