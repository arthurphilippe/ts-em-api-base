export class Database {
    public host?: string;
    public port?: string;
    public username?: string;
    public password?: string;
    public database?: string;
    public srv?: boolean;
    private _url?: string;
    private _urlMode: boolean;

    constructor(init: Partial<Database>) {
        this._urlMode = false;
        Object.assign(this, init);
    }

    get url(): string {
        if (this._urlMode) return this._url;
        this._url =
            "mongodb://" +
            this.username +
            ":" +
            this.password +
            "@" +
            this.host +
            ":" +
            this.port +
            "/?retryWrites=true";
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
    Database: Database;
}
