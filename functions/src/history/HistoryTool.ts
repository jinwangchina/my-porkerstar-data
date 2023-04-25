import {Result} from "common/lib/model/BaseModel";
import {SitAndGoRawData} from "./HistorySitAndGoRawData";

export interface HistoryData {
    startBalance: number;
    data: Array<HistoryRecord>;
}

export interface HistoryRecord {
    dateTime: string;
    buyIn: number;
    games: Array<HistoryGame>;
    mpop: MPOP;
}

export interface HistoryGame {
    result: Result;
    toWin: number;
}

export interface MPOP {
    mp: MPOPData;
    op: MPOPData;
}

export interface MPOPData {
    mw: number;
    ow: number;
}

export const START_BALANCE_SITANDGO = 5400000;

export const loadHistoryData = (): HistoryData => {
    const rawData = SitAndGoRawData;
    const lines = getLines( rawData );
    const records = lines.map( line => getHistoryRecord( line ) );
    return {
        startBalance: START_BALANCE_SITANDGO,
        data: records
    };
};

const getLines = ( rawData: string ): Array<string> => {
    const lines = [];
    const rawLines = rawData.split( "\n" );
    for ( let i = 0; i < rawLines.length; i++ ) {
        const rawLine = rawLines[i].trim();
        if ( rawLine.startsWith("2021") || rawLine.startsWith("2022") || rawLine.startsWith("2023") ) {
            lines.push( rawLine );
        }
    }
    return lines;
};

const getHistoryRecord = ( line: string ): HistoryRecord => {
    const tokens = line.split( " " );

    const dateTimeStr = tokens[0];
    const dateTime = dateTimeStr;

    const buyInStr = tokens[1];
    const buyIn = Number( buyInStr.replace( new RegExp(",", "g"), "" ) );

    const gamesStr = line.substring( line.indexOf("("), line.lastIndexOf(")") + 1 ).trim();
    const games = getHistoryGames( gamesStr, buyIn );

    const mpopStr = line.substring( line.indexOf("["), line.lastIndexOf("]") + 1 ).trim();
    const mpop = getHistoryMPVP( mpopStr );

    return {
        dateTime,
        buyIn,
        games,
        mpop
    };
}

const getHistoryGames = ( gamesStr: string, buyIn: number ): Array<HistoryGame> => {
    const tokens = gamesStr.split( " " );
    return tokens.map( gameStr => getHistoryGame(gameStr, buyIn) );
}

const getHistoryGame = ( gameStr: string, buyIn: number ): HistoryGame => {
    const result = gameStr.includes( "+" ) ? "win" : "lose";
    const toWinStr = gameStr.substring( gameStr.lastIndexOf( "(" ) + 1, gameStr.indexOf( ")" ) ).trim();
    const toWinRaw = Number( toWinStr );
    let toWin;
    if ( buyIn === 10000 ) {
        toWin = toWinRaw * 10000;
    } else if ( buyIn === 25000 ) {
        toWin = toWinRaw * 10000;
    } else if ( buyIn === 100000 ) {
        toWin = toWinRaw * 10000;
    } else if ( buyIn === 500000 ) {
        toWin = toWinRaw * 100000;
    } else if ( buyIn === 2500000 ) {
        toWin = toWinRaw * 100000;
    } else {
        throw `Found no toWin for ${toWinStr}`;
    }
    return {
        result,
        toWin
    };
}

const getHistoryMPVP = ( mpopStr: string ): MPOP => {
    if ( !mpopStr ) {
        return {
            mp: {mw: 0, ow: 0},
            op: {mw: 0, ow: 0}
        };
    }
    const mpStr = mpopStr.substring( mpopStr.indexOf( "[" ) + 1, mpopStr.indexOf( "]" ) );
    const mp = getHistoryMPOPData( mpStr );
    mpopStr = mpopStr.substring( mpopStr.indexOf( "]" ) + 1 ).trim();
    const opStr = mpopStr.substring( mpopStr.indexOf( "[" ) + 1, mpopStr.indexOf( "]" ) );
    const op = getHistoryMPOPData( opStr );
    return {
        mp,
        op
    };
}

const getHistoryMPOPData = ( mpvpDataStr: string ): MPOPData => {
    const tokens = mpvpDataStr.split( " " );
    let mw = 0;
    let ow = 0;
    tokens.forEach( token => {
        if ( token.includes("MW-") ) {
            mw = Number( token.substring( token.indexOf( "-" ) + 1 ).trim() );
        } else if ( token.includes("OW-") ) {
            ow = Number( token.substring( token.indexOf( "-" ) + 1 ).trim() );
        }
    } );
    return {
        mw,
        ow
    };
}