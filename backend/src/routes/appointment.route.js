import express from "express";
import { createAppointment, deleteAppointment, getAllAppointments, getAppointmentById, updateAppointment } from "../controllers/appointment.controller.js";
import { checkAuthUser } from "../middlewares/CheckAuth.js";
const router = express.Router();

router.post("/create", checkAuthUser, createAppointment);
router.get("/", checkAuthUser, getAllAppointments);
router.get("/:id", checkAuthUser, getAppointmentById);
router.put("/:id", checkAuthUser, updateAppointment);
router.delete("/:id", checkAuthUser, deleteAppointment);

export default router;