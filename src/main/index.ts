/**
 * /src/main/index.ts
 *
 * The pupose of this module is to
 *      -construct an Express application/routing instance
 *      -find all bootstrappable sub-routers (express middleware) and patch them into the main application router
 *      -pass the express application/router instance back to the managing application.
 */

import express from "express";
import bodyParser from "body-parser";
import logger from "./util/logger";
import RouteBootstrapper from "./routes/RouteBootstrapper";

const app: express.Express = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// basic auth key handling

app.use("/api", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info(`A request was placed to a /api endpoint. ${req.method} ${req.originalUrl}`);

    // TODO: auth key verification before proceeding

    // proceed to next function
    next();
});

// TODO:
// place any application-wide middleware here
// .
// .
// ...........


// find and bootstrap routes using the routes finder module.
RouteBootstrapper.bootstrapApplication(app);



module.exports = app;