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

    const customLegendFormatter = ( value: string ) => {
        if ( value === "bonus" ) {
            return <span>Bonus {props.data?.bonusDesc}</span>;
        }
        if ( value === "winBonus" ) {
            return <span>WinBonus</span>;
        }
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
                    { props.type === "Bonus" && <Line type="monotone" dataKey="winBonus" stroke="#82ca9d" activeDot={{ r: 8 }} /> }
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
    bonusDesc: string;
};

export type PhasedLineChartDataItem = {
    index: number;
    date: string;
    milestone: string;
    buyIn: number;
    balance: number;
    winRate: number;
    bonus: number;
    winBonus: number;
    result: string;
};

export const convertToPhasedLineChartData = ( gameData: SitAndGoData ): PhasedLineChartData => {
    const milestones: string[] = [];
    let currentBuyIn: number;
    const bonusTimesMap = new Map<number, number>();
    const winBonusTimesMap = new Map<number, number>();
    const items = gameData.games.map( ( item, index ) => {
        const buyIn = Number( ( item.data.buyIn / (1000 * 1000) ).toFixed( 3 ) );
        const dateStr = item.data.dateTime;
        let milestone = "";
        if ( currentBuyIn !== buyIn ) {
            currentBuyIn = buyIn;
            milestone = `${ctx.utilMgr.formatDate(dateStr)} (BuyIn $${currentBuyIn}M)`;
            milestones.push( milestone );
        }
        const bonus = item.data.toWin / item.data.buyIn;
        const bonusKey = bonus;
        const bonusTimes = bonusTimesMap.get( bonusKey ) || 0;
        bonusTimesMap.set( bonusKey, bonusTimes + 1 );
        const winBonus = item.data.result === "win" ? bonus : 0;
        if ( item.data.result === "win" ) {
            const winBonusTimes = winBonusTimesMap.get( bonusKey ) || 0;
            winBonusTimesMap.set( bonusKey, winBonusTimes + 1 );
        }
        return {
            index: index,
            date: ctx.utilMgr.formatDateTime( dateStr ),
            milestone,
            buyIn,
            balance: Number( ( item.totalStats.balance / (1000 * 1000) ).toFixed( 1 ) ),
            winRate: Number( ( item.totalStats.winGames / item.totalStats.games ).toFixed( 3 ) ),
            bonus,
            winBonus,
            result: item.data.result
        };
    } );

    return {
        items,
        milestones,
        bonusDesc: toBonusDesc( bonusTimesMap, winBonusTimesMap, items.length )
    };
};

const toBonusDesc = ( bonusTimesMap: Map<number, number>, winBonusTimesMap: Map<number, number>, total: number ): string => {
    let desc = "";
    const keys = Array.from( bonusTimesMap.keys() ).sort( (a, b) => a - b )
    for ( const key of keys ) {
        const bonusTimes = bonusTimesMap.get( key ) || 0;
        // const bonusRate = `${(Number((bonusTimes / total).toFixed(4)) * 100).toFixed(2)}%`;
        const winBonusTimes = winBonusTimesMap.get( key ) || 0;
        // const winBonusRate = `${(Number((winBonusTimes / total).toFixed(4)) * 100).toFixed(2)}%`;
        desc += ` (${key}x: ${bonusTimes} vs ${winBonusTimes})`;
    }
    return desc.slice( 1 );
};
