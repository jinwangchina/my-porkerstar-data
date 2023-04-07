import {Result} from "../Base";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;

export default interface SitAndGoGame extends DocumentData {
    dateTime: Date;
    buyIn: number;
    toWin: number;
    result: Result;
    balance: number;
}