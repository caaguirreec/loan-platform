import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import EmployeePortal from './pages/EmployeePortal'
import CompanyPortal from './pages/CompanyPortal'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/employee" element={<EmployeePortal />} />
        <Route path="/company" element={<CompanyPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App 