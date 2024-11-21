require('dotenv').config()
// const mongoose = require('mongoose')
const connectDb = require("./database/index.js")
const userRoute = require("./routes/user.routes.js")
const app = require('express')()
app.use(require('express').static('public')) 
app.set("view engine","ejs")
app.set("views","./views")

// const bodyParser = require("body-parser")
// const upload = require("./middlewares/multer.middleware.js") 
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));
// const userController = require("./controllers/user.controller.js")
// app.post('/register',upload.any(),userController.register)
// app.get('/register',userController.registerLoad) 
// app.get("/",(req,res)=>{
//     res.send("<h1>hello<h2>")
// })
// console.log()

const http = require('http').Server(app)
app.use("/",userRoute)

// app.use(require("express").static('public'))

// app.get("/",(req,res)=>{
//     res.render("index")
// })
// const userRoute = require("./routes/user.routes.js")




connectDb().then(()=>{
    http.listen(3000,()=>{
        console.log(`Server is running on http://localhost:3000`)
    })
})
.catch((err)=>{
    console.log("MONGO db Connection failed ",err)
    http.on("error",(error)=>{
        console.error("Server error:", error);
        // process.exit(1);
        throw error;
    })
})