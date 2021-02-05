import express from "express";
const router: express.Router = express.Router();
import logger from "../../../../../util/log";
import { getIssuer } from "../../../../../util/auth";
import Group, {IGroup} from "../../../../../models/group";
import SocialiteApiRoute from "../../../../../models/routes/SocialiteApiRoute";

router.put("/groups/:id/messages", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.debug("Request to post a new message received.");
    try {
        const userId:string = getIssuer(req.body.access_token);
        Group.findById(req.params.id).exec().then((group) => {
            group.postMessage({
                text: "asdasdf",
                sender: userId
            }).then(() => res.status(200).send(group.toJSON()))
        });
    } catch(err) {
        logger.error(err);
        res.status(400).send(err)
    }
});

module.exports = new SocialiteApiRoute("[messages] CREATE", router, "/api");