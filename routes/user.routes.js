const express = require('express');

const user_route = express();
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const upload = require("../middlewares/multer.middleware.js") 
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
const userController = require("../controllers/user.controller.js")
user_route.set("view engine","ejs") 
user_route.set("views","./views")
user_route.use(express.static('public'))
user_route.use(cookieParser())
// SESSION
const session = require("express-session")
user_route.use(session({
    secret:process.env.SECRET_KEY
    // resave:false,
    // saveUninitialized:true
}))

const {isLogin,isLogout} = require("../middlewares/authUser.middleware.js")

user_route.get('/register',isLogout,userController.registerLoad)
user_route.post('/register',upload.fields([
    {
        name: "image",
        maxCount: 1
    }, 
    {
        name: "coverImage",
        maxCount: 1
    }
]),userController.register)

user_route.get("/",isLogout,userController.loginLoad)
user_route.post("/",userController.login)
user_route.get("/logout",isLogin,userController.logout)
user_route.get("/dashboard",isLogin,userController.loadDashboard)

user_route.get("*",function(req,res){
    res.redirect("/")
})

module.exports=user_route