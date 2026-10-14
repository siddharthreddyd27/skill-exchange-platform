import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftRight, User, Mail, Lock, MapPin, Tag, FileText, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    bio: '',
    interests: '',
    location: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please check your information.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200 mb-3">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Your Free Account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Join the peer-to-peer informal skill sharing community
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Jordan Smith"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Username *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. jordansmith"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jordan@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password * (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                minLength={6}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Chicago, IL"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Interests / Topics
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="Coding, Spanish, Guitar"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Short Bio
            </label>
            <div className="relative">
              <textarea
                name="bio"
                rows={2}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell potential skill exchange partners about yourself..."
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? 'Creating account...' : 'Complete Registration'}
            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
