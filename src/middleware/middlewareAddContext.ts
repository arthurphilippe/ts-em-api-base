import { Request, Response, NextFunction, RequestHandler } from "express";
import Context from "../Context";

export default function generateMiddleware(ctx: Context): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction) => {
        req.context = ctx;
        next();
    };
}
