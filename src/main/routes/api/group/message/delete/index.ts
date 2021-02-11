import express from "express";
const router: express.Router = express.Router();
import logger from "../../../../../util/log";
import { getIssuer } from "../../../../../util/auth";
import Group, {IGroup} from "../../../../../models/group";
import SocialiteApiRoute from "../../../../../models/routes/SocialiteApiRoute";

router.delete("/groups/:id/messages", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.debug("Request to delete a message received.");
    try {
        const userId:string = getIssuer(req.body.access_token);

        const group:IGroup = await Group.findById(req.params.id);

        if(!group) return res.status(400).send({err: "No group with that id."});

        const messageId = req.body.message._id

        await group.deleteMessage(messageId);

        res.status(200).send(group);

    } catch(err) {
        res.status(400).send({err})
    }
});

module.exports = new SocialiteApiRoute("[messages] UPDATE", router, "/api");