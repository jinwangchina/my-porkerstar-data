import React, {useEffect} from 'react';
import {ctx} from "./context/Context";
import {convertToPhasedLineChartData, PhasedLineChart, PhasedLineChartData} from "./component/PhasedLineChart";
import "./App.css";
import {PageHeader} from "./component/PageHeader";
import SitAndGoGame, {SitAndGoData} from "common/lib/model/SitAndGoModel";

const App = () => {
    const [state, setState] = React.useState( undefined as AppState | undefined );

    useEffect(() => {
        ctx.rpcMgr.call( "getAllSitAndGoGames", {} ).then( ( result: SitAndGoData ) => {
            const lastGame = result.games[ result.games.length - 1 ];
            setState( {
                data: result,
                totalGames: lastGame.totalStats.games,
                winGames: lastGame.totalStats.winGames,
                lastGame,
                phasedLineChartData: convertToPhasedLineChartData( result ),
            });
        });
    }, [""] );

    return (
        <div className="mdp-App">
            <PageHeader
                title="Sit&Go Data"
                subTitle={state && `
                Total Games: ${state.totalGames.toLocaleString()} (~ ${(state.totalGames * 30).toLocaleString()} hands), 
                Win Rate: ${(state.winGames / state.totalGames * 100).toFixed(1)}%, 
                Win Bonus: ${(state.lastGame.totalStats.balance - state.data.games[0].totalStats.balance + 10000).toLocaleString()}
                `}
            />
            <PhasedLineChart type={"Balance"} data={state?.phasedLineChartData} />
            <PhasedLineChart type={"WinRate"} data={state?.phasedLineChartData} />
            <PhasedLineChart type={"Bonus"} data={state?.phasedLineChartData} />
        </div>
    );
};

type AppState = {
    data: SitAndGoData,
    totalGames: number;
    winGames: number;
    lastGame: SitAndGoGame,
    phasedLineChartData: PhasedLineChartData;
};

export default App;
