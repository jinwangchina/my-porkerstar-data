import {AllinType, BaseModel, Result} from "../Base";

export default interface SitAndGoAllin extends BaseModel {
    dateTime: Date;
    buyIn: number;
    type: AllinType;
    result: Result;
}