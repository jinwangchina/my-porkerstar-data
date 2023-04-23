import * as randomstring from "randomstring";

export const getRandomMessage = () => {
    return "Random Message: " + randomstring.generate();
};

export const addMinutes = ( date: Date, minutes: number ): Date => {
    const newTime = date.getTime() + ( minutes * 60 * 1000 );
    return new Date( newTime );
};
