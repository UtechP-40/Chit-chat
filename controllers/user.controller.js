const User = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const ApiError = require("../utils/ApiError.utils.js")
const uploadOnCloudinary = require("../utils/cloudinary.utils.js")
const user_route = require("../routes/user.routes.js")
const ApiResponse  = require("../utils/ApiResponse.utils.js")
const generateAccessAndRefreshTokens = require("../utils/generateAccessAndRefreshTokens.utils.js")

const registerLoad = async (req,res)=>{
    try {
        res.render("register")
    } catch (error) {
        
    }
}


const register = async (req,res)=>{
    try {
        const {name, email, password } = req.body
        console.log(req.body,req.files)
        // if (
        //     [name, email, password].some((field) => field?.trim() === "")
        // ) {
        //     throw new ApiError(400, "All fields are required") 
        // }
        if(!name || !email || !password ){
            res.render("register",{message:"all fields are required"})
            return
        }
        const existedUser = await User.findOne({ email:email })
        if (existedUser) {
            // throw new ApiError(409, "User with email or username already exists")
            res.render("register",{message:"User Allready exist"})
            return
        }
        const avatarLocalPath = req.files?.image[0]?.path;
       console.log(avatarLocalPath,"hiiijoijhoedhrg")
    if (!avatarLocalPath) {
        // throw new ApiError(400, "Photo file is required")
        res.render("register",{message:"All fields are required"})
        return
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar,"hiii")
    if (!avatar) {
        // throw new ApiError(400, "Avatar file is required")
        res.render("register",{message:"Unable to Upload Image on Server Please try again"})
        return
    }
        const passwordHash = await bcrypt.hash(password,10)
        console.log(passwordHash)
        const user = await User.create({
            name,
            email,
            password:passwordHash,
            image:avatar.url
        })
        const createdUser = await User.findById(user._id)
        if (!createdUser) {
            // throw new ApiError(500, "Something went wrong while registering the user")
            res.render("register",{message:"Something went wrong while registering the user"})
        return
        }
        console.log(User,createdUser)
        res.render("register",{message:"Registration has been successfully completed"})
    } catch (error) {
        
    }
}

const loginLoad = async (req,res)=>{
    try {
        res.render("login")
    } catch (error) {
        console.log(error.message)
    }
}
const login = async (req,res)=>{
    const {email,password} = req.body
    console.log(req.body)
    const user = await User.findOne({email:email})
    if (!user) {
        res.render("login",{message:"user not found"})
        return
        // throw new ApiError(401,"Invalid email or password")
        
    }else{
    console.log(user)
    const isMatch = await bcrypt.compare(password,user.password)
    if (!isMatch) {
        // throw new ApiError(401,"Invalid email or password")
        res.render("login",{message:"user not found"})
        return
    }else{
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    console.log(loggedInUser,accessToken,refreshToken)
    const options = {
        httpOnly: true,
        secure: true
       }
    req.session.user = user 
    res.redirect("/dashboard")
    }
}
    // res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
    //     new ApiResponse(
    //         200,
    //         {
    //             user: loggedInUser,
    //             accessToken,
    //             refreshToken
    //         },
    //         "User logged in Successfully"
    //     )
    
    // )

    // res.redirect("/dashboard")
 

}
const logout = async (req,res)=>{
    req.session.destroy()
    res.redirect("/")
    // await User.findByIdAndUpdate(
    //     req.user._id,
    //     {
    //         $set:{
    //             refreshToken:undefined
    //         }
    //     },
    //     {
    //         new:true
    //     }
    // )

    // const options = {
    //     httpOnly: true,
    //     secure: true
    //    }
    //    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
    //     new ApiResponse(200,{},"User Logged Out Successfully")
    //    )
}
const loadDashboard = async (req,res)=>{
    // console.log(req.session.user._id);
     try {
        
       const users = await User.find({_id:{ $nin:[req.session.user._id]}})
       res.render("dashboard",{user:req.session.user,users})
     } catch (error) {
        console.log(error)
     }
}


module.exports = {
    registerLoad,
    register,
    loginLoad,
    login,
    logout,
    loadDashboard
}