// import { v2 as cloudinary } from "cloudinary";
const {v2:cloudinary} = require("cloudinary")
// import fs from "fs";
const fs = require("fs")
// import dotenv from "dotenv";
require("dotenv").config({
    path: './env'
});


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log(cloudinary.config());
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            // throw new Error("Local file path is required");
            return null;
        }

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
            // folder: "folder_name"
        });
        
        console.log("file uploaded successfully", result);
        fs.unlinkSync(localFilePath)
        console.log("file unlinked from local Storage")
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath);// removes the locally saved temporary files if any error occurs
        return null;
    }
}

module.exports =  uploadOnCloudinary;