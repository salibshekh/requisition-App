// const validation = require("../middleware/validation")

// const { loggerg } = require("../configuration/logconfig");
// const log = require("../configuration/constant").LOG_FILES
require("dotenv").config();

module.exports = async (req, res, next) => {
    try {   
        const { userid, deviceid, environment, platformid, ip, location } = req.headers
        await validation.headerValidation(platformid).validateAsync({ userid, deviceid, environment, platformid, ip, location }, {
            abortEarly: false   
        });
        next();
    }
    catch (error) { 
        if (error.details) error.message = error.details
        next(error)
    }
}   