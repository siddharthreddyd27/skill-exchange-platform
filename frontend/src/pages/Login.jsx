import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftRight, Lock, User, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(usernameOrEmail, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid username or password. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (u, p) => {
    setUsernameOrEmail(u);
    setPassword(p);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200 mb-4">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back to SkillExchange
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to manage your skills and connect with peers
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="e.g. demouser or demo@skillexchange.io"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </form>

        {/* 1-Click Demo Logins */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Fast 1-Click Demo Accounts:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill('demouser', 'Password@123')}
              className="p-2 text-left rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-colors"
            >
              <p className="font-bold text-slate-800">Alex Morgan</p>
              <p className="text-[11px] text-slate-500">Full-Stack Dev</p>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('sophiac', 'Password@123')}
              className="p-2 text-left rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-colors"
            >
              <p className="font-bold text-slate-800">Sophia Chen</p>
              <p className="text-[11px] text-slate-500">UI/UX & Guitar</p>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('carlosm', 'Password@123')}
              className="p-2 text-left rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-colors"
            >
              <p className="font-bold text-slate-800">Carlos Mendoza</p>
              <p className="text-[11px] text-slate-500">Spanish & Photo</p>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('priyas', 'Password@123')}
              className="p-2 text-left rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-colors"
            >
              <p className="font-bold text-slate-800">Priya Sharma</p>
              <p className="text-[11px] text-slate-500">Python & ML</p>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
