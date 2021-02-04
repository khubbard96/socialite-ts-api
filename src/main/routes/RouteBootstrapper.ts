/**
 * RouteBootstrapper.ts
 *
 * The purpose of this module is to find and retrieve express Router objects contained within modules,
 * within the /routes directory. Potential Router objects are then passed back to the calling
 * component.
 */

import fs from "fs";
import logger from "../util/logger"
import SocialiteApiRoute from "./SocialiteApiRoute";
import { Express } from "express";

const ROUTES_LOCATION = __dirname;

const routeHandlers: SocialiteApiRoute[] = [];

async function pullModule(dir) {
    const files = await fs.readdirSync(
        dir,
        {
            withFileTypes: true
        }
    );
    files.forEach(element => {
        if (element.isDirectory()) {
            try {
                const potentialRoute = require(dir + "\\" + element.name);
                if(potentialRoute instanceof SocialiteApiRoute) {
                    routeHandlers.push(potentialRoute);
                }
            } catch (err) {
                pullModule(dir + "\\" + element.name);
            }
        }
    });
}

function findBootstrapable(): Promise<SocialiteApiRoute[]> {
    return new Promise<SocialiteApiRoute[]>(async (res, rej) => {
        await pullModule(ROUTES_LOCATION)
        logger.info("[Route Bootstrapper] Found " + routeHandlers.length + " routes to bootstrap.");
        res(routeHandlers);
    });
}

function bootstrapApplication(app: Express): void {
    logger.info("[Route Bootstrapper] Beginning application route bootstrapping.");
    findBootstrapable().then((routes: SocialiteApiRoute[]) => {

        routes.forEach((route: SocialiteApiRoute) => {
            logger.debug("[Route Bootstrapper] Bootstrapping route " + route.getName());
        });

    });
}

export default { bootstrapApplication };