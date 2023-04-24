import {Spinner} from "./Spinner";
import React from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {SitAndGoData} from "common/lib/model/SitAndGoModel";
import "./BalanceLineChart.css";

export const BalanceLineChart = ( props: BalanceLineChartProps ) => {

    const customRenderXAxisTick = ( tickProps: any ) => {
        if ( tickProps.index == 0 ) {
            return <text x={tickProps.x + 100} y={tickProps.y + 35} fill="#666" textAnchor="middle">2021.12.12 (BuyIn $0.01M and $0.025M)</text>;
        } else if ( tickProps.index == 1 ) {
            return <></>;
        }
        return <text x={tickProps.x} y={tickProps.y + 15} fill="#666" textAnchor="middle">{tickProps.payload.value}</text>;
    };

    const customYAxisTickFormatter = ( value: any ) => {
        return `$${value}M`;
    };

    const customRenderTooltip = ( tooltipProps: any ) => {
        const active = tooltipProps.active;
        if ( !active ) {
            return <></>;
        }
        const item = tooltipProps.payload[0].payload as BalanceLineChartDataItem;
        return (
            <div className="mdp-ChartTooltip">
                <p className="mdp-ChartTooltipItem">{`Date : ${item.date}`}</p>
                <p className="mdp-ChartTooltipItem">{`Balance : $${item.balance}M`}</p>
            </div>
        );
    };

    const customLegendFormatter = ( value: any ) => {
        return <span>Balance started from 2021.12.12 (Million)</span>;
    };

    if ( !props.data ) {
        return <Spinner />;
    }
    return (
        <div className="mpd-BalanceLineChart">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart width={500} height={300} data={props.data.items}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="milestone" interval={0} ticks={props.data.milestones} tick={customRenderXAxisTick} />
                    <YAxis tickFormatter={customYAxisTickFormatter} />
                    <Tooltip content={customRenderTooltip} />
                    <Legend formatter={customLegendFormatter} />
                    <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export type BalanceLineChartProps = {
    data?: BalanceLineChartData;
};

export type BalanceLineChartData = {
    items: BalanceLineChartDataItem[];
    milestones: string[];
};

export type BalanceLineChartDataItem = {
    index: number;
    date: string;
    milestone: string;
    buyIn: number;
    balance: number;
};

export const convertToBalanceLineChartData = ( gameData: SitAndGoData ): BalanceLineChartData => {
    const milestones: string[] = [];
    let currentBuyIn: number;
    const items = gameData.games.map( ( item, index ) => {
        const buyIn = Number( ( item.data.buyIn / (1000 * 1000) ).toFixed( 3 ) );
        let milestone = "";
        if ( currentBuyIn !== buyIn ) {
            currentBuyIn = buyIn;
            const date = new Date( item.data.dateTime );
            const dateYear = date.getFullYear();
            const dateMonth = date.getMonth() + 1;
            const dateDay = date.getDate();
            milestone = `${dateYear}.${dateMonth}.${dateDay} (BuyIn $${currentBuyIn}M)`;
            milestones.push( milestone );
        }
        return {
            index: index,
            date: item.data.dateTime,
            milestone,
            buyIn,
            balance: Number( ( item.totalStats.balance / (1000 * 1000) ).toFixed( 1 ) )
        };
    } );

    return {
        items,
        milestones
    };
};
