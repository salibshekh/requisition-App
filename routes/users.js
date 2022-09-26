var express = require('express');
var router = express.Router();

const {isAuth}  = require('../middleware/isAuth')
const userController = require('../controller/v1/userController')

router.post('/signIn',userController.signin)
router.post('/createUser',isAuth,userController.createUser)
router.post('/updateUser',isAuth,userController.updateUser)
router.post('/deleteUser',isAuth,userController.deleteUser)


module.exports = router;
