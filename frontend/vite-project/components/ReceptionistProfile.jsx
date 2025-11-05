import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut, User, Mail, UserCircle2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const ReceptionistProfile = () => {
    const [Recep, setRecep] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/profile", { withCredentials: true });
        setRecep(res.data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/user/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed!");
    }
  };

    if (!Recep) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="text-lg font-semibold text-gray-700">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-md w-full border border-white/40">
            <div className="left-0 top-0 absolute p-4">
            <button onClick={() => navigate(-1)} className="mr-3">
                <ArrowLeft className="text-black hover:cursor-pointer" size={24} />
            </button> 
            </div>
        {/* Profile Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-sky-500 flex items-center justify-center shadow-lg">
            <UserCircle2 className="w-16 h-16 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            {Recep.fullname}
          </h1>
          <p className="text-gray-500">{Recep.role}</p>
        </div>

        {/* Info Section */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center bg-blue-50 p-3 rounded-xl shadow-sm">
            <User className="text-blue-600 w-5 h-5 mr-3" />
            <span className="text-gray-700 font-medium">{Recep.fullname}</span>
          </div>

          <div className="flex items-center bg-blue-50 p-3 rounded-xl shadow-sm">
            <Mail className="text-blue-600 w-5 h-5 mr-3" />
            <span className="text-gray-700 font-medium">{Recep.email}</span>
          </div>

          <div className="flex items-center bg-blue-50 p-3 rounded-xl shadow-sm">
            <User className="text-blue-600 w-5 h-5 mr-3" />
            <span className="text-gray-700 font-medium">{Recep.role}</span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistProfile;