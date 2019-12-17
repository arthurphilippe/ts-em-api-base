export class Database {
    public host?: string;
    public port?: string;
    public username?: string;
    public password?: string;
    public database?: string;
    public srv?: boolean;
    private _url?: string;
    private _urlMode: boolean;
    public options?: string[];

    constructor(init: Partial<Database>) {
        this._urlMode = false;
        Object.assign(this, init);
    }

    get url(): string {
        if (this._urlMode) return this._url;

        let base = this.srv ? "mongodb+srv://" : "mongodb://";

        if (!this.username || !this.password || !this.host || !this.port || !this.database)
            throw new Error("Cannot generate mongo url. At least one field is missing");

        this._url =
            base +
            this.username +
            ":" +
            this.password +
            "@" +
            this.host +
            ":" +
            this.port +
            "/" +
            this.database;

        if (this.options && this.options.length) {
            let first = true;
            this.options.forEach((opt) => {
                if (first) {
                    first = false;
                    this._url += "?";
                } else this._url += "&";
                this._url += opt;
            });
        }
        return this._url;
    }

    set url(url: string) {
        if (url && url.length) {
            this._url = url;
            this._urlMode = true;
        } else {
            this._url = undefined;
            this._urlMode = false;
        }
    }
}

export interface IBase {
    port: number;
    database: Database;
    timeout: {
        connectMS: number;
        socketMS: number;
    };
}

export class Base implements IBase {
    port: number = 9000;
    database: Database = new Database({
        host: "localhost",
        port: "27017",
        username: "root",
        password: "example",
        database: "test",
        srv: false,
        options: ["retryWrites=true", "authSource=admin"],
    });
    timeout: {
        connectMS: number;
        socketMS: number;
    } = { connectMS: 5000, socketMS: 5000 };

    constructor(init: Partial<Base>) {
        Object.assign(this, init);
    }
}
