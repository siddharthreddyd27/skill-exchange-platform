import { useState, useEffect } from 'react';
import { exchangeService } from '../services/exchangeService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { 
  BookOpen, 
  ArrowLeftRight, 
  Calendar, 
  CheckCircle2, 
  PlayCircle, 
  Clock, 
  FileText, 
  X, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function Exchanges() {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [alert, setAlert] = useState(null);

  // Edit notes modal
  const [notesModalExchange, setNotesModalExchange] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [updatingNotes, setUpdatingNotes] = useState(false);

  const loadExchanges = async () => {
    setLoading(true);
    try {
      const data = await exchangeService.getMyExchanges(statusFilter || null);
      setExchanges(data);
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to load skill exchanges',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExchanges();
  }, [statusFilter]);

  const handleUpdateStatus = async (exchangeId, newStatus, currentNotes) => {
    try {
      await exchangeService.updateStatus(exchangeId, newStatus, currentNotes);
      setAlert({
        type: 'success',
        message: `Exchange status updated to ${newStatus.replace('_', ' ')}!`,
      });
      loadExchanges();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update status',
      });
    }
  };

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    if (!notesModalExchange) return;
    setUpdatingNotes(true);
    try {
      await exchangeService.updateStatus(
        notesModalExchange.id,
        notesModalExchange.status,
        notesText.trim()
      );
      setAlert({
        type: 'success',
        message: 'Exchange session notes updated!',
      });
      setNotesModalExchange(null);
      loadExchanges();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update notes',
      });
    } finally {
      setUpdatingNotes(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PROPOSED':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Proposed
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            Accepted & Ready
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            In Progress
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✓ Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-indigo-600" />
          <span>Peer Skill Exchanges</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Coordinate learning sessions, review mutual progress, and share feedback
        </p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Status Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] shrink-0 mr-1">
          Filter Status:
        </span>
        {['', 'PROPOSED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
              statusFilter === s
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s === '' ? 'All Exchanges' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Exchanges List */}
      {loading ? (
        <LoadingSpinner message="Loading your exchanges..." />
      ) : exchanges.length > 0 ? (
        <div className="space-y-5">
          {exchanges.map((ex) => {
            const isInitiator = ex.initiatorId === user?.id;
            const partnerName = isInitiator ? ex.partnerFullName : ex.initiatorFullName;
            const partnerAvatar = isInitiator ? ex.partnerAvatarUrl : ex.initiatorAvatarUrl;
            const partnerUsername = isInitiator ? ex.partnerUsername : ex.initiatorUsername;

            return (
              <div
                key={ex.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        partnerAvatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          partnerName || 'User'
                        )}&background=4f46e5&color=fff`
                      }
                      alt={partnerName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{ex.title}</h3>
                      <p className="text-xs text-slate-500">
                        Exchange Partner: <strong className="text-slate-800">{partnerName}</strong> (@{partnerUsername})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    {getStatusBadge(ex.status)}
                  </div>
                </div>

                {/* Skills Swap Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs text-indigo-700 font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{ex.initiatorFullName} will teach:</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">
                      {ex.initiatorSkillName}
                    </p>
                    <p className="text-xs text-slate-500">Category: {ex.initiatorSkillCategory}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{ex.partnerFullName} will teach:</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">
                      {ex.partnerSkillName}
                    </p>
                    <p className="text-xs text-slate-500">Category: {ex.partnerSkillCategory}</p>
                  </div>
                </div>

                {/* Schedule & Learning Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                  {ex.scheduleInfo && (
                    <div className="flex items-start space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700 block">Cadence / Schedule:</span>
                        <span>{ex.scheduleInfo}</span>
                      </div>
                    </div>
                  )}

                  {ex.learningGoals && (
                    <div className="flex items-start space-x-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700 block">Learning Goals:</span>
                        <span>{ex.learningGoals}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Session Notes / Logs */}
                {ex.notes && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                    <span className="font-bold block mb-1">Session Notes & Progress:</span>
                    <p className="whitespace-pre-line leading-relaxed">{ex.notes}</p>
                  </div>
                )}

                {/* Status Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => {
                      setNotesModalExchange(ex);
                      setNotesText(ex.notes || '');
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    {ex.notes ? 'Edit Session Notes' : '+ Add Session Notes'}
                  </button>

                  <div className="flex items-center space-x-2">
                    {/* Partner can ACCEPT if PROPOSED */}
                    {ex.status === 'PROPOSED' && !isInitiator && (
                      <button
                        onClick={() => handleUpdateStatus(ex.id, 'ACCEPTED', ex.notes)}
                        className="inline-flex items-center px-3.5 py-1.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Accept Proposal
                      </button>
                    )}

                    {/* Both can start if ACCEPTED */}
                    {ex.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateStatus(ex.id, 'IN_PROGRESS', ex.notes)}
                        className="inline-flex items-center px-3.5 py-1.5 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5 mr-1" />
                        Start Exchange
                      </button>
                    )}

                    {/* Both can complete if IN_PROGRESS */}
                    {ex.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleUpdateStatus(ex.id, 'COMPLETED', ex.notes)}
                        className="inline-flex items-center px-3.5 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Mark as Completed
                      </button>
                    )}

                    {/* Cancel button if not completed or cancelled */}
                    {ex.status !== 'COMPLETED' && ex.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleUpdateStatus(ex.id, 'CANCELLED', ex.notes)}
                        className="inline-flex items-center px-3 py-1.5 font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <ArrowLeftRight className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">No Exchanges Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Connect with peers and propose a mutual skill swap to coordinate informal learning here.
          </p>
        </div>
      )}

      {/* Edit Notes Modal */}
      {notesModalExchange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Exchange Session Notes</h3>
              <button
                onClick={() => setNotesModalExchange(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Session Log & Learning Notes
                </label>
                <textarea
                  rows={5}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Record topics discussed, links to shared materials, next practice exercises..."
                  className="w-full text-sm rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNotesModalExchange(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingNotes}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  {updatingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
