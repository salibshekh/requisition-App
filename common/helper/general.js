const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto = require ("crypto");
require("dotenv").config();

// hash password
const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
}

//compair password
const compairPassword = async (password,hashedPassword) => {
    return bcrypt.compare(password,hashedPassword);
}

// create JWT token
const createJWTToken = async(data) => {
   let token =  jwt.sign({data},process.env.JWT_TOKEN_KEY,{expiresIn: "1d",})
   return token
} 

const verifyJWTToken = async (token) => {
  return jwt.verify(token, process.env.JWT_TOKEN_KEY);
}


//encryotion of Data
const encrytionOfData = async (data) => {
    let cipher = crypto.createCipheriv(process.env.ALGORITHM,process.env.SECURITY_KEY,process.env.INITVECTOR);
    let encryptedData = cipher.update(data, "utf-8", "hex");
    encryptedData += cipher.final("hex");[]
    return encryptedData
}

const decryptionOfData = async (data) => {
    const decipher = crypto.createDecipheriv(process.env.ALGORITHM,process.env.SECURITY_KEY,process.env.INITVECTOR);
    let decryptedData = decipher.update(data, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    return decryptedData
}






module.exports = {
    hashPassword,
    compairPassword,
    createJWTToken,
    verifyJWTToken,
    encrytionOfData,
    decryptionOfData
}