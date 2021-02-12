import express from "express";
const router: express.Router = express.Router();
import logger from "../../../../util/log";
import { getIssuer } from "../../../../util/auth";
import Group, {IGroup, IGroupMessage} from "../../../../models/group";

logger.debug("GROUP MESSAGING service loaded.");

router.put("/groups/:id/messages", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.debug("Request to post a new message received.");
    try {
        const userId:string = getIssuer(req.body.access_token);

        const group:IGroup = await Group.findById(req.params.id);

        const messageText = req.body.message.text;

        await group.postMessage(
            messageText,
            userId
        );

        res.status(200).send(group);

    } catch(err) {
        logger.error(err);
        res.status(400).send(err)
    }
});

router.post("/groups/:id/messages", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.debug("Request to update a message received.");
    try {
        const userId:string = getIssuer(req.body.access_token);

        const message = req.body.message;

        const group:IGroup = await Group.findById(req.params.id);

        await group.updateMessage(message);

        res.status(200).send(group);

    } catch(err) {
        res.status(400).send({err})
    }
});

router.delete("/groups/:id/messages", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.debug("Request to delete a message received.");
    try {
        const userId:string = getIssuer(req.body.access_token);

        const group:IGroup = await Group.findById(req.params.id);

        const messageId = req.body.message._id

        await group.deleteMessage(messageId);

        res.status(200).send(group);

    } catch(err) {
        res.status(400).send({err})
    }
});

export default router;