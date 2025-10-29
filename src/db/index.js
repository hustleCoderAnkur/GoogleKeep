import mongoose from "mongoose";
import { MONGODB } from "../../config.js";

const dbconnect = async () => {
    try {
        const connection = await mongoose.connect(MONGODB);
        console.log(` MongoDB connected: ${connection.connection.host}`)
    } catch (error) {
        console.error(" MongoDB connection Failed:", error.message)
        process.exit(1);
    }
};

export default dbconnect;

