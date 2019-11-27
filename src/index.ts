import * as express from "express";
import * as config from "./models/Config";
import * as http from "http";
import Context from "./models/Context";

export { config };

export default class App {
    public expressApp: express.Application;
    public context: Context;
    private server?: http.Server;

    constructor(config: config.Base) {
        this.context = { config: config };
        this.expressApp = express();
        this.expressApp.use(this.addContextMiddleware());
    }

    addContextMiddleware() {
        return (req: express.Request, _res: express.Response, next: express.NextFunction) => {
            req.context = this.context;
            next();
        };
    }

    public async start() {}
}

if (!module.parent) {
    let conf: config.Base = {
        port: 9000,
        database: new config.Database({
            // url: "mongo://root:example@localhost",
            host: "localhost",
            port: "27017",
            username: "root",
            password: "example",
            database: "test",
            srv: false,
            options: ["retryWrites=true", "authSource=admin"],
        }),
    };
    let app = new App(conf);
}
