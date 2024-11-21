const mongoose=require('mongoose')
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        // unique:true
    },
    email:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_online:{
        type:String,
        default:'0'
    }
},{timestamps:true});

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullName:this.fullName,
            username:this.username
    },
    process.env.ACCESS_TOKEN_SECRATE,
    
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRATE,
    
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
module.exports= mongoose.model('User',userSchema)