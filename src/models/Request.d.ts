import Context from "@/models/Context";

declare global {
    namespace Express {
        export interface Request {
            context?: Context;
        }
    }
}
