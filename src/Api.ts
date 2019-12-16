/**
 * External
 */
import * as express from "express";
import * as http from "http";
import * as mongoose from "mongoose";

/**
 * Internal
 */
import * as config from "./Config";
import Context from "./Context";

export default class Api {
    public expressApp: express.Application;
    public context: Context;
    private dbconfig: config.Database;
    private server?: http.Server;
    private mongoose?: typeof mongoose;

    constructor(config: config.Base) {
        this.dbconfig = config.database;
        config.database = null;
        this.context = { config: config, dbConnected: false };
        this.mongoose = undefined;
        this.expressApp = express();
        this.expressApp.use(this.addContextMiddleware());
    }

    private addContextMiddleware() {
        return (req: express.Request, _res: express.Response, next: express.NextFunction) => {
            req.context = this.context;
            next();
        };
    }

    /**
     * @note Mongoose and mongodb timeout setting do not seem to work at all.
     */
    private async mongooseConnect() {
        console.log("Connecting to database, default timeout 30s.");
        this.mongoose = await mongoose.connect(this.dbconfig.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: this.context.config.timeout.connectMS,
            socketTimeoutMS: this.context.config.timeout.socketMS,
        });
        this.context.dbConnected = true;
        this.mongoose.connection.on("error", this.handleMongooseError);
        return;
    }

    private async handleMongooseError(err: any) {
        console.error("Connection error, stopping...");
        this.stop();
    }

    private async handleHttpServerError(err: Error) {
        console.error("Server error, stopping...");
        console.error(err);
        this.stop();
    }

    async stop() {
        await this.mongoose.connection.close();
        if (this.server) {
            this.server.close();
        }
        console.log("Stopped.");
    }

    public serve() {
        this.server = this.expressApp.listen(this.context.config.port, () => {
            console.log("Now serving on port: " + this.context.config.port);
        });
        this.server.on("error", this.handleHttpServerError);
    }

    public async start() {
        if (this.dbconfig) await this.mongooseConnect();
        this.serve();
    }
}
