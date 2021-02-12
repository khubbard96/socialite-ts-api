/**
 * ./app.js
 * 
 * The purpose of this module is to be the primary entry point for the entire application. Responsibilities include
 *      -initiating/managing connection to mongoDb
 *      -spinning up core API/routes application
 *      -development processes (hot reloading, etc)
 */

const winston = require("winston");
const APP_CONFIG = require("./appConfig.json");
const connectDb = require("./db");

/*********************/
// TOP-level APPLICATION LOGGING
/*********************/
const logger = winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

/*********************/
// APPLICATION ENTRY POINT
/*********************/
const APPLICATION_PATH = "./dist/src/main"

//initiate connection
logger.info("Initiating connection to database.")
connectDb()
//once connection to DB is established, proceed with spinning up the API application
.then(async () => {
    logger.info("Database connected successfully.");

    logger.info("*** STARTING API APPLICATION ***")
    const SOCIALITE_API = require(APPLICATION_PATH);
    if (SOCIALITE_API) {
        logger.info("[Starting application at port " + APP_CONFIG.defaultPort + "]");
        SOCIALITE_API.listen(APP_CONFIG.defaultPort, () => { });
    }

});
