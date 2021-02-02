/**
 * RouteBootstrapper.ts
 *
 * The purpose of this module is to find and retrieve express Router objects contained within modules,
 * within the /routes directory. Potential Router objects are then passed back to the calling
 * component.
 */

import fs from "fs";
import logger from "../util/logger"

const ROUTES_LOCATION = __dirname;

const routeHandlers = [];

function pullModule(dir) {
    const files = fs.readdirSync(
        dir,
        {
            withFileTypes: true
        }
    );
    files.forEach(element => {
        if (element.isDirectory()) {
            let newHandler;
            try {
                newHandler = require(dir + "\\" + element.name);
                routeHandlers.push(newHandler);
            } catch (err) {
                pullModule(dir + "\\" + element.name);
            }
        }
    });
}

function bootstrap() {
    pullModule(ROUTES_LOCATION)
    logger.info("Found " + routeHandlers.length + " to bootstrap.");
    return routeHandlers;
}

export default { bootstrap };