import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload"
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
const app = express();
dotenv.config();
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir: "./temp/"
    })
)
app.use('/api/v1/user',userRouter)
app.use('/api/v1/message',messageRouter)
connectDB();
export default app;