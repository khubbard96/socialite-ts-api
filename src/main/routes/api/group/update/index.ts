import express from "express"
import SocialiteApiRoute from "../../../../models/routes/SocialiteApiRoute";
import { getIssuer } from "../../../../util/auth";
import logger from "../../../../util/log";
import { IGroup, IGroupModel } from "../../../../models/group";
import Group from "../../../../models/group";
const router: express.Router = express.Router();

router.post("/groups/:id/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info("Request to update group " + req.params.id + " received.");
    try {
        const requestorId:string = getIssuer(req.body.access_token);
        const newGroup = req.body.group;
        const groupId:string = req.params.id;

        const group:IGroup = await Group.findById(groupId);

        // TODO - verify action taker has permissions to do this.
        group.title = newGroup.title;

        const updatedGroup:IGroup = await group.save()
        res.status(200).send(updatedGroup.toJSON());

    } catch (err) {
        logger.error(err);
        res.status(400).send({err});
    }
});

router.post("/groups/:id/owner", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info("Reques to update owner of group " + req.params.id + " received.");
    try {
        const requestorId:string = getIssuer(req.body.access_token);
        const newGroup = req.body.group;
        const newOwner = newGroup.owner;
        const groupId = req.params.id;

        const group:IGroup = await Group.findById(groupId);

        if(!group) return res.status(400).send({err: "No group with that id."});

        await group.updateOwner(newOwner);

        res.status(200).send(group.toJSON());
    } catch (err) {
        logger.error(err);
        res.status(400).send({err});
    }
});

module.exports = new SocialiteApiRoute("[group] UPDATE", router, "/api");