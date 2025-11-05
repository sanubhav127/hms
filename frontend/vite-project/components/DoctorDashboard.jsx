import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Prescription from "./Prescription";

const POLL_INTERVAL = 90000;

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Scheduled");
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:3000/api/appointment", {
        withCredentials: true,
      });

      if (res?.data?.appointments) {
        const normalized = res.data.appointments.map((a) => ({
          ...a,
          createdAt: a.createdAt ? new Date(a.createdAt) : null,
          updatedAt: a.updatedAt ? new Date(a.updatedAt) : null,
          appointmentDate: a.appointmentDate ? new Date(a.appointmentDate) : null,
        }));
        setAppointments(normalized);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    intervalRef.current = setInterval(fetchAppointments, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/profile", {
          withCredentials: true,
        });
        setDoctor(res.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const today = new Date();

  const isSameDate = (d1, d2) => dayjs(d1).isSame(dayjs(d2), "day");

  const counts = useMemo(() => {
    const totalAppointmentsForToday = appointments.filter((a) =>
      a.appointmentDate ? isSameDate(a.appointmentDate, today) : false
    ).length;
    const pendingConsultation = appointments.filter((a) => a.status === "Scheduled").length;
    const completed = appointments.filter((a) => a.status === "Completed").length;
    const todaysCreated = appointments.filter((a) =>
      a.createdAt ? isSameDate(a.createdAt, today) : false
    ).length;

    return {
      totalAppointmentsForToday,
      pendingConsultation,
      completed,
      todaysCreated,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const lowerQ = query.trim().toLowerCase();
    const filtered = appointments.filter((a) => {
      if (activeTab === "Scheduled" && a.status !== "Scheduled") return false;
      if (activeTab === "Completed" && a.status !== "Completed") return false;
      if (activeTab === "Canceled" && a.status !== "Canceled") return false;
      if (!lowerQ) return true;

      const patientName = a.patient?.name || "";
      const contact = a.patient?.contact ? String(a.patient.contact) : "";
      return (
        patientName.toLowerCase().includes(lowerQ) ||
        contact.includes(lowerQ)
      );
    });

    filtered.sort((x, y) => new Date(x.appointmentDate) - new Date(y.appointmentDate));
    return filtered;
  }, [appointments, activeTab, query]);

  const updateStatus = async (id, status) => {
    try {
      const appt = appointments.find((a) => a._id === id);
      if (!appt) return;

      await axios.put(
        `http://localhost:3000/api/appointment/${id}`,
        {
          appointmentDate: appt.appointmentDate,
          status,
          notes: appt.notes || "",
        },
        { withCredentials: true }
      );

      setAppointments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status } : p))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update appointment status");
    }
  };

  const handleMarkCompleted = (id) => updateStatus(id, "Completed");
  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      updateStatus(id, "Cancelled");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointmentId(null);
  };   

  const handleOpenModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full h-30 bg-gradient-to-r from-blue-500 to-indigo-600 mb-6 rounded-lg shadow-lg flex items-center justify-center gap-3">
        <img src="/logo.png" alt="logo" className="h-20 w-20 rounded-lg shadow-xl" />
        <h2 className="text-3xl font-medium text-gray-900 ml-4">Modern Pathology and Diagnostic Centre</h2>
      </div>
      <header className="mb-6 mt-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium italic text-slate-900">
            Welcome, Dr. {doctor?.fullname}
          </h1>
          <p className="text-sm text-slate-600">Manage your appointments and patient care</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">{dayjs().format("dddd, MMMM D, YYYY")}</p>
          <div
            onClick={() => navigate("/doctor/profile")}
            className="mt-1 inline-flex items-center px-3 py-1 rounded-full bg-white/60 shadow-sm hover:bg-blue-50 cursor-pointer"
          >
            <span className="text-sm font-medium">Good Afternoon</span>
            <div className="ml-3 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
              D
            </div>
          </div>
        </div>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Today's Appointments" value={counts.todaysCreated} description="Latest created by reception" icon={<CalendarDaysIcon className="w-6 h-6" />} />
        <StatCard title="Completed Today" value={counts.completed} description="Consultations done" icon={<CheckCircleIcon className="w-6 h-6" />} />
        <StatCard title="Pending Consultation" value={counts.pendingConsultation} description="Awaiting patients" icon={<ClockIcon className="w-6 h-6" />} />
        <StatCard title="Total Patients" value={counts.totalAppointmentsForToday} description="Appointments today" icon={<UserGroupIcon className="w-6 h-6" />} />
      </div>

      {/* APPOINTMENTS LIST */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Appointments</h2>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient..."
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="divide-y border-t">
          {filteredAppointments.map((a) => (
            <div key={a._id} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-slate-800">{a.patient?.name}</div>
                    <span className="text-xs text-slate-500">
                      ({a.patient?.gender}, {a.patient?.age})
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {dayjs(a.appointmentDate).format("DD MMM, hh:mm A")}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Contact: {a.patient?.contact} • Booked by: {a.createdBy?.fullname || "Reception"}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-sm px-3 py-1 rounded-full ${statusBadgeClass(a.status)}`}>{a.status}</span>
                  {a.status === "Scheduled" && (
                    <>
                      <button onClick={() => handleMarkCompleted(a._id)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 hover:cursor-pointer">
                        Complete
                      </button>
                      <button onClick={() => handleCancel(a._id)} className="bg-red-100 text-red-600 px-3 py-1 rounded-md border hover:bg-red-200 hover:cursor-pointer">
                        Cancel
                      </button>
                    </>
                  )}
                   <button
                    onClick={() => { handleOpenModal(a._id) }}
                    className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition hover:cursor-pointer"
                  >
                    Prescribe
                  </button>
                  <button
                    onClick={() => setExpandedId(expandedId === a._id ? null : a._id)}
                    className="text-xs text-blue-600 underline hover:cursor-pointer"
                  >
                    {expandedId === a._id ? "Hide" : "View"}
                  </button>
                </div>
              </div>

              {expandedId === a._id && (
                <div className="mt-3 bg-slate-50 p-4 rounded-lg text-sm text-slate-700">
                  <div><strong>Medical History:</strong> {a.patient?.medicalHistory || "N/A"}</div>
                  <div><strong>Notes:</strong> {a.notes || "N/A"}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

       {/* MODAL */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Create Prescription
                  </Dialog.Title>

                  <Prescription
                    appointmentId={selectedAppointmentId}
                    onClose={handleCloseModal}
                  />

                  <div className="mt-4 text-right">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
    </div>
  );
}

/* --- Small Components --- */
function StatCard({ title, value, description, icon }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-sm text-slate-400 mt-1">{description}</div>
      </div>
      <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">{icon}</div>
    </div>
  );
}

function statusBadgeClass(status) {
  switch (status) {
    case "Scheduled":
      return "bg-yellow-50 text-yellow-800 border border-yellow-100";
    case "Completed":
      return "bg-green-50 text-green-800 border border-green-100";
    case "Cancelled":
      return "bg-red-50 text-red-700 border border-red-100";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-100";
  }
}
