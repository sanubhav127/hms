import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";
import Bill from "../models/billing.model.js";

export const createAppointment = async (req, res) => {
    const { patientId, doctorId, appointmentDate, notes } = req.body;

    try {
        const patient = await Patient.findById(patientId);
        const doctor = await User.findById(doctorId);

        if (!patient || !doctor) {
            return res.status(404).json({ message: "Patient or Doctor not found" });
        }

        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            appointmentDate,
            notes,
            createdBy: req.user._id
        });

        await appointment.save();

            // Step 2: Create a linked bill for this appointment
            const bill = new Bill({
            patientId,
            doctorId,
            appointmentId: appointment._id,
            consultationFee: 500,
            medicineCharges: 0,
            testCharges: 0,
            totalAmount: 500, // initial total (can update later)
            status: "Unpaid",
            });

        await bill.save();
        appointment.bill = bill._id;
        await appointment.save();
        res.status(201).json({ message: "Appointment created successfully", appointment });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient', 'name age gender contact medicalHistory')
            .populate('doctor', 'fullname email')
            .populate('createdBy', 'fullname email')
            .populate('bill', 'status');

        res.status(200).json({ message: "Appointments fetched successfully", appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAppointmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findById(id)
            .populate('patient', 'name age gender contact')
            .populate('doctor', 'fullname email')
            .populate('createdBy', 'fullname email')
            .populate('bill', 'status');

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment fetched successfully", appointment });
    } catch (error) {
        console.error("Error fetching appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { appointmentDate, status, notes } = req.body;

    const updateData = {};
    if (appointmentDate !== undefined) updateData.appointmentDate = appointmentDate;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    try {
        const appointment = await Appointment.findByIdAndUpdate(id, updateData, { new: true });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment updated successfully", appointment });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteAppointment = async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findByIdAndDelete(id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};