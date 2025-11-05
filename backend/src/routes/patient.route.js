import express from "express";
import { deletePatient, getAllPatients, getPatientById, registerPatient, updatePatient } from "../controllers/patient.controller.js";
import { checkAuthUser } from "../middlewares/CheckAuth.js";
const router = express.Router();

router.post("/register", checkAuthUser, registerPatient);
router.get("/", checkAuthUser, getAllPatients);
router.get("/:id", checkAuthUser, getPatientById);
router.put("/:id", checkAuthUser, updatePatient);
router.delete("/:id", checkAuthUser, deletePatient);

export default router;