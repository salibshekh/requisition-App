var express = require('express');
var router = express.Router();

const {isAuth}  = require('../middleware/isAuth')
const userController = require('../controller/v1/userController')

router.post('/signIn',userController.signin)
router.post('/adminCreateUser',isAuth,userController.adminCreateUser)
router.post('/updateUser',isAuth,userController.updateUser)
router.post('/deleteUser',isAuth,userController.deleteUser)
router.post('/approveUser',isAuth,userController.approveUser)
router.post('/signUp',userController.registerUser)


module.exports = router;
