/**
 * This module provides a route bootstrapper.
 */
import fs from "fs";
import { Router, Express } from "express";
import logger from "../log";
import SocialiteApiRoute from "../../models/routes/SocialiteApiRoute";

/**
 * Bootstraps routes on to a given Express application/router.
 *
 * @param app The application/router to bootstrap routes onto.
 * @param routesLocation Absolute file location of the routes to try to bootstrap
 * @param cb Callback to execute on successful route bootstrapping
 * @param onError callback to execute on unsuccessful route bootstrapping
 */
const bootstrapApplication = (app: Router, appRoute: string, routesLocation: string, cb?: () => any, onError?: () => any): void => {
    logger.debug("[Route Bootstrapper] Beginning bootstrapping process for application located at " + routesLocation)

    // locate and pull in bootstrappable routes
    findBootstrapableRoutes(routesLocation)

    // apply routes to application
    .then((bootstrappableRoutes: SocialiteApiRoute[]) => {
        bootstrappableRoutes.forEach((route: SocialiteApiRoute) => {
            if(route.getHandle() === appRoute) {
                logger.info("[Route Bootstrapper] Bootstrapping route " + route.getName() + " to application " + appRoute);

                if(route.hasValidator()) {
                    route.getRoute().use()
                }

                app.use(appRoute,route.getRoute());
            }
        });
        // call the callback function if one has been provided.
        if(cb) cb();
    })

    // report errors
    .catch((err) => {
        logger.warn("There was an issue bootstrapping routes from " + routesLocation + ": \n" + err);

        // call the onError callback if one has been provided.
        if(onError) onError();
    });
}

/**
 * Recursively looks for API routes from a given dir name.
 *
 * @returns A promise that completes when the recursive search is complete.
 */
function findBootstrapableRoutes(dir: string): Promise<SocialiteApiRoute[]> {
    // TODO: checks on the given dir?
    const routes: SocialiteApiRoute[] = [];
    return new Promise<SocialiteApiRoute[]>(async (res,rej) => {
        try {
            await pullModule(dir, routes);
            res(routes);
        } catch (err) {
            rej(err);
        }
    });
}

async function pullModule(dir: string, col: SocialiteApiRoute[]) {
    const files = await fs.readdirSync(
        dir,
        { withFileTypes: true }
    );
    files.forEach(async element => {
        if (element.isDirectory()) {
            try {
                const potentialRoute = require(dir + "\\" + element.name);
                if(potentialRoute instanceof SocialiteApiRoute) {
                    col.push(potentialRoute);
                }
                await pullModule(dir + "\\" + element.name, col);
            } catch (err) {
                await pullModule(dir + "\\" + element.name, col);
            }
        }
    });
}

export default bootstrapApplication;