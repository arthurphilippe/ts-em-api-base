import Component from "../Component";
import Context from "../Context";

export default function intakeMiddlewares(comp: Component, ctx: Context) {
    console.log("Adding middleware for: " + comp.name);
    if (comp.middlewares && comp.middlewares.length) ctx.expressApp.use(comp.middlewares);
}
