import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Prescription = ({ appointmentId, onClose }) => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    diagnosis: "",
    advice: "",
    medicines: [{ name: "", dosage: "", duration: "", instructions: "" }],
  });

  // ✅ Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/appointment/${appointmentId}`,
          { withCredentials: true }
        );

        // handle both response formats
        setAppointment(res.data.appointment || res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch appointment details");
      } finally {
        setLoading(false);
      }
    };
    if (appointmentId) fetchAppointment();
  }, [appointmentId]);

  // ✅ Handle medicine field change
  const handleMedicineChange = (index, field, value) => {
    const updated = [...formData.medicines];
    updated[index][field] = value;
    setFormData({ ...formData, medicines: updated });
  };

  // ✅ Add new medicine row
  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { name: "", dosage: "", duration: "", instructions: "" },
      ],
    });
  };

  // ✅ Submit prescription
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointment) return toast.error("Appointment not loaded");

    const payload = {
      appointmentId,
      patientId: appointment.patient?._id,
      doctorId: appointment.doctor?._id,
      ...formData,
    };

    try {
      setSaving(true);
      await axios.post("http://localhost:3000/api/prescription", payload, {
        withCredentials: true,
      });
      toast.success("Prescription saved successfully!");
      onClose?.(); // ✅ Close modal if provided
    } catch (error) {
      console.error(error);
      toast.error("Failed to save prescription");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-b from-blue-100 to-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">
          🩺 Create Prescription
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-600 text-xl font-semibold hover:cursor-pointer"
        >
          ✕
        </button>
      </div>

      {appointment && (
        <div className="mb-4 text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p>
            <strong>Patient:</strong> {appointment.patient?.name}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(appointment.appointmentDate).toLocaleDateString()}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Diagnosis */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Diagnosis
          </label>
          <textarea
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            rows={2}
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData({ ...formData, diagnosis: e.target.value })
            }
          />
        </div>

        {/* Advice */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Advice</label>
          <textarea
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            rows={2}
            value={formData.advice}
            onChange={(e) =>
              setFormData({ ...formData, advice: e.target.value })
            }
          />
        </div>

        {/* Medicines */}
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            Medicines
          </h3>
          {formData.medicines.map((med, index) => (
            <div key={index} className="grid grid-cols-4 gap-3 mb-3">
              <input
                placeholder="Name"
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                value={med.name}
                onChange={(e) =>
                  handleMedicineChange(index, "name", e.target.value)
                }
              />
              <input
                placeholder="Dosage"
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                value={med.dosage}
                onChange={(e) =>
                  handleMedicineChange(index, "dosage", e.target.value)
                }
              />
              <input
                placeholder="Duration"
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                value={med.duration}
                onChange={(e) =>
                  handleMedicineChange(index, "duration", e.target.value)
                }
              />
              <input
                placeholder="Instructions"
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                value={med.instructions}
                onChange={(e) =>
                  handleMedicineChange(index, "instructions", e.target.value)
                }
              />
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"
            onClick={addMedicine}
          >
            + Add Medicine
          </button>
        </div>

        {/* Submit */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-lg text-white transition ${
              saving
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving ? "Saving..." : "Save Prescription"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Prescription;