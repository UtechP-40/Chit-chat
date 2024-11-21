require('dotenv').config()
// const mongoose = require('mongoose')
const connectDb = require("./database/index.js")
const userRoute = require("./routes/user.routes.js")
const User = require("./models/user.model.js")
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
const io = require("socket.io")(http)

const userNamespace=io.of('/user-namespace')

userNamespace.on('connection',async (socket)=>{
    console.log('user connected')
   try {
    
    //  socket.on("sender_id",async (sender_id)=>{
    //     id=sender_id
        //  const updatedUser = await User.findOneAndUpdate({_id:socket.handshake.auth.token},{is_online:"1"})
        const updatedUser = await User.findByIdAndUpdate({_id:socket.handshake.auth.token},{ $set:{is_online:"1"}})
         console.log(updatedUser)
    //  })

    // console.log(socket)

     socket.on("disconnect",async ()=>{
         console.log("user Disconnected")
         const updatedUser = await User.findByIdAndUpdate({_id:socket.handshake.auth.token},{ $set:{is_online:"0"}})
        //  console.log(updatedUser)
     })
   } catch (error) {
    console.log(error)
   }
})
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