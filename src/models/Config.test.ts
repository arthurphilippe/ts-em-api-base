import * as config from "@/models/Config";

it("should generate a correct URL", () => {
    let conf: config.Base = {
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
    };

    expect(conf.database.url).toEqual(
        "mongodb://root:example@localhost:27017?retryWrites=true&authSource=admin"
    );

    conf.database.srv = true;

    expect(conf.database.url).toEqual(
        "mongodb+srv://root:example@localhost:27017?retryWrites=true&authSource=admin"
    );
});
