import express from "express"
import SocialiteApiRoute from "../../../../../models/routes/SocialiteApiRoute";
import { getIssuer } from "../../../../../util/auth";
import logger from "../../../../../util/log";
import { IGroup, IGroupMember, IGroupModel } from "../../../../../models/group";
import Group from "../../../../../models/group"
const router: express.Router = express.Router();

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

module.exports = new SocialiteApiRoute("[group members] ADD", router, "/api");