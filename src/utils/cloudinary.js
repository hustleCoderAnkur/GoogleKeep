import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath)return null
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "image" })
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return response
    } catch (error) {
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null
    }
}
const deleteOnCloudinary = async (publicId) => {
    try {
        if (!publicId) return null
        const deleteFile = await cloudinary.uploader.destroy(publicId)
        return deleteFile
    } catch (error) {
        throw new Error("Error while deleting file from Cloudinary: " + error.message)
    }
}

export {
    uploadOnCloudinary,
    deleteOnCloudinary
}