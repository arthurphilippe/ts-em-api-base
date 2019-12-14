import * as config from "./Config";

it("should generate a correct URL", () => {
    let conf = new config.Base({
        port: 80,
        database: new config.Database({
            host: "localhost",
            port: "27017",
            username: "root",
            password: "example",
            database: "test",
            srv: false,
            options: ["retryWrites=true", "authSource=admin"],
        }),
    });

    expect(conf.database.url).toEqual(
        "mongodb://root:example@localhost:27017/test?retryWrites=true&authSource=admin"
    );

    conf.database.srv = true;

    expect(conf.database.url).toEqual(
        "mongodb+srv://root:example@localhost:27017/test?retryWrites=true&authSource=admin"
    );

    conf.database.url = "totally.legit.url";

    expect(conf.database.url).toEqual("totally.legit.url");
});

it("should fail to create URL", () => {
    let conf = new config.Base({
        port: 80,
        database: new config.Database({
            // host: "localhost",
            // port: "27017",
            // username: "root",
            // password: "example",
            // database: "test",
            // srv: false,
            // options: ["retryWrites=true", "authSource=admin"],
        }),
    });

    expect(() => conf.database.url).toThrow();
});
