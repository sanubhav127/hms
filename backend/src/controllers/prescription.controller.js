import Prescription from "../models/prescription.model.js";

export const createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create(req.body);
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Error creating prescription", error });
  }
};

export const getPrescriptionByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const prescription = await Prescription.findOne({ appointmentId })
      .populate("patientId doctorId");
    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescription", error });
  }
};
