import Patient from "../models/patient.model.js";

export const registerPatient = async (req, res) => {
    const { name, age, gender, contact, address, medicalHistory } = req.body;
    try {
        if (!name || !age || !gender || !contact || !address) {
            return res.status(400).json({ message: "All fields except medical history are mandatory!" });
        }
        const newPatient = new Patient({
            name,
            age,
            gender,
            contact,
            address,
            medicalHistory,
            registeredBy: req.user._id, // Assuming req.user is set by authentication middleware
        });
        await newPatient.save();
        return res.status(201).json({ message: "Patient registered successfully!", patient: newPatient });
    } catch (error) {
        console.error("Error registering patient:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('registeredBy', 'fullname email role');
        return res.status(200).json(patients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await Patient.findById(id).populate('registeredBy', 'fullname email role');
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { name, age, gender, contact, address, medicalHistory } = req.body;
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(id, {
            name,
            age,
            gender,
            contact,
            address,
            medicalHistory
        }, { new: true });
        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json({ message: "Patient updated successfully!", patient: updatedPatient });
    } catch (error) {
        console.error("Error updating patient:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deletePatient = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPatient = await Patient.findByIdAndDelete(id);
        if (!deletedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json({ message: "Patient deleted successfully!", patient: deletedPatient });
    } catch (error) {
        console.error("Error deleting patient:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};