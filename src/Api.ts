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
import * as middleware from "./middleware";
import Component from "./Component";
import * as intake from "./intake";

export default class Api {
    public expressApp: express.Application;
    public context: Context;
    private dbconfig: config.Database;
    private server?: http.Server;
    private mongoose?: typeof mongoose;
    private components: Component[];
    private componentIntakes: ((comp: Component, ctx: Context) => void)[];

    constructor(config: config.Base) {
        this.dbconfig = config.database;
        config.database = null;
        this.expressApp = express();
        this.context = { config: config, dbConnected: false, expressApp: this.expressApp };
        this.mongoose = undefined;
        this.addGlobalMiddlewares();
        this.components = [];
        this.componentIntakes = [intake.middlewares];
    }

    private addGlobalMiddlewares() {
        this.expressApp.use(middleware.AddContext(this.context));
    }

    private addErrorMiddlewares() {
        this.expressApp.use(middleware.ErrorMongoose);
        this.expressApp.use(middleware.ErrorResponse);
    }

    public addComponent(comp: Component) {
        this.componentIntakes.forEach((intakeFunction) => {
            intakeFunction(comp, this.context);
        });
        this.components.push(comp);
    }

    public addComponentIntake(proc: (comp: Component, ctx: Context) => void) {
        this.componentIntakes.push(proc);
    }

    public markComponentsReady() {
        this.components.forEach((comp) => {
            intake.router(comp, this.context);
        });
    }

    /**
     * @note Mongoose and mongodb timeout setting do not seem to work at all.
     */
    private async mongooseConnect() {
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useFindAndModify", false);
        mongoose.set("useCreateIndex", true);
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

    public preStart() {
        this.markComponentsReady();
        this.addErrorMiddlewares();
    }

    public async start() {
        this.preStart();
        if (this.dbconfig) await this.mongooseConnect();
        if (this.context.config.port) this.serve();
    }
}
