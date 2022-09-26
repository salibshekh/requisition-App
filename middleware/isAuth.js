const messages = require('../common/helper/messages').MESSAGES
const { decryptionOfData, verifyJWTToken } = require('../common/helper/general')

const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw ({ message: messages.AUTHTOKEN })

        const authToken = authHeader.split(' ')[1];
        let decryptToken = await decryptionOfData(authToken)

        // verify jwt 
        let decodeToken = await verifyJWTToken(decryptToken)
        if (!decodeToken) throw ({ message: "Token Expired ! Login again " })

        req.user = decodeToken.data
        console.log(req.user)
        next()

    } catch (error) {
        next(error)
    }
}

module.exports = {
    isAuth
}