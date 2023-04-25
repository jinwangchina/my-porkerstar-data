import {Spinner} from "./Spinner";
import React from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {SitAndGoData} from "common/lib/model/SitAndGoModel";
import "./PhasedLineChart.css";
import {ctx} from "../context/Context";

export const PhasedLineChart = ( props: PhasedLineChartProps ) => {

    const customRenderXAxisTick = ( tickProps: any ) => {
        if ( tickProps.index == 0 ) {
            return <text x={tickProps.x + 100} y={tickProps.y + 35} fill="#666" textAnchor="middle">12/12/2021 (BuyIn $0.01M and $0.025M)</text>;
        } else if ( tickProps.index == 1 ) {
            return <></>;
        }
        return <text x={tickProps.x} y={tickProps.y + 15} fill="#666" textAnchor="middle">{tickProps.payload.value}</text>;
    };

    const customYAxisTickFormatter = ( value: any ) => {
        switch ( props.type ) {
            case "Balance": return `$${value}M`;
            case "WinRate": return `${value * 100}%`;
            case "Bonus": return `${value}x`;
            default: return value;
        }
    };

    const customRenderTooltip = ( tooltipProps: any ) => {
        const active = tooltipProps.active;
        if ( !active || tooltipProps.payload.length == 0 ) {
            return <></>;
        }
        const item = tooltipProps.payload[0].payload as PhasedLineChartDataItem;
        return (
            <div className="mdp-ChartTooltip">
                <p className="mdp-ChartTooltipItem">{`Date : ${item.date}`}</p>
                <p className="mdp-ChartTooltipItem">{`Balance : $${item.balance}M`}</p>
                <p className="mdp-ChartTooltipItem">{`WinRate : ${item.winRate * 100}%`}</p>
                <p className="mdp-ChartTooltipItem">{`Bonus : ${item.bonus}x`}</p>
                <p className="mdp-ChartTooltipItem">{`Result : ${item.result}`}</p>
            </div>
        );
    };

    const customLegendFormatter = () => {
        return <span>{props.type} started from 12/12/2021</span>;
    };

    if ( !props.data ) {
        return <Spinner />;
    }

    const dataKey = props.type.charAt(0).toLowerCase() + props.type.slice(1);
    return (
        <div className="mpd-PhasedLineChart">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart width={500} height={300} data={props.data.items}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="milestone" interval={0} ticks={props.data.milestones} tick={customRenderXAxisTick} />
                    <YAxis tickFormatter={customYAxisTickFormatter} />
                    <Tooltip content={customRenderTooltip} />
                    <Legend formatter={customLegendFormatter} />
                    <Line type="monotone" dataKey={dataKey} stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export type PhasedLineChartProps = {
    type: "Balance" | "WinRate" | "Bonus";
    data?: PhasedLineChartData;
};

export type PhasedLineChartData = {
    items: PhasedLineChartDataItem[];
    milestones: string[];
};

export type PhasedLineChartDataItem = {
    index: number;
    date: string;
    milestone: string;
    buyIn: number;
    balance: number;
    winRate: number;
    bonus: number;
    result: string;
};

export const convertToPhasedLineChartData = ( gameData: SitAndGoData ): PhasedLineChartData => {
    const milestones: string[] = [];
    let currentBuyIn: number;
    const items = gameData.games.map( ( item, index ) => {
        const buyIn = Number( ( item.data.buyIn / (1000 * 1000) ).toFixed( 3 ) );
        const dateStr = item.data.dateTime;
        let milestone = "";
        if ( currentBuyIn !== buyIn ) {
            currentBuyIn = buyIn;
            milestone = `${ctx.utilMgr.formatDate(dateStr)} (BuyIn $${currentBuyIn}M)`;
            milestones.push( milestone );
        }
        return {
            index: index,
            date: ctx.utilMgr.formatDateTime( dateStr ),
            milestone,
            buyIn,
            balance: Number( ( item.totalStats.balance / (1000 * 1000) ).toFixed( 1 ) ),
            winRate: Number( ( item.totalStats.winGames / item.totalStats.games ).toFixed( 3 ) ),
            bonus: item.data.toWin / item.data.buyIn,
            result: item.data.result
        };
    } );

    return {
        items,
        milestones
    };
};
