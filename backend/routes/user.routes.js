import express from "express";
import { getUser, signin, signout, signup, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/sign-up",signup)
userRouter.post("/sign-in",signin)
userRouter.get("/sign-out",isAuthenticated,signout)
userRouter.get("/me",isAuthenticated,getUser)
userRouter.put("/update-profile",isAuthenticated,updateProfile);

export default userRouter;