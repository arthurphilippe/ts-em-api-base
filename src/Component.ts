import * as express from "express";
import * as config from "./Config";

export default interface Component {
    name: string;
    middlewares: express.RequestHandler[];
    router: express.Router;
}

export interface GeneratesComponent {
    (config: config.Base): Component;
}
