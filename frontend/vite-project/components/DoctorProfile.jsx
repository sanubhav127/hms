import React, { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, Mail, User, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  // Fetch doctor's profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/profile", { withCredentials: true });
        setDoctor(res.data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/user/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="text-lg font-semibold text-gray-700">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-200 flex flex-col items-center py-12 px-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-transparent to-blue-100 opacity-70 pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 flex flex-col items-center text-center">
            <div className="left-0 top-0 absolute p-4">
            <button onClick={() => navigate(-1)} className="mr-3">
                <ArrowLeft className="text-black hover:cursor-pointer" size={24} />
            </button> 
            </div>
          <div className="w-28 h-28 bg-gradient-to-tr from-blue-500 to-sky-400 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
            {doctor.fullname?.charAt(0) || "D"}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dr. {doctor.fullname}
          </h1>
          <p className="text-blue-500 font-medium mt-1">{doctor.role}</p>
        </div>

        {/* Info Section */}
        <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
            <Mail className="text-blue-500" size={22} />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800 font-semibold">{doctor.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
            <User className="text-blue-500" size={22} />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-gray-800 font-semibold">{doctor.fullname}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
            <Shield className="text-blue-500" size={22} />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-gray-800 font-semibold">{doctor.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
            <p className="text-blue-500 font-semibold">Joined On:</p>
            <p className="text-gray-800">
              {new Date(doctor.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="relative z-10 flex justify-center mt-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-sky-400 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105 hover:cursor-pointer"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

/*   */