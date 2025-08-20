import mongoose from "mongoose";
export const connectDB = async()=>
{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connect database successfully");
    } catch (error) 
    {
        console.log("failed database connection");
    }
}