import dotenv from "dotenv";

dotenv.config();

export const MONGODB = process.env.MONGODB_URI;
export const ACCESS = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH = process.env.REFRESH_TOKEN_SECRET;
export const PORT = process.env.PORT || 8000;