var express = require('express');
var router = express.Router();

const userRoute = require('./users.js')

router.use('/users',userRoute)


module.exports = router;
