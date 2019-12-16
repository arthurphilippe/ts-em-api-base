import { Response } from "express";

export default class ErrorResponse extends Error {
    public http_status: number;
    public message: string;
    public payload: any;
    public constructor(http_status: number, message: string = "", obj: any = undefined) {
        super(message);
        this.http_status = http_status;
        this.message = message;
        this.payload = obj;
    }

    public json(obj: any) {
        this.payload = obj;
    }

    public discharge(res: Response) {
        if (this.message != "" && this.payload) {
            // this.payload.message = this.message;
            res.status(this.http_status).send({ message: this.message, ...this.payload });
        } else if (this.message != "") {
            res.status(this.http_status).send({ message: this.message });
        } else {
            res.sendStatus(this.http_status);
        }
    }
}
