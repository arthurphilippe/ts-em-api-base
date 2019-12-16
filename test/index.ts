import * as ApiBase from "..";

let conf = new ApiBase.config.Base({
    port: 9000,
    database: new ApiBase.config.Database({
        // url: "mongo://root:example@localhost",
        host: "localhost",
        port: "27017",
        username: "root",
        password: "example",
        database: "test",
        srv: false,
        options: ["retryWrites=true", "authSource=admin"],
    }),
    timeout: {
        connectMS: 3000,
        socketMS: 3000,
    },
});

(async () => {
    try {
        let app = new ApiBase.default(conf);

        process.on("SIGINT", async () => {
            console.log("Received SIGINT.");
            await app.stop();
        });
        process.on("SIGTERM", async () => {
            console.log("Received SIGTERM.");
            await app.stop();
        });

        await app.start();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
