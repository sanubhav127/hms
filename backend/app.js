import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "./src/db/db.js";
import userRoutes from "./src/routes/user.route.js";
import patientRoutes from "./src/routes/patient.route.js";
import appointmentRoutes from "./src/routes/appointment.route.js";
import prescriptionRoutes from "./src/routes/prescription.route.js";
import billRoutes from "./src/routes/bill.route.js";

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/user", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/bill", billRoutes);

server.listen(PORT, ()=>{
    console.log(`Server is running on Port : ${PORT}`);
    connect();
});