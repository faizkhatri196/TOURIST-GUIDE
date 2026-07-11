import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lets_travel_world';
export let isDBConnected = false;
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        isDBConnected = true;
        console.log("🟢 Connected to MongoDB Atlas successfully");
    }
    catch (error) {
        console.error("🔴 MongoDB connection failed:", error);
        console.log("⚠️ Running server in local sandbox/offline simulation mode. DB queries will fallback to static local data.");
    }
};
