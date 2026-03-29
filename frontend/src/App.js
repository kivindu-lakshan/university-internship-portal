import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'

import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'

import HomePage from './pages/HomePage'
import { LoginPage } from './components/auth/LoginPage'
import { RegisterPage } from './components/auth/RegisterPage'
import { VerifyEmailPage } from './components/auth/VerifyEmailPage'

import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfilePage from './pages/student/StudentProfilePage'
import MyApplicationsPage from './pages/student/MyApplicationsPage'
import JobDetailsPage from './pages/student/JobDetailsPage'
import ApplicationFormPage from './pages/student/ApplicationFormPage'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    }
                />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/profile"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <StudentProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/applications"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <MyApplicationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/jobs/:id"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <JobDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/apply/:jobId"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <ApplicationFormPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    )
}

export default App