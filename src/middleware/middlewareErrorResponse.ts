import { Response, Request, NextFunction } from "express";

import ErrorResponse from "../Error/ErrorResponse";

export default function middlewareErrorResponse(
    err: any,
    _req: Request,
    res: Response,
    next: NextFunction
) {
    debugger;
    if (err instanceof ErrorResponse) {
        err.discharge(res);
        next();
    } else {
        next(err);
    }
}
