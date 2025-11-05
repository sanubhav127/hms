import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female'],
    },
    contact: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    medicalHistory: {
        type: String,
        default: 'N/A',
    },
    // Link to the user (receptionist/admin) who registered the patient
    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;