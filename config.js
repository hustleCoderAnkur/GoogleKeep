import dotenv from "dotenv";

dotenv.config();

export const config = {
    MONGODB: process.env.MONGODB_URI,
    PORT: process.env.PORT || 8000
};