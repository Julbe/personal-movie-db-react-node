import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: process.env.PORT || 3000,
    omdbApiKey: process.env.OMDB_API_KEY,
    omdbBaseUrl: process.env.OMDB_BASE_URL,
}