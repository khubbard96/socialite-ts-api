import express from "express";
const router: express.Router = express.Router();
import logger from "../../../../../util/log";
import { getIssuer } from "../../../../../util/auth";
import Group, {IGroup} from "../../../../../models/group";
import SocialiteApiRoute from "../../../../../models/routes/SocialiteApiRoute";

router.post("/groups/:id/messages", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.debug("Request to update a message received.");
    try {
        const userId:string = getIssuer(req.body.access_token);
        Group.findByGroupMember(userId).exec().then((groups) => {
            res.status(200).send(groups);
        })

    } catch(err) {
        res.status(400).send({err})
    }
});

module.exports = new SocialiteApiRoute("[messages] UPDATE", router, "/api");