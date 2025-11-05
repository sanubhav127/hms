import express from "express";
import { getAllDoctors, getProfile, getUserById, login, logout, signup } from "../controllers/user.controller.js";
import { checkAuthUser } from "../middlewares/CheckAuth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/doctors", checkAuthUser, getAllDoctors);
router.get("/profile", checkAuthUser, getProfile);
router.get("/:id", checkAuthUser, getUserById);

export default router;