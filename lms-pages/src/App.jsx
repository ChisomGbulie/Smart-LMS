// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyLearning from './pages/MyLearning';
import MarketInsights from './pages/MarketInsights';
import Jobs from './pages/Jobs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/my-learning" element={<MyLearning />} />
        <Route path="/market-insights" element={<MarketInsights />} />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
    </BrowserRouter>
  )
}