import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  UserPlus,
  CalendarPlus,
  Trash2,
  Edit3,
  User,
  Calendar,
  Stethoscope,
  XCircle,
  Save,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BillGenerator from "./BillGenerator";

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // --- FORM STATES ---
  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
    medicalHistory: "",
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    notes: "",
  });

  // --- EDIT STATES ---
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // --- FETCH DATA ---
const fetchData = async () => {
  setLoading(true);
  try {
    // fetch patients + appointments first (parallel)
    const [patientsRes, appointmentsRes] = await Promise.all([
      axios.get("http://localhost:3000/api/patient", { withCredentials: true }),
      axios.get("http://localhost:3000/api/appointment", { withCredentials: true }),
    ]);

    // normalize patients
    const patientsData = patientsRes.data?.patients ?? patientsRes.data;
    const patientsArray = Array.isArray(patientsData) ? patientsData : [];

    // normalize appointments (controller may return { appointments } or array)
    const apptData = appointmentsRes.data?.appointments ?? appointmentsRes.data;
    const appointmentsArray = Array.isArray(apptData) ? apptData : [];

    // attempt to fetch doctors (best: /user/doctors). If that fails, fallback to /user
    let doctorsArray = [];
    try {
      const doctorsRes = await axios.get("http://localhost:3000/api/user/doctors", { withCredentials: true });
      const d = doctorsRes.data?.doctors ?? doctorsRes.data;
      doctorsArray = Array.isArray(d) ? d : [];
    } catch (err) {
      // fallback: try /api/user (if your backend exposes list of users)
      try {
        const usersRes = await axios.get("http://localhost:3000/api/user/profile", { withCredentials: true });
        const usersData = usersRes.data?.users ?? usersRes.data;
        if (Array.isArray(usersData)) {
          doctorsArray = usersData.filter((u) => (u.role || "").toLowerCase() === "doctor");
        } else {
          doctorsArray = [];
        }
      } catch (err2) {
        console.warn("Could not fetch doctors via /user/doctors or /user:", err2);
        doctorsArray = [];
      }
    }

    // set state
    setPatients(patientsArray);
    setAppointments(appointmentsArray);
    setDoctors(doctorsArray);
  } catch (error) {
    toast.error("Failed to fetch data");
    console.error("fetchData error:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  // --- ADD / UPDATE PATIENT ---
  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        // Update
        const res = await axios.put(
          `http://localhost:3000/api/patient/${editingPatient._id}`,
          patientForm,
          { withCredentials: true }
        );
        setPatients(
          patients.map((p) => (p._id === editingPatient._id ? res.data.patient : p))
        );
        toast.success("Patient updated successfully!");
      } else {
        // Add new
        const res = await axios.post(
          "http://localhost:3000/api/patient/register",
          patientForm,
          { withCredentials: true }
        );
        setPatients([...patients, res.data.patient]);
        toast.success("Patient added successfully!");
      }

      // Reset form
      setPatientForm({
        name: "",
        age: "",
        gender: "",
        contact: "",
        address: "",
        medicalHistory: "",
      });
      setEditingPatient(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error saving patient");
    }
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setPatientForm(patient);
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/patient/${id}`, { withCredentials: true });
      setPatients(patients.filter((p) => p._id !== id));
      toast.success("Patient deleted!");
    } catch (error) {
      toast.error("Error deleting patient");
      console.error(error);
    }
  };

  // --- ADD / UPDATE APPOINTMENT ---
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        // Update
        const res = await axios.put(
          `http://localhost:3000/api/appointment/${editingAppointment._id}`,
          appointmentForm,
          { withCredentials: true }
        );
        setAppointments(
          appointments.map((a) =>
            a._id === editingAppointment._id ? res.data.appointment : a
          )
        );
        toast.success("Appointment updated!");
      } else {
        // Create new
        const res = await axios.post(
          "http://localhost:3000/api/appointment/create",
          appointmentForm,
          { withCredentials: true }
        );
        setAppointments([...appointments, res.data]);
        toast.success("Appointment created!");
        fetchData();
      }

      setAppointmentForm({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        notes: ""
      });
      setEditingAppointment(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving appointment");
      console.error(error);
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setAppointmentForm({
      patientId: appointment.patient?._id || "",
      doctorId: appointment.doctor?._id || "",
      appointmentDate: appointment.appointmentDate.slice(0, 16),
      notes: appointment.notes || "",
    });
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/appointment/${id}`, { withCredentials: true });
      setAppointments(appointments.filter((a) => a._id !== id));
      toast.success("Appointment deleted!");
    } catch (error) {
      toast.error("Error deleting appointment");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-100 p-6">
        <div className="w-full h-30 bg-gradient-to-r from-blue-500 to-indigo-600 mb-6 rounded-lg shadow-lg flex items-center justify-center gap-3">
        <img src="/logo.png" alt="logo" className="h-20 w-20 rounded-lg shadow-xl" />
        <h2 className="text-3xl font-medium text-gray-900 ml-4">Modern Pathology and Diagnostic Centre</h2>
      </div>
      <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Receptionist Dashboard
        </h1>
        <div>
            <Settings onClick={() => navigate("/receptionist/profile")} className="absolute top-6 right-6 text-blue-600 hover:cursor-pointer" size={28} />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          {["patients", "appointments", "unpaid"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all hover:cursor-pointer ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-lg scale-105"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              {tab === "patients"
                  ? "Patients"
                  : tab === "appointments"
                  ? "Appointments"
                  : "Unpaid Appointments"}
            </button>
          ))}
        </div>

        {/* PATIENT MANAGEMENT */}
        {activeTab === "patients" && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Patient Form */}
            <form
              onSubmit={handlePatientSubmit}
              className="bg-white shadow-lg p-6 rounded-2xl border border-blue-100"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <UserPlus /> {editingPatient ? "Edit Patient" : "Add Patient"}
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border rounded-lg p-2"
                  value={patientForm.name}
                  onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  className="w-full border rounded-lg p-2"
                  value={patientForm.age}
                  onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                  required
                />
                <select
                  className="w-full border rounded-lg p-2"
                  value={patientForm.gender}
                  onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input
                  type="text"
                  placeholder="Contact"
                  className="w-full border rounded-lg p-2"
                  value={patientForm.contact}
                  onChange={(e) => setPatientForm({ ...patientForm, contact: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full border rounded-lg p-2"
                  value={patientForm.address}
                  onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Medical History"
                  className="w-full border rounded-lg p-2"
                  value={patientForm.medicalHistory}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, medicalHistory: e.target.value })
                  }
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-sky-600 text-white py-2 rounded-lg hover:scale-105 transition"
                >
                  {editingPatient ? "Update Patient" : "Save Patient"}
                </button>
              </div>
            </form>

            {/* Patient List */}
            <div className="bg-white shadow-lg p-6 rounded-2xl border border-blue-100 max-h-[600px] overflow-y-auto">
              <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <User /> Registered Patients
              </h2>
              {patients.map((p) => (
                <div
                  key={p._id}
                  className="flex justify-between items-center bg-blue-50 rounded-xl p-3 mb-2 hover:bg-blue-100"
                >
                  <div>
                    <p className="font-semibold text-gray-700">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.gender}, {p.age} yrs</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEditPatient(p)} className="text-blue-600">
                      <Edit3 />
                    </button>
                    <button onClick={() => handleDeletePatient(p._id)} className="text-red-500">
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPOINTMENT MANAGEMENT */}
        {activeTab === "appointments" && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Appointment Form */}
            <form
              onSubmit={handleAppointmentSubmit}
              className="bg-white shadow-lg p-6 rounded-2xl border border-blue-100"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <CalendarPlus /> {editingAppointment ? "Edit Appointment" : "Add Appointment"}
              </h2>
              <div className="space-y-3">
                <select
                  className="w-full border rounded-lg p-2"
                  value={appointmentForm.patientId}
                  onChange={(e) =>
                    setAppointmentForm({ ...appointmentForm, patientId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full border rounded-lg p-2"
                  value={appointmentForm.doctorId}
                  onChange={(e) =>
                    setAppointmentForm({ ...appointmentForm, doctorId: e.target.value })
                  }
                  required
                >
                  <option value="">Assign Doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.fullname}
                    </option>
                  ))}
                </select>

                <input
                  type="datetime-local"
                  className="w-full border rounded-lg p-2"
                  value={appointmentForm.appointmentDate}
                  onChange={(e) =>
                    setAppointmentForm({ ...appointmentForm, appointmentDate: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Notes"
                  className="w-full border rounded-lg p-2"
                  value={appointmentForm.notes}
                  onChange={(e) =>
                    setAppointmentForm({ ...appointmentForm, notes: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:scale-105 transition"
                >
                  {editingAppointment ? "Update Appointment" : "Save Appointment"}
                </button>
              </div>
            </form>

            {/* Appointment List */}
            <div className="bg-white shadow-lg p-6 rounded-2xl border border-blue-100 max-h-[600px] overflow-y-auto">
              <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <Calendar /> All Appointments
              </h2>
              {appointments.map((a) => (
                <div
                  key={a._id}
                  className="flex justify-between items-center bg-blue-50 rounded-xl p-3 mb-2 hover:bg-blue-100"
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      {a.patient?.name || "Patient"} → {a.doctor?.fullname || "Doctor"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(a.appointmentDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEditAppointment(a)} className="text-blue-600 hover:cursor-pointer">
                      <Edit3 />
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(a._id)}
                      className="text-red-500 hover:cursor-pointer"
                    >
                      <Trash2 />
                    </button>
                    <p>{a.bill?.status === "Paid" ? (
                      <span className="text-green-600 bg-green-100 px-2 py-1 rounded-md">Paid</span>
                    ) : (
                      <span className="text-red-600 bg-red-100 px-2 py-1 rounded-md">Unpaid</span>
                    )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BILL MANAGEMENT */}
        {activeTab === "unpaid" && (
        <div className="max-w-5xl mx-auto bg-white shadow-lg p-8 rounded-2xl border border-blue-100">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center gap-2">
        <Calendar /> Unpaid Appointments
        </h2>

      {appointments.filter((a) => a.bill?.status !== "Paid").length === 0 ? (
      <p className="text-gray-500 text-center">All appointments are paid ✅</p>
      ) : (
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {appointments
          .filter((a) => a.bill?.status !== "Paid")
          .map((a) => (
            <div
              key={a._id}
              className="flex justify-between items-center bg-blue-50 rounded-xl p-4 hover:bg-blue-100"
            >
              <div>
                <p className="font-semibold text-gray-700">
                  {a.patient?.name || "Patient"} → {a.doctor?.fullname || "Doctor"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(a.appointmentDate).toLocaleString()}
                </p>
                <p className="text-sm mt-1">
                  <span className="text-red-600 bg-red-100 px-2 py-1 rounded-md">
                    {a.bill?.status || "Unpaid"}
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedAppointment(a);
                  setIsBillOpen(true);
                }}
                className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Pay
              </button>
            </div>
          ))}
      </div>
    )}
  </div>
)}
      {/* BILL MODAL */}
      <BillGenerator
        isOpen={isBillOpen}
        onClose={() => {
          setIsBillOpen(false);
          fetchData(); // refresh after payment
        }}
        appointment={selectedAppointment}
      />

      </div>

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;