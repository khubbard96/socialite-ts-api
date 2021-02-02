const Group = {};

import express from "express";
const router = express.Router();

router.put("/group/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {
        groupName,
        creator
    } = req.body;

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