import express from "express";
import logger from "./main/util/logger";

const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => {
    logger.info("App started at " + port + ".");
});