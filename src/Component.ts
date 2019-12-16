import * as express from "express";
import * as config from "./Config";

export default interface Component {
    name: string;
    permissions: string;
    globalMiddleware: express.RequestHandler[];
    router: express.Router;
}

export interface GeneratesComponent {
    generateComponent: (config: config.Base) => Component;
}
