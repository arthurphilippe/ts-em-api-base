import Api, * as index from "./index";

import * as request from "supertest";

it("should add the context to requests", async (done) => {
    let api = new Api(new index.config.Base({ database: null }));

    api.expressApp.get("/", (req, res) => {
        if (req.context && req.context.dbConnected === false) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    });

    request(api.expressApp)
        .get("/")
        .expect(200)
        .end((err) => {
            if (err) done(err);
            else done();
        });
});
