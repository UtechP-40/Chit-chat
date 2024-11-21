// import mongoose from "mongoose";
const mongoose = require('mongoose')
// import { DB_NAME } from "../constants.js";
require("dotenv").config()
// import dotenv from "dotenv";
// dotenv.config({
//     path: './env'
// });

const connectDb = async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/ChatApp`);
        console.log(`\nConnected to MongoDB: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}

// export default connectDb;
module.exports = connectDb;