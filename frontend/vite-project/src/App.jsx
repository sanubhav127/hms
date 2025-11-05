import React, { use } from 'react'
import SignupPage from '../pages/SignupPage'
import { Toaster } from 'react-hot-toast'
import LoginPage from '../pages/LoginPage'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import DoctorDashboard from '../components/DoctorDashboard'
import ReceptionistDashboard from '../components/ReceptionistDashboard'
import DoctorProfile from '../components/DoctorProfile'
import ReceptionistProfile from '../components/ReceptionistProfile'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<Dashboard />} />
        <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
        <Route path='/receptionist/dashboard' element={<ReceptionistDashboard />} />
        <Route path='/doctor/profile' element={<DoctorProfile />} />  
        <Route path='/receptionist/profile' element={<ReceptionistProfile />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
