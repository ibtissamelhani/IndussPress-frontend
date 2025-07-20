import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import './index.css'
import './App.css'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import ArticleForm from './components/dashboard/ArticleForm.jsx'
import DashboardLayout from './components/dashboard/DashboardLayout.jsx'
import ArticleDetails from './components/dashboard/ArticleDetails.jsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
       
          <Route
            path="/dashboard/*"
            element={
             
                <DashboardLayout>
                  <Routes>
                    {/* Dashboard Home */}
                    <Route index element={<Dashboard />} />
                    <Route path="create" element={<ArticleForm />} />
                    <Route path="articles/:id" element={<ArticleDetails />} />
                 </Routes>
                </DashboardLayout>
            }
          />
      </Routes>
    </Router>
  )
}

export default App
