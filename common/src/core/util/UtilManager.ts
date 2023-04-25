import * as randomstring from "randomstring";

export const getRandomMessage = () => {
    return "Random Message: " + randomstring.generate();
};

export const getRandomNumber = ( digits: number = 2 ): number => {
    return Math.floor( Math.random() * ( 10 ** 2 ) );
};

export const addSeconds = ( date: Date, seconds: number ): Date => {
    const newTime = date.getTime() + ( seconds * 1000 );
    return new Date( newTime );
};

export const formatDateTime = ( dateStr: string ): string => {
    const date = new Date( dateStr );
    return date.toLocaleDateString( "en-AU" ) + " " + date.toLocaleTimeString( "en-AU" );
}

export const formatDate = ( dateStr: string ): string => {
    const date = new Date( dateStr );
    return date.toLocaleDateString( "en-AU" );
}
