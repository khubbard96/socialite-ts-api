/**
 * /src/main/index.ts
 *
 * The pupose of this module is to
 *      -construct an Express application/routing instance
 *      -find all bootstrappable sub-routers (express middleware) and patch them into the main application router
 *      -pass the express application/router instance back to the managing application.
 */

import express from "express";
import logger from "./util/logger";
import routes from "./routes/RouteBootstrapper";

const app: express.Express = express();

app.use(express.json());

// find and bootstrap routes using the routes finder module.
routes.bootstrap().map((router: express.Router) => {
    try {
        app.use(router);
        logger.info("Successfully bootstrapped route " + router.name);
    } catch(err) {
        logger.warn(router.route + " is not a valid router.")
    }
});

module.exports = app;