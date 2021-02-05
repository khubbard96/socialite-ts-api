import express from "express"
import SocialiteApiRoute from "../../../../models/routes/SocialiteApiRoute";
const router: express.Router = express.Router();

router.post("/groups/:id/update/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //
});

module.exports = new SocialiteApiRoute("[group] UPDATE", router, "/api");