import Component from "../Component";
import Context from "../Context";

export default function intakeRouter(comp: Component, ctx: Context) {
    console.log("Adding router for: " + comp.name);
    if (comp.router) ctx.expressApp.use(comp.name.toLowerCase(), comp.router);
}
