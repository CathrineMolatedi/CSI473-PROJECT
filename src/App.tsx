// App.tsx (Updated)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import OfficerDashboard from './pages/OfficerDashboard';
import EnhancedResidentDashboard from './pages/ResidentDashboard';
import EnhancedAdminDashboard from './pages/AdminDashboard';
import Scanner from './pages/Scanner';
import TwoFactorAuth from './components/TwoFactorAuth';
import './styles/globals.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/2fa" element={<TwoFactorAuth />} />
          <Route path="/dashboard/officer" element={<OfficerDashboard />} />
          <Route path="/dashboard/resident" element={<EnhancedResidentDashboard />} />
          <Route path="/dashboard/admin" element={<EnhancedAdminDashboard />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/history" element={<Navigate to="/dashboard/officer" replace />} />
          <Route path="/profile" element={<Navigate to="/dashboard/officer" replace />} />
          <Route path="/forum" element={<Navigate to="/dashboard/resident" replace />} />
          <Route path="/payments" element={<Navigate to="/dashboard/resident" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}