const validation = require('../../common/helper/validation')
const queryHelper = require('../../models/queryHelper')
const tables = require('../../common/helper/constant').TABLES
const { SUCCESS, FAIL, UNAUTHORIZE } = require('../../common/helper/constant').CODE
const messages = require('../../common/helper/messages').MESSAGES
const { compairPassword, createJWTToken, encrytionOfData, hashPassword } = require('../../common/helper/general')
const { sendEmail } = require('../../common/library/sendMail')
const { query } = require('../../common/library/dbMaster')


exports.signin = async (req, res, next) => {
    try {
        let { email, password } = req.body
        // let {deviceId} = req.headers
        await validation.loginSchema.validateAsync({ email, password }, { abortEarly: false })

        // email check in db 
        let checkUser = await queryHelper.findOne(tables.USERS, '*', `email = '${email}'`)
        if (!checkUser) throw ({ message: messages.NO_USER, SUCCESS })

        // compair password
        let checkPass = await compairPassword(password, checkUser.password)
        if (!checkPass) throw ({ message: messages.VALID_PASSWORD, SUCCESS })

        // logout from another devices
        // let updlogout = {
        //     isLogin : 0
        // }
        // let logout = await queryHelper.update(tables.DEVICE_TOKEN, updlogout,`userId = ${checkUser.id} AND deviceId != ${deviceId}`)

        // create jwt token
        let token = await createJWTToken(checkUser)
        // if not token in db 
        let checkDevice = await queryHelper.findOne(tables.DEVICE_TOKEN,`userId = ${checkUser.id}`)
        if(!checkDevice) {
            let insert = {
                userId : checkUser.id,
                deviceId : null,
                pushtoken : null,
                isLogin : 1,
                loginToken : token
            }
            let insData = await queryHelper.insert(tables.DEVICE_TOKEN,insert)
        }
        let updToken = {
            loginToken: token,
            isLogin: 1
        }
        // update jwt token in db
        let updateData = await queryHelper.update(tables.DEVICE_TOKEN, updToken, `userId = ${checkUser.id}`)

        // encrypt token (second layer)
        let encToken = await encrytionOfData(token)
        checkUser.token = encToken

        _RESP.successResponse(res, SUCCESS, messages.SUCCESS, checkUser)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.adminCreateUser = async (req, res, next) => {
    try {
        let { email, phoneNumber, userName, userType, password } = req.body

        await validation.createUserSchema.validateAsync(req.body, { abortEarly: false })
        //check isAdmin or not 
        let checkAdmin = await queryHelper.findOne(tables.USERS, '*', ` id = ${req.user.id}`)
        if (checkAdmin.isAdmin == 1 || checkAdmin.isAdmin == '1') {
            // check email alrady exist or not 
            let checkEmail = await queryHelper.findOne(tables.USERS, 'email', `email = '${email}'`)
            if (checkEmail) throw ({ message: "This Email alrady exist" })

            //let hash Password
            let hashPass = await hashPassword(password)
            
            let insData = {
                email: email,
                phoneNumber: phoneNumber,
                userName: userName,
                userType: userType,
                password : hashPass,
                isAdminApprove : 1 
            }
            var insertData = await queryHelper.insert(tables.USERS, insData)

            // send mail to created email id 
            // let sendEmailData = {
            //     from: 'Requisting App <no-reply@requstingapp.xyz>',
            //     to: email,
            //     subject: "New User Created",  //change 
            //     templateVariable: 'createuser.html',   //change
            //     data: {
            //         email: email,
            //         phoneNumber: phoneNumber,
            //         userName: userName,
            //         password: password
            //     }
            // }
            // sendEmail(sendEmailData);
        }
        _RESP.successResponse(res, SUCCESS, "User Created SuccessFully", { id: insertData.insertId, ...req.body })
    } catch (error) {
        next(error)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        let { id, email, phoneNumber, userName, userType, password } = req.body
        await validation.updateUserSchema.validateAsync(req.body, { abortEarly: false })

        //check isAdmin or not 
        let checkAdmin = await queryHelper.findOne(tables.USERS, '*', ` id = ${req.user.id}`)
        if (checkAdmin.isAdmin == 1 || checkAdmin.isAdmin == '1') {
            // check for user 
            let checkEmail = await queryHelper.findOne(tables.USERS, '*', `id= ${id}`)
            if (!checkEmail) throw ({ message: "No User Found " })

            //let hash Password
            let hashPass = await hashPassword(password)

            let updData = {
                email: email,
                phoneNumber: phoneNumber,
                userName: userName,
                userType: userType,
                password: hashPass
            }
            let updateData = await queryHelper.update(tables.USERS, updData, `id = ${id}`)
            _RESP.successResponse(res, SUCCESS, "User Update SuccessFully", {id: id, ...updData,passWithouthash : password})
        } else {
            throw ({ message: "You are not Authorized for this Action" })
        }
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        //check isAdmin or not 
        let checkAdmin = await queryHelper.findOne(tables.USERS, '*', ` id = ${req.user.id}`)
        if (checkAdmin.isAdmin == 1 || checkAdmin.isAdmin == '1') {
            // check for user 
            let checkEmail = await queryHelper.findOne(tables.USERS, '*', `id= ${req.body.id}`)
            if (!checkEmail) throw ({ message: "No User Found " })

            let delUser = await queryHelper.delete(tables.USERS, `id=${req.body.id}`)
            if (!delUser) throw ({ message: "Error in deleting User" })
            _RESP.successResponse(res, SUCCESS, "User Deleted SuccessFully")
        } else {
            throw ({ message: "You are not Authorized for this Action" })
        }
    } catch (error) {
        next(error)
    }
}

exports.registerUser = async (req, res, next) => {
    try {
        let { email, phoneNumber, userName, userType, password } = req.body

        await validation.createUserSchema.validateAsync(req.body, { abortEarly: false })
            // check email alrady exist or not 
            let checkEmail = await queryHelper.findOne(tables.USERS, 'email', `email = '${email}'`)
            if (checkEmail) throw ({ message: "This Email alrady exist" })

            //let hash Password
            let hashPass = await hashPassword(password)
            
            let insData = {
                email: email,
                phoneNumber: phoneNumber,
                userName: userName,
                userType: userType,
                password : hashPass 
            }
            var insertData = await queryHelper.insert(tables.USERS, insData)
        
        _RESP.successResponse(res, SUCCESS, "User Created SuccessFully", { id: insertData.insertId, ...req.body })
        
    } catch (error) {
        next(error)
    }
}

exports.approveUser = async (req, res, next) => {
    try {
        let checkAdmin = await queryHelper.findOne(tables.USERS, '*', ` id = ${req.user.id}`)
        if (checkAdmin.isAdmin == 1 || checkAdmin.isAdmin == '1') {
            let checkUser = await queryHelper.findOne(tables.USERS,'isAdminApprove, email',`email = '${req.body.email}'`)
            if(!checkUser) throw ({message : 'No user Found'})
            if(checkUser.isAdminApprove == 1 || checkUser.isAdminApprove == '1') throw ({message : "Your account already Approved"})
            if(checkUser.isAdminApprove == 0 || checkUser.isAdminApprove == '0'){
                let updateData = {
                    isAdminApprove : 1
                }
                let updateValue = queryHelper.update(tables.USERS,updateData,`email = '${checkUser.email}'`)

                _RESP.successResponse(res, SUCCESS, "User Approved SuccessFully")
            }
            
        }
        
    } catch (error) {
        next(error)
    }
}