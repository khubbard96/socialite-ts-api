import express from "express";
const router = express.Router();
import User from "../../../models/user";

router.put("/group/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {
        groupName,
        creatorId
    } = req.body;

    const creator = User.findOne({_id: creatorId});

    /*const newGroup = new Group({
        name: groupName,
        owner: creator
    });*/

    // Group.addMember(newGroup._id, creator);

    /*newGroup.save()
        .then((group) => {
            res.status(200).send({
                group: group
            });
        })
        .catch((err) => {
            res.status(400).send({
                err: err
            });
        });*/
});

module.exports = router;