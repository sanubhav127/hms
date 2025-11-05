import express from "express";
import { createBill, getAllBills, getBillByAppointment, updateBill } from "../controllers/bill.controller.js";
import { checkAuthUser } from "../middlewares/CheckAuth.js";

const router = express.Router();

router.post("/create", checkAuthUser, createBill);
router.get("/", checkAuthUser, getAllBills);
router.get("/:id", checkAuthUser, getBillByAppointment);
router.put("/:id", checkAuthUser, updateBill);

export default router;