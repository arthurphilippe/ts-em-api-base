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

        this._url = base + this.username + ":" + this.password + "@" + this.host + ":" + this.port;

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

export interface Base {
    port: number;
    database: Database;
}
