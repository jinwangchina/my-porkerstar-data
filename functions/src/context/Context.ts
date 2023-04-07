import * as logMgr from "../core/log/LogManager";
import * as sitAndGoService from "../service/SitAndGoService";

export const ctx = {
    logMgr,
    service: {
        sitAndGoService
    }
};