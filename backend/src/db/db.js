import mongoose from "mongoose";

export const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected/Connected to database");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};