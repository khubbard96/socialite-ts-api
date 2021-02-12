import { loginService, userCreationService } from "../microservices";

import express from "express"
const router:express.Router = express.Router();

router.use("/", loginService);
router.use("/", userCreationService);

export default router;