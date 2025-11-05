// models/bill.model.js
import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  consultationFee: { type: Number, default: 500 },
  medicineCharges: { type: Number },
  testCharges: { type: Number },
  totalAmount: { type: Number },
  status: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
  createdAt: { type: Date, default: Date.now },
});

billSchema.pre("save", function (next) {
  this.totalAmount =
    (this.consultationFee || 0) +
    (this.medicineCharges || 0) +
    (this.testCharges || 0);
  next();
});

const Bill = mongoose.model("Bill", billSchema);
export default Bill;