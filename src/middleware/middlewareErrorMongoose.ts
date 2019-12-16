import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../Error/ErrorResponse";

function matchMongoError(err: any): ErrorResponse {
    if (err.name === "MongoError" || err.name === "MongooseError") {
        if (err.code == "11000") {
            return new ErrorResponse(409, err.message);
        }

        console.error("Unexpected database error:", err);
        return new ErrorResponse(500, "Unexpected database error");
    }

    if (err.name == "ValidationError") {
        return new ErrorResponse(400, err.message);
    }

    if (err.name == "CastError") {
        return new ErrorResponse(400, err.message);
    }
    return null;
}

export default function middlewareErrorMongoose(
    err: any,
    _req: Request,
    _res: Response,
    next: NextFunction
) {
    let new_err = matchMongoError(err);
    if (new_err) {
        next(new_err);
    } else {
        next(err);
    }
}
