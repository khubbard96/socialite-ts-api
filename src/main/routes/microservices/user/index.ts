/*
    /routes/api/user
*/
import express from "express";
const router:express.Router = express.Router();
import User, { CountryCode, IUser } from "../../../models/user";
import logger from "../../../util/log";
import { getIssuer } from "../../../util/auth";


logger.debug("USER microservice loaded.");


router.get("/user", async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const userId: string = getIssuer(req.body.access_token);

        const user:IUser = await User.findById(userId);

        res.status(200).send(user);

    } catch (e) {
        logger.error("Finding user failed. " + e);
        res.status(400).send({ e });
    }
});

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
        );
        logger.info(`User ${req.body.id} successfully updated.`);

        const user:IUser = await User.findById(req.body.id);

        res.status(200).send(user);

    } catch (e) {
        logger.error("Updating user failed. " + e);
        res.status(400).send({ e });
    }

});

export default router;