import * as randomstring from "randomstring";

export const getMessage = () => {
    return "from common: " + randomstring.generate();
};