import { useState } from 'react';
import { X, Send, UserPlus, Sparkles } from 'lucide-react';
import { connectionService } from '../services/connectionService';

export default function ConnectModal({ user, onClose, onSuccess }) {
  const [message, setMessage] = useState(
    `Hi ${user.fullName}, I noticed your skills and would love to connect to exchange knowledge and practice together!`
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await connectionService.sendRequest(user.id, message);
      onSuccess?.(`Connection request sent to ${user.fullName}!`);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send connection request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Connect with Peer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* User Preview */}
          <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <img
              src={
                user.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.fullName || 'User'
                )}&background=4f46e5&color=fff`
              }
              alt={user.fullName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-200"
            />
            <div>
              <p className="font-bold text-slate-900 text-sm">{user.fullName}</p>
              <p className="text-xs text-slate-500">@{user.username}</p>
              {user.teachingSkills && user.teachingSkills.length > 0 && (
                <div className="flex items-center space-x-1 mt-1 text-[11px] text-indigo-700 font-medium">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>Teaches: {user.teachingSkills.map((s) => s.skillName).join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Personalized Intro Message
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and specify what skills you'd like to share or learn..."
              className="w-full text-sm rounded-xl border border-slate-200 p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              maxLength={500}
            />
            <p className="text-right text-[11px] text-slate-400 mt-1">
              {message.length}/500
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-200 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
