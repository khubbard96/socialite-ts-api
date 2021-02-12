import express from "express";
import SocialiteApiRoute from "../../../models/routes/SocialiteApiRoute";
import logger from "../../../util/log";
import User, { IUser } from "../../../models/user";
import { generateToken } from "../../../util/auth";

const router: express.Router = express.Router();

logger.debug("LOGIN microservice loaded.");

router.post("/login", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const user: IUser = await User.findByEmail(
            {addr: req.body.email}
        );

        if(!user) {
            return res.status(400).send("No user with that email found.");
        }

        if(!user.validatePassword(req.body.password)) {
            return res.status(400).send("Wrong password.");
        }

        const JWT_TOKEN = generateToken(user.get("_id"));

        res.status(200).send(
            {
                user: user.toJSON(),
                token: JWT_TOKEN
            }
        );

    } catch (err) {
        logger.warn("Issue trying to find and log in user " + req.body.email + ".");
        res.status(400).send({
            err
        });
    }
});

export default router;
