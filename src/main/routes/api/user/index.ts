/*
    /routes/api/user
*/
import SocialiteApiRoute from "../../../models/routes/SocialiteApiRoute";
import express from "express";
const router = express.Router();
import User, { CountryCode, IUser } from "../../../models/user";
import logger from "../../../util/log";
import { getIssuer } from "../../../util/auth";

router.get("/user", async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const userId: string = getIssuer(req.body.access_token);

        User.findById(userId).select("-_id").exec().then((user) => {
            res.status(200).send(user);
        });

    } catch (err) {
        res.status(400).send({
            err
        });
    }

});

const UserUpdateRoute: SocialiteApiRoute = new SocialiteApiRoute("[user] GET", router, "/api");

module.exports = UserUpdateRoute;