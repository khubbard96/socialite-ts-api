import SocialiteApiRoute from "../../../../models/routes/SocialiteApiRoute";

import express from "express";
const router = express.Router();
import User, { CountryCode, IUser } from "../../../../models/user";
import logger from "../../../../util/log";
import { Query } from "mongoose";


router.post("/user/", async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        await User.findOneAndUpdate(
            {
                _id: req.body.id
            },
            {
                name: req.body.name,
                email: {
                    addr: req.body.email,
                },
                phone: {
                    raw: req.body.phone,
                    code: CountryCode.US
                }
            },
            {

            }
        );

        logger.info(`User ${req.body.id} successfully updated.`);

        const query: Query<IUser[], IUser, IUser> = User.findById(req.body.id);

        query.select("-password").exec().then((user) => {
            res.status(200).send(user);
        });

    } catch (err) {
        logger.warn("Updating user failed.");
        res.status(400).send({
            err
        });
    }

});

const UserUpdateRoute: SocialiteApiRoute = new SocialiteApiRoute("[user] UPDATE", router, "/api");

module.exports = UserUpdateRoute;