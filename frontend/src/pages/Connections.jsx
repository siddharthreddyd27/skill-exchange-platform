import { useState, useEffect } from 'react';
import { connectionService } from '../services/connectionService';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import UserProfileModal from '../components/UserProfileModal';
import ProposeExchangeModal from '../components/ProposeExchangeModal';
import { 
  Users, 
  ArrowLeftRight, 
  Check, 
  X, 
  Clock, 
  Send, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  MessageSquare,
  Eye
} from 'lucide-react';

export default function Connections() {
  const [activeTab, setActiveTab] = useState('PEERS'); // 'PEERS', 'INCOMING', 'OUTGOING'
  const [peers, setPeers] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Modals
  const [viewUser, setViewUser] = useState(null);
  const [proposePartner, setProposePartner] = useState(null);

  const loadConnections = async () => {
    setLoading(true);
    try {
      const [peersData, incomingData, outgoingData] = await Promise.all([
        connectionService.getConnectedPeers(),
        connectionService.getIncomingRequests(),
        connectionService.getOutgoingRequests(),
      ]);
      setPeers(peersData);
      setIncoming(incomingData);
      setOutgoing(outgoingData);
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to load connections',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const handleRespond = async (id, status, senderName) => {
    try {
      await connectionService.respondToRequest(id, status);
      setAlert({
        type: 'success',
        message:
          status === 'ACCEPTED'
            ? `Connected with ${senderName}! You can now coordinate skill exchanges.`
            : `Declined request from ${senderName}.`,
      });
      loadConnections();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update request',
      });
    }
  };

  const pendingIncomingCount = incoming.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-7 h-7 text-indigo-600" />
          <span>Peer Connections</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Build your peer-to-peer network and coordinate mutual learning sessions
        </p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('PEERS')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'PEERS'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Connected Peers ({peers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('INCOMING')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'INCOMING'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              Incoming Requests
              {pendingIncomingCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-rose-100 text-rose-700 font-extrabold">
                  {pendingIncomingCount}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('OUTGOING')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'OUTGOING'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent Requests ({outgoing.length})</span>
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <LoadingSpinner message="Loading connections..." />
      ) : activeTab === 'PEERS' ? (
        /* Connected Peers Tab */
        peers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peers.map((peer) => (
              <div
                key={peer.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={
                        peer.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          peer.fullName || 'User'
                        )}&background=4f46e5&color=fff`
                      }
                      alt={peer.fullName}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {peer.fullName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">@{peer.username}</p>
                      {peer.location && (
                        <p className="flex items-center text-xs text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{peer.location}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {peer.bio && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {peer.bio}
                    </p>
                  )}

                  {/* Skills taught */}
                  {peer.teachingSkills && peer.teachingSkills.length > 0 && (
                    <div className="mb-2">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                        Can Teach:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {peer.teachingSkills.slice(0, 3).map((s) => (
                          <span
                            key={s.id}
                            className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100"
                          >
                            {s.skillName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills to learn */}
                  {peer.learningSkills && peer.learningSkills.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                        Wants to Learn:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {peer.learningSkills.slice(0, 3).map((s) => (
                          <span
                            key={s.id}
                            className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100"
                          >
                            {s.skillName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => setViewUser(peer)}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                    title="View Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setProposePartner(peer)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
                    Propose Skill Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <Users className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">No Connected Peers Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse members on the Discover page and send connection requests to start learning from each other!
            </p>
          </div>
        )
      ) : activeTab === 'INCOMING' ? (
        /* Incoming Requests Tab */
        incoming.length > 0 ? (
          <div className="space-y-3">
            {incoming.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={
                      req.senderAvatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        req.senderFullName || 'User'
                      )}&background=4f46e5&color=fff`
                    }
                    alt={req.senderFullName}
                    className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-indigo-50"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {req.senderFullName}{' '}
                      <span className="text-xs font-medium text-slate-500">
                        (@{req.senderUsername})
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 italic bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-xl">
                      "{req.message}"
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Received on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  {req.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleRespond(req.id, 'ACCEPTED', req.senderFullName)}
                        className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                      >
                        <Check className="w-4 h-4 mr-1.5" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(req.id, 'REJECTED', req.senderFullName)}
                        className="inline-flex items-center px-4 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <X className="w-4 h-4 mr-1.5" />
                        Decline
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                        req.status === 'ACCEPTED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">No Incoming Requests</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When peers reach out to connect and swap skills with you, their requests will appear here.
            </p>
          </div>
        )
      ) : (
        /* Sent Requests Tab */
        outgoing.length > 0 ? (
          <div className="space-y-3">
            {outgoing.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={
                      req.receiverAvatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        req.receiverFullName || 'User'
                      )}&background=4f46e5&color=fff`
                    }
                    alt={req.receiverFullName}
                    className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-indigo-50"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Sent to {req.receiverFullName}{' '}
                      <span className="text-xs font-medium text-slate-500">
                        (@{req.receiverUsername})
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 italic bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-xl">
                      "{req.message}"
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Sent on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                      req.status === 'ACCEPTED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : req.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <Send className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">No Sent Requests</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Find partners on the Discover page to send connection requests!
            </p>
          </div>
        )
      )}

      {/* Modals */}
      {viewUser && (
        <UserProfileModal
          user={viewUser}
          onClose={() => setViewUser(null)}
          onProposeExchange={(u) => setProposePartner(u)}
        />
      )}

      {proposePartner && (
        <ProposeExchangeModal
          partner={proposePartner}
          onClose={() => setProposePartner(null)}
          onSuccess={(msg) => {
            setAlert({ type: 'success', message: msg });
            loadConnections();
          }}
        />
      )}
    </div>
  );
}
