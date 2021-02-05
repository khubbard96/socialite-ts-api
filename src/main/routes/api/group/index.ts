import express from "express";
const router: express.Router = express.Router();
import logger from "../../../util/log";
import { getIssuer } from "../../../util/auth";
import Group, {IGroup} from "../../../models/group";
import SocialiteApiRoute from "../../../models/routes/SocialiteApiRoute";

router.get("/groups/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.debug("Request to get all groups for user received.");
    try {
        const userId:string = getIssuer(req.body.access_token);
        Group.findByGroupMember(userId).exec().then((groups) => {
            res.status(200).send(groups);
        });

    } catch(err) {
        res.status(400).send({err})
    }
});

router.get("/groups/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.debug("Request to get single group for user received.");
    try {
        const userId:string = getIssuer(req.body.access_token);
        const groupId:string = req.params.id;

        Group.findByIdAndGroupMember(userId, groupId).then((group) => {
            res.status(200).send(group || []);
        });

    } catch(err) {
        res.status(400).send({err: "Could not find a group with the provided ID."});
    }
});

module.exports = new SocialiteApiRoute("[groups] GET", router, "/api");
