import express from "express";
import SocialiteApiRoute from "../../../../models/routes/SocialiteApiRoute";
const router = express.Router();
import logger from "../../../../util/log";
import { getIssuer } from "../../../../util/auth";
import Group, { IGroup } from "../../../../models/group";

router.put("/groups/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.debug("Request to create new group received.");
    try {
        const creatorId:string = getIssuer(req.body.access_token);

        const group:IGroup = await Group.createFromTitleAndCreator(req.body.group_title, creatorId);

        res.status(200).send(group);
    } catch (err) {
        res.status(400).send({err});
    }
});

module.exports = new SocialiteApiRoute("[group] CREATE", router, "/api");