const User = require("../models/user.model.js")

const generateAccessAndRefreshTokens = async (userId)=>{
    try{
       const user = await User.findById(userId)
       const accessToken =  user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken
       await user.save({validateBeforeSave:false})
       return {accessToken,refreshToken}
    }catch(error){
        throw new ApiError(500, "Somthing went wrong while generating refresh and access token")
    }
}

module.exports = generateAccessAndRefreshTokens