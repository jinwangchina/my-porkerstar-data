import * as logMgr from "../core/log/LogManager";
import * as dbMgr from "../core/db/DbManager";
import * as utilMgr from "common/lib/core/util/UtilManager";
import * as sitAndGoService from "../service/SitAndGoService";

export const ctx = {
    logMgr,
    dbMgr,
    utilMgr,
    service: {
        sitAndGoService
    }
};