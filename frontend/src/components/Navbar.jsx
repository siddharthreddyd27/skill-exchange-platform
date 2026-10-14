import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeftRight, 
  Compass, 
  LayoutDashboard, 
  Sparkles, 
  Users, 
  BookOpen, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-indigo-600 bg-indigo-50 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2.5 text-base font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-indigo-600 bg-indigo-50 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Primary Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
                  SkillExchange
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600 -mt-1">
                  Peer-to-Peer Learning
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex md:items-center md:space-x-1 ml-6">
              <NavLink to="/discover" className={navLinkClass}>
                <Compass className="w-4 h-4 mr-1.5 text-indigo-500" />
                Discover
              </NavLink>

              {isAuthenticated && (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <LayoutDashboard className="w-4 h-4 mr-1.5 text-indigo-500" />
                    Dashboard
                  </NavLink>

                  <NavLink to="/my-skills" className={navLinkClass}>
                    <Sparkles className="w-4 h-4 mr-1.5 text-indigo-500" />
                    My Skills
                  </NavLink>

                  <NavLink to="/connections" className={navLinkClass}>
                    <Users className="w-4 h-4 mr-1.5 text-indigo-500" />
                    Connections
                  </NavLink>

                  <NavLink to="/exchanges" className={navLinkClass}>
                    <BookOpen className="w-4 h-4 mr-1.5 text-indigo-500" />
                    Exchanges
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all"
                  title="View your profile"
                >
                  <img
                    src={
                      user?.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.fullName || 'User'
                      )}&background=4f46e5&color=fff`
                    }
                    alt={user?.fullName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">
                      {user?.fullName}
                    </p>
                    <p className="text-slate-500 text-[11px] leading-tight">
                      @{user?.username}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs shadow-indigo-200 hover:shadow-indigo-300 transition-all"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <NavLink
            to="/discover"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            <Compass className="w-5 h-5 mr-3 text-indigo-500" />
            Discover Skills & Peers
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <LayoutDashboard className="w-5 h-5 mr-3 text-indigo-500" />
                Dashboard
              </NavLink>

              <NavLink
                to="/my-skills"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <Sparkles className="w-5 h-5 mr-3 text-indigo-500" />
                My Skills (Teach & Learn)
              </NavLink>

              <NavLink
                to="/connections"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <Users className="w-5 h-5 mr-3 text-indigo-500" />
                Connections
              </NavLink>

              <NavLink
                to="/exchanges"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <BookOpen className="w-5 h-5 mr-3 text-indigo-500" />
                Skill Exchanges
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <User className="w-5 h-5 mr-3 text-indigo-500" />
                My Profile
              </NavLink>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center px-4 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
