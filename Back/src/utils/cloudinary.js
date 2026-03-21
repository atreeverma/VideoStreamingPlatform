import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import 'dotenv/config';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null // if no file path is provided
        const response = await cloudinary.uploader.upload(localFilePath,{// upload options
            resource_type : 'auto'// to support all file types
        })
        // remove file from local server after uploading to cloudinary
        fs.unlinkSync(localFilePath);
        return response;
    }catch (error){
        fs.unlinkSync(localFilePath);// remove file from local server if upload fails
        return null;
    }
}
export {uploadOnCloudinary};