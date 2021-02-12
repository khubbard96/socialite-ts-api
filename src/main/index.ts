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

import api from "./routes/api";
import ext from "./routes/ext";

const app: express.Express = express();
initAuth(app);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.use("/", api);
app.use("/", ext);


module.exports = app;