import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, options = {}) => {
    try {
        if (!localFilePath) {
            throw new Error("File path is required");
        }

        if (!fs.existsSync(localFilePath)) {
            throw new Error(`File not found: ${localFilePath}`);
        }

        const uploadOptions = {
            resource_type: "auto",
            ...options
        };

        const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return {
            publicId: response.public_id,
            url: response.secure_url,
            format: response.format,
            size: response.bytes
        };

    } catch (error) {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        console.error("Cloudinary upload error:", error.message);
        throw new Error(`Upload failed: ${error.message}`);
    }
};

const deleteOnCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) {
            throw new Error("Public ID is required");
        }

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });

        if (result.result === "not found") {
            return { success: false, message: "File not found" };
        }

        if (result.result === "ok") {
            return { success: true, message: "File deleted successfully" };
        }

        throw new Error(`Unexpected result: ${result.result}`);

    } catch (error) {
        console.error("Cloudinary delete error:", error.message);
        throw new Error(`Delete failed: ${error.message}`);
    }
};

export { uploadOnCloudinary, deleteOnCloudinary };