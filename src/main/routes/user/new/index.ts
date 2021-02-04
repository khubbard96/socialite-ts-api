import express from "express";
const router = express.Router();
import User, { CountryCode, IUser } from "../../../models/user";
import logger from "../../../util/logger";
import { Query } from "mongoose";
import SocialiteApiRoute from "../../SocialiteApiRoute";

//a comment

router.put("/user/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        await User.create(
            {
                name: req.body.name,
                email: {
                    addr: req.body.email,
                },
                password: {
                    value: req.body.password,
                },
                phone: {
                    raw: req.body.phone,
                    code: CountryCode.US
                }
            }
        );

        const query: Query<IUser[], IUser, IUser> = User.findByEmail({addr: req.body.email});

        query.select("-password").exec().then((user) => {
            res.status(200).send(user);
        });
    } catch (err) {
        logger.warn("New user creation failed.")
        res.status(400).send({
            err
        });
    }

});

const UserCreationRoute: SocialiteApiRoute = new SocialiteApiRoute("[user] CREATE", router);

module.exports = UserCreationRoute;