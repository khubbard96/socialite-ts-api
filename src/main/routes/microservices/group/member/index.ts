import express from "express";
import _ from "underscore";
import SocialiteApiRoute from "../../../../models/routes/SocialiteApiRoute";
import { getIssuer } from "../../../../util/auth";
import logger from "../../../../util/log";
import { IGroup, IGroupMember } from "../../../../models/group";
import Group from "../../../../models/group"
const router: express.Router = express.Router();

logger.debug("GROUP MEMBER service loaded.");

router.post("/groups/:id/members/",async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info("Request to add member(s) to " + req.params.id + " received.");

    try {
        const requestorId:string = getIssuer(req.body.access_token);
        const newGroup = req.body.group;
        const groupId:string = req.params.id;
        const members:[IGroupMember] = newGroup.members;

        const group:IGroup = await Group.findById(groupId);

        if(!group) {
            return res.status(400).send({err: "No group found with that id."});
        }

        members.forEach((memberData:IGroupMember) => {
            group.updateMember(memberData);
        });

        res.status(200).send(group);

    } catch (err) {
        logger.error(err);
        res.status(400).send(err);
    }

});

router.delete("/groups/:id/members/",async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info("Request to remove member(s) from " + req.params.id + " received.");

    try {
        const requestorId:string = getIssuer(req.body.access_token);
        const newGroup = req.body.group;
        const groupId:string = req.params.id;
        const kickedMembers:[IGroupMember] = newGroup.members || [];

        const group:IGroup = await Group.findById(groupId);

        if(!group) return res.status(400).send({err: "Could not find group with that id."});

        kickedMembers.forEach((kicked) => {
            group.removeMember({
                userId: kicked.userId,
                groupPermissions: []
            });
        })

        res.status(200).send(group);

    } catch (err) {
        logger.error(err);
        res.status(400).send(err);
    }

});

export default router;