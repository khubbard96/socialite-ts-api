/*
    /routes/api/
*/

import express, { Router } from "express";
import logger from "../../util/log";
const router: Router = express.Router();
import { verifyToken } from "../../util/auth";
import bootstrapApplication from "../../util/bootstrap";
import SocialiteApiRoute from "../../models/routes/SocialiteApiRoute";
/**
 * This module contains the top-level API route, which handles all internal app functionality.
 * All requests to this route must be verified via JWT token verification.
 */

router.use("/api", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info(`A request was placed to a /api endpoint. ${req.method} ${req.originalUrl}`);

    // TODO: auth key verification before proceeding
    const token: string =
        (req.body && req.body.access_token) ||
        (req.query && req.query.access_token) ||
        req.headers['x-access-token'];

    req.body.access_token = token;

    try {
        const tokenVerified:boolean = verifyToken(token);
        if(tokenVerified) {
            logger.info("Token was successfully verified.");
        } else {
            return res.status(400).send({
                err: "Invalid access token.",
            });
        }
    } catch (err) {
        return res.status(400).send({
            err: "Invalid access token.",
        });
    }


    // proceed to next function
    next();
});

bootstrapApplication(router, "/api", __dirname);

const SocialiteApiRouterRoute: SocialiteApiRoute = new SocialiteApiRoute("[Socialite API] API", router, "/");
module.exports = SocialiteApiRouterRoute;