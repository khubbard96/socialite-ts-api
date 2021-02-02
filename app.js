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
const APPLICATION_PATH = "./dist"

//initiate connection
logger.info("Initiating connection to database.")
connectDb()
//once connection to DB is established, proceed with spinning up the API application
.then(async () => {
    logger.info("Database connected successfully.");

    logger.info("*** STARTING API APPLICATION ***")
    logger.info("[Bootstrapping API routes.]");
    const SOCIALITE_API = require(APPLICATION_PATH);
    if (SOCIALITE_API) {
        logger.info("[Starting application at port " + APP_CONFIG.defaultPort + "]");
        SOCIALITE_API.listen(APP_CONFIG.defaultPort, () => { });
    }

});










/*********************/
// RUDIMENTARY HOT MODULE RELOADING - needs work
/*********************/

/*TODO
    -refine legacy code to be project specific
*/
if (process.env.NODE_ENV !== "production") {

    const chokidar = require("chokidar");
    // Set up watcher to watch all files in ./
    const watcher = chokidar.watch("./");

    watcher.on("ready", function () {
        // On any file change event
        // You could customise this to only run on new/save/delete etc
        // This will also pass the file modified into the callback
        // however for this example we aren't using that information
        watcher.on("all", function () {
            logger.debug("Reloading server...");
            // Loop through the cached modules
            // The "id" is the FULL path to the cached module
            Object.keys(require.cache).forEach(function (id) {
                // Get the local path to the module
                const localId = id.substr(process.cwd().length);

                // Ignore anything not in server/app
                if (localId.match(/^\\node_modules\\.*$/)) return;

                if (localId.match(/^\\app.js$/)) return;

                if (localId.match(/^\\index.js$/)) return;

                if (localId.match(/^\\src\\.*$/)) return;

                if (localId.match(/^\\db\\.*$/)) return;

                // console.log(id);

                // Remove the module from the cache
                delete require.cache[id];
            });
            logger.debug("Server reloaded.");
        });
    });
}