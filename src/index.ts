import * as express from "express";

export default class App {
    expressApp: express.Application;

    constructor() {
        this.expressApp = express();
    }
}
