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
import logger from "./util/log";
import { initAuth } from "./util/auth";
import bootstrapApplication from "./util/bootstrap";

const app: express.Express = express();
const router: express.Router = express.Router();
initAuth(app);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// bootstrap entire application router
bootstrapApplication(router, "/", __dirname + "\\routes");


app.use(router);




module.exports = app;