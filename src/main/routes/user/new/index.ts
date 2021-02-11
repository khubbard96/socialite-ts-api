import express from "express";
const router = express.Router();
import User, { CountryCode, IUser } from "../../../models/user";
import logger from "../../../util/log";
import { Query } from "mongoose";
import SocialiteApiRoute from "../../../models/routes/SocialiteApiRoute";
import { generateToken } from "../../../util/auth";

// a comment

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

        const query: Query<IUser, IUser, IUser> = User.findByEmail({addr: req.body.email});

        query.exec().then((user) => {
            // TODO redirect here + send a api token
            const apiToken:string = generateToken(user._id);
            res.status(200).send({user, apiToken});
        });
    } catch (err) {
        logger.warn("New user creation failed.")
        res.status(400).send({
            err
        });
    }

});

const UserCreationRoute: SocialiteApiRoute = new SocialiteApiRoute("[user] CREATE", router, "/");

module.exports = UserCreationRoute;