import * as randomstring from "randomstring";

export const getMessage = () => {
    return "from common8: " + randomstring.generate();
};