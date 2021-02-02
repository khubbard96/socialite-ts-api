const mongoose = require("mongoose");
const APP_CONFIG = require("../appConfig.json");

const connectDb = () => {
    return mongoose.connect(APP_CONFIG.databaseUrl, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = connectDb;