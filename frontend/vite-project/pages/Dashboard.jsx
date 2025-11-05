import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import DoctorDashboard from "../components/DoctorDashboard";
import ReceptionistDashboard from "../components/ReceptionistDashboard";

export default function MainDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:3000/api";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${API}/user/profile`, {
          withCredentials: true,
        });
        console.log("User profile data:", res.data);
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
        <Loader2 className="animate-spin text-blue-600" size={36} />
        <p className="text-gray-600 mt-2">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-red-200">
        <h1 className="text-2xl font-semibold text-red-700">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mt-2">Please login to continue.</p>
      </div>
    );
  }

  // Dynamic role-based rendering
  return (
    <>
      
      {user?.role === "doctor" && <DoctorDashboard />}
      {user?.role === "receptionist" && <ReceptionistDashboard />}
    </>
  );
}