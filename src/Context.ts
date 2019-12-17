import * as config from "./Config";
import { Application } from "express";

export default interface Context {
    config: config.IBase;
    dbConnected: boolean;
    expressApp: Application;
}
