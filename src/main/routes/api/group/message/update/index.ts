import express from "express";
const router: express.Router = express.Router();
import logger from "../../../../../util/log";
import { getIssuer } from "../../../../../util/auth";
import Group, {IGroup, IGroupMessage} from "../../../../../models/group";
import SocialiteApiRoute from "../../../../../models/routes/SocialiteApiRoute";

router.post("/groups/:id/messages", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.debug("Request to update a message received.");
    try {
        const userId:string = getIssuer(req.body.access_token);

        const message = req.body.message;

        const group:IGroup = await Group.findById(req.params.id);

        if(!group) return res.status(400).send({err: "No group with that id."});

        await group.updateMessage(message);

        res.status(200).send(group);

    } catch(err) {
        res.status(400).send({err})
    }
});

module.exports = new SocialiteApiRoute("[messages] UPDATE", router, "/api");