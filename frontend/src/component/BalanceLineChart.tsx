import {Spinner} from "./Spinner";
import React from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {SitAndGoData} from "common/lib/model/SitAndGoModel";
import "./BalanceLineChart.css";

export const BalanceLineChart = ( props: BalanceLineChartProps ) => {

    const getCustomXAxisTickFormatter = () => {
        let previousYear = 0;
        let previousMonth = 0;
        return ( value: any ) => {
            const date = new Date( value );
            const dateYear = date.getFullYear();
            const dateMonth = date.getMonth() + 1;
            if ( previousYear !== dateYear || previousMonth !== dateMonth ) {
                previousYear = dateYear;
                previousMonth = dateMonth;
                return `${dateYear}.${dateMonth}`;
            }
            return "               ";
        };
    };

    const customYAxisTickFormatter = ( value: any ) => {
        return `${value}M`;
    };

    const customTooltipFormatter = ( value: any, name: any, props: any ): [string, string] => {
        return [`${value}M`, "Balance"];
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
                    <XAxis dataKey="date" tickFormatter={getCustomXAxisTickFormatter()} />
                    <YAxis tickFormatter={customYAxisTickFormatter} />
                    <Tooltip formatter={customTooltipFormatter} />
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
};

export type BalanceLineChartDataItem = {
    index: number;
    date: string;
    balance: number;
};

export const convertToBalanceLineChartData = ( gameData: SitAndGoData ): BalanceLineChartData => {
    return {
        items: gameData.games.map( ( item, index ) => ( {
            index: index,
            date: item.data.dateTime,
            balance: Number( ( item.totalStats.balance / (1000 * 1000) ).toFixed( 1 ) )
        } ) )
    };
};
