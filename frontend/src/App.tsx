import React, {useEffect} from 'react';
import {ctx} from "./context/Context";
import {BalanceLineChart, BalanceLineChartData, convertToBalanceLineChartData} from "./component/BalanceLineChart";
import "./App.css";

const App = () => {
    const [state, setState] = React.useState( {} as AppState );

    useEffect(() => {
        ctx.rpcMgr.call( "getAllSitAndGoGames", {} ).then( ( result ) => {
            setState( {
                balanceLineChartData: convertToBalanceLineChartData( result )
            });
        });
    }, [""] );

    return (
        <div className="mdp-App">
            <BalanceLineChart data={state.balanceLineChartData} />
        </div>
    );
};

type AppState = {
    balanceLineChartData: BalanceLineChartData;
};

export default App;
