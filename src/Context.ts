import * as config from "./Config";
import { Application } from "express";

export default interface Context {
    config: config.Base;
    dbConnected: boolean;
    expressApp: Application;
}
