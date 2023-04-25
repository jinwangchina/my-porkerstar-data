import React, {useEffect} from 'react';
import {ctx} from "./context/Context";
import {BalanceLineChart, BalanceLineChartData, convertToBalanceLineChartData} from "./component/BalanceLineChart";
import "./App.css";
import {PageHeader} from "./component/PageHeader";
import {SitAndGoData} from "common/lib/model/SitAndGoModel";

const App = () => {
    const [state, setState] = React.useState( undefined as AppState | undefined );

    useEffect(() => {
        ctx.rpcMgr.call( "getAllSitAndGoGames", {} ).then( ( result: SitAndGoData ) => {
            const lastGame = result.games[ result.games.length - 1 ];
            setState( {
                totalGames: lastGame.totalStats.games,
                winGames: lastGame.totalStats.winGames,
                balanceLineChartData: convertToBalanceLineChartData( result ),
            });
        });
    }, [""] );

    return (
        <div className="mdp-App">
            <PageHeader
                title="Sit&Go Data"
                subTitle={state && `Total Games: ${state.totalGames.toLocaleString()} (about ${(state.totalGames * 30).toLocaleString()} hands), Win Rate: ${(state.winGames / state.totalGames * 100).toFixed(1)}%`}
            />
            <BalanceLineChart data={state?.balanceLineChartData} />
        </div>
    );
};

type AppState = {
    totalGames: number;
    winGames: number;
    balanceLineChartData: BalanceLineChartData;
};

export default App;
