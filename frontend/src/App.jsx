import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import MySkills from './pages/MySkills';
import Connections from './pages/Connections';
import Exchanges from './pages/Exchanges';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/discover" element={<Discover />} />

              {/* Protected Member Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-skills"
                element={
                  <ProtectedRoute>
                    <MySkills />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/connections"
                element={
                  <ProtectedRoute>
                    <Connections />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exchanges"
                element={
                  <ProtectedRoute>
                    <Exchanges />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
