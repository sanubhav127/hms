import express from "express";
import { createPrescription, getPrescriptionByAppointment } from "../controllers/prescription.controller.js";
import { checkAuthUser } from "../middlewares/CheckAuth.js";
const router = express.Router();

router.post("/", checkAuthUser, createPrescription);
router.get("/:appointmentId", checkAuthUser, getPrescriptionByAppointment);

export default router;