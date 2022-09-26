const Joi = require('joi'); 

const headerSchema = Joi.object().keys({
    environment : Joi.number(),
    location : Joi.string().required()
}) 

const loginSchema = Joi.object().keys({
    email : Joi.string().email().required(),
    password : Joi.string().required()
})

const createUserSchema = Joi.object().keys({
    email : Joi.string().email().required(),
    phoneNumber : Joi.string().required(),
    userName : Joi.string().required(),
    userType : Joi.string().valid('requester','approver').required(),
    password : Joi.string().required()
})

const updateUserSchema = Joi.object().keys({
    id : Joi.number().required(),
    email : Joi.string().email().optional(),
    phoneNumber : Joi.string().optional(),
    userName : Joi.string().optional(),
    userType : Joi.string().valid('requester','approver').optional(),
    password : Joi.string().optional()
})
module.exports = {
    loginSchema,
    createUserSchema,
    updateUserSchema
}