import Bill from "../models/billing.model.js";

export const createBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    await bill.save(); 
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Error creating bill", error });
  }
};

export const getBillByAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findOne({ appointmentId: id })
      .populate("patientId doctorId");
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bill", error });
  }
};

export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const bill = await Bill.findByIdAndUpdate(id, updatedData, { new: true });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json({ message: "Bill updated successfully", bill });
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate("patientId doctorId appointmentId");
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bills", error });
  }
};