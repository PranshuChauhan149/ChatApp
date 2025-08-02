import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
} from "../Controllers/userController.js";
import { protectRoute } from "../middlewares/auth.js";
const userRoute = express.Router();
userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.put("/update-profile", protectRoute, updateProfile);
userRoute.get("/check", protectRoute, checkAuth);

export default userRoute;
