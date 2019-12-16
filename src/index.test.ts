import Api, * as index from "./index";

import * as request from "supertest";
import ErrorResponse from "./Error/ErrorResponse";

it("should add the context to requests", async (done) => {
    let api = new Api(new index.config.Base({ database: null, port: 0 }));

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

it("should return correct status code using ErrorResponse", (done) => {
    let api = new Api(new index.config.Base({ database: null, port: 0 }));

    api.expressApp.get("/", (_req, _res, next) => {
        next(new ErrorResponse(409, "That's an error"));
    });
    api.start();

    request(api.expressApp)
        .get("/")
        .expect(409)
        .end((err) => {
            if (err) done(err);
            else done();
        });
});

it("should return 409 using MongoError", (done) => {
    let api = new Api(new index.config.Base({ database: null, port: 0 }));

    api.expressApp.get("/", (_req, _res, next) => {
        next({ name: "MongoError", code: "11000" });
    });
    api.start();

    request(api.expressApp)
        .get("/")
        .expect(409)
        .end((err) => {
            if (err) done(err);
            else done();
        });
});

it("should return 400 using MongoError", async (done) => {
    let api = new Api(new index.config.Base({ database: null, port: 0 }));

    api.expressApp.get("/one", (_req, _res, next) => {
        next({ name: "ValidationError" });
    });
    api.expressApp.get("/two", (_req, _res, next) => {
        next({ name: "ValidationError" });
    });
    api.start();

    await request(api.expressApp)
        .get("/one")
        .expect(400)
        .end((err) => {
            if (err) done(err);
        });

    await request(api.expressApp)
        .get("/two")
        .expect(400)
        .end((err) => {
            if (err) done(err);
        });

    done();
});
