// const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js")
const asyncHandler = require("../utils/asyncHandler.utils.js");
const ApiError = require("../utils/ApiError.utils.js")

const isLogin = asyncHandler(async (req, res, next) => {
    try {
        if(req.session.user){
            // throw new Error({message:"user is Logged In"})
            
        }else{
            res.redirect("/")
        }
        next()
    } catch (error) {
        console.log(error.message,"hellosldhkjhdkjhdkdgdhgsjdh")
    }
})

const isLogout = asyncHandler(async (req, res, next) => {
    try {
        if(req.session.user){
            res.redirect("/dashboard")
        }
            // throw new Error({message:"user is not Logged In"})
            // return
        
        next()
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = {isLogin,isLogout}