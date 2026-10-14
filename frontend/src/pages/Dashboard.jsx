import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { connectionService } from '../services/connectionService';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import ConnectModal from '../components/ConnectModal';
import ProposeExchangeModal from '../components/ProposeExchangeModal';
import UserProfileModal from '../components/UserProfileModal';
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  Check, 
  X, 
  Plus, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Search, 
  Calendar 
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Modals state
  const [connectUser, setConnectUser] = useState(null);
  const [proposePartner, setProposePartner] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  const loadDashboard = async () => {
    try {
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to load dashboard data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRespondRequest = async (requestId, status, senderName) => {
    try {
      await connectionService.respondToRequest(requestId, status);
      setAlert({
        type: 'success',
        message:
          status === 'ACCEPTED'
            ? `Connected with ${senderName}! You can now coordinate skill exchanges.`
            : `Declined connection request from ${senderName}.`,
      });
      loadDashboard();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update request',
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Welcome & Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <img
              src={
                stats?.profile?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.fullName || 'User'
                )}&background=4f46e5&color=fff`
              }
              alt={user?.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome, {user?.fullName}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Peer Member
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                @{user?.username} • {stats?.profile?.email}
              </p>
              {stats?.profile?.bio && (
                <p className="text-xs text-slate-600 mt-2 max-w-xl line-clamp-2">
                  {stats.profile.bio}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/my-skills"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Manage Skills
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Skills I Teach */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {stats?.totalTeachingSkills || 0}
            </p>
            <p className="text-xs font-medium text-slate-500">Skills I Teach</p>
          </div>
        </div>

        {/* Skills to Learn */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {stats?.totalLearningSkills || 0}
            </p>
            <p className="text-xs font-medium text-slate-500">Skills to Learn</p>
          </div>
        </div>

        {/* Connections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {stats?.totalConnections || 0}
            </p>
            <p className="text-xs font-medium text-slate-500">
              Connected Peers{' '}
              {stats?.pendingIncomingRequests > 0 && (
                <span className="text-[10px] font-bold text-rose-600">
                  ({stats.pendingIncomingRequests} new)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Active Exchanges */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {stats?.activeExchanges || 0}
            </p>
            <p className="text-xs font-medium text-slate-500">Active Exchanges</p>
          </div>
        </div>
      </div>

      {/* Pending Incoming Connection Requests Banner */}
      {stats?.recentIncomingRequests && stats.recentIncomingRequests.filter(r => r.status === 'PENDING').length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Incoming Connection Requests Pending Your Action</span>
            </h3>
            <Link
              to="/connections"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center"
            >
              View All ({stats.pendingIncomingRequests})
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {stats.recentIncomingRequests
              .filter((r) => r.status === 'PENDING')
              .map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl p-3.5 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        req.senderAvatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          req.senderFullName || 'User'
                        )}&background=4f46e5&color=fff`
                      }
                      alt={req.senderFullName}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {req.senderFullName}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          (@{req.senderUsername})
                        </span>
                      </p>
                      <p className="text-xs text-slate-600 italic">"{req.message}"</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      onClick={() =>
                        handleRespondRequest(req.id, 'ACCEPTED', req.senderFullName)
                      }
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleRespondRequest(req.id, 'REJECTED', req.senderFullName)
                      }
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Suggested Smart Skill Matches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Recommended Skill Matches For You</span>
            </h2>
            <p className="text-xs text-slate-500">
              Matched based on what you want to learn and what peers can teach
            </p>
          </div>
          <Link
            to="/discover"
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center"
          >
            Explore All Peers
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {stats?.suggestedMatches && stats.suggestedMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stats.suggestedMatches.map((match, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Match Score & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        match.matchType === 'MUTUAL_MATCH'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      {match.matchType === 'MUTUAL_MATCH' ? '★ 2-Way Swap' : 'Matching Skill'}
                    </span>
                    <span className="text-xs font-extrabold text-indigo-600">
                      {match.matchScore}% Match
                    </span>
                  </div>

                  {/* User Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={
                        match.user.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          match.user.fullName || 'User'
                        )}&background=4f46e5&color=fff`
                      }
                      alt={match.user.fullName}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {match.user.fullName}
                      </h4>
                      <p className="text-xs text-slate-500">@{match.user.username}</p>
                    </div>
                  </div>

                  {/* Match Reason */}
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 leading-relaxed">
                    {match.matchReason}
                  </p>

                  {/* Skills they teach */}
                  {match.matchingSkillsToLearn.length > 0 && (
                    <div className="text-xs mb-2">
                      <span className="font-semibold text-slate-700">They can teach you: </span>
                      <span className="font-bold text-indigo-600">
                        {match.matchingSkillsToLearn.join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Skills you teach */}
                  {match.matchingSkillsToTeach.length > 0 && (
                    <div className="text-xs">
                      <span className="font-semibold text-slate-700">You can teach them: </span>
                      <span className="font-bold text-emerald-600">
                        {match.matchingSkillsToTeach.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => setViewUser(match.user)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    View Profile
                  </button>

                  {match.user.connectionStatus === 'CONNECTED' ? (
                    <button
                      onClick={() => setProposePartner(match.user)}
                      className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      Propose Swap
                    </button>
                  ) : match.user.connectionStatus === 'PENDING_OUTGOING' ? (
                    <span className="flex-1 py-2 text-center text-xs font-medium text-amber-700 bg-amber-50 rounded-xl">
                      Request Sent
                    </span>
                  ) : (
                    <button
                      onClick={() => setConnectUser(match.user)}
                      className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800">No Match Suggestions Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add the skills you want to learn to your profile so our matching engine can find peers who teach them!
            </p>
            <Link
              to="/my-skills"
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              Add Desired Skills
            </Link>
          </div>
        )}
      </div>

      {/* Active Learning Exchanges Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-indigo-600" />
              <span>Active Peer Learning Exchanges</span>
            </h2>
            <p className="text-xs text-slate-500">
              Coordinated learning sessions with your connected peers
            </p>
          </div>
          <Link
            to="/exchanges"
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center"
          >
            All Exchanges ({stats?.recentExchanges?.length || 0})
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {stats?.recentExchanges && stats.recentExchanges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.recentExchanges.map((ex) => (
              <div
                key={ex.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        ex.status === 'IN_PROGRESS'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : ex.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {ex.status.replace('_', ' ')}
                    </span>
                    {ex.scheduleInfo && (
                      <span className="text-[11px] text-slate-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {ex.scheduleInfo}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{ex.title}</h3>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-slate-400 font-semibold uppercase text-[10px]">
                        {ex.initiatorFullName} teaches:
                      </p>
                      <p className="font-bold text-indigo-600 mt-0.5">
                        {ex.initiatorSkillName}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold uppercase text-[10px]">
                        {ex.partnerFullName} teaches:
                      </p>
                      <p className="font-bold text-emerald-600 mt-0.5">
                        {ex.partnerSkillName}
                      </p>
                    </div>
                  </div>

                  {ex.learningGoals && (
                    <p className="mt-3 text-xs text-slate-600 line-clamp-2">
                      <span className="font-semibold text-slate-700">Goals: </span>
                      {ex.learningGoals}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Partner:{' '}
                    <strong className="text-slate-700">
                      {ex.initiatorId === user?.id ? ex.partnerFullName : ex.initiatorFullName}
                    </strong>
                  </span>
                  <Link
                    to="/exchanges"
                    className="font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Manage Exchange →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <ArrowLeftRight className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800">No Active Skill Exchanges</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once you connect with peers, you can coordinate 1-on-1 informal skill exchanges!
            </p>
            <Link
              to="/discover"
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              Find a Partner to Exchange With
            </Link>
          </div>
        )}
      </div>

      {/* Modals */}
      {connectUser && (
        <ConnectModal
          user={connectUser}
          onClose={() => setConnectUser(null)}
          onSuccess={(msg) => {
            setAlert({ type: 'success', message: msg });
            loadDashboard();
          }}
        />
      )}

      {proposePartner && (
        <ProposeExchangeModal
          partner={proposePartner}
          onClose={() => setProposePartner(null)}
          onSuccess={(msg) => {
            setAlert({ type: 'success', message: msg });
            loadDashboard();
          }}
        />
      )}

      {viewUser && (
        <UserProfileModal
          user={viewUser}
          onClose={() => setViewUser(null)}
          onConnect={(u) => setConnectUser(u)}
          onProposeExchange={(u) => setProposePartner(u)}
        />
      )}
    </div>
  );
}
