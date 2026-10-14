import { MapPin, Sparkles, BookOpen, UserPlus, Check, Clock, ArrowLeftRight, Eye } from 'lucide-react';

export default function UserCard({
  user,
  onViewProfile,
  onConnect,
  onProposeExchange,
}) {
  const getConnectButton = () => {
    switch (user.connectionStatus) {
      case 'CONNECTED':
        return (
          <button
            onClick={() => onProposeExchange(user)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
            Propose Swap
          </button>
        );
      case 'PENDING_OUTGOING':
        return (
          <span className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-xl">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
            Request Sent
          </span>
        );
      case 'PENDING_INCOMING':
        return (
          <span className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
            Pending Your Approval
          </span>
        );
      default:
        return (
          <button
            onClick={() => onConnect(user)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors border border-slate-200"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Connect
          </button>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all flex flex-col justify-between group">
      <div>
        {/* User Info Header */}
        <div className="flex items-start space-x-3.5">
          <img
            src={
              user.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.fullName || 'User'
              )}&background=4f46e5&color=fff`
            }
            alt={user.fullName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-50 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                {user.fullName}
              </h4>
            </div>
            <p className="text-xs text-slate-500 font-medium">@{user.username}</p>

            {user.location && (
              <p className="flex items-center text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3 mr-1 shrink-0 text-slate-400" />
                <span className="truncate">{user.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio ? (
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {user.bio}
          </p>
        ) : (
          <p className="mt-3 text-xs italic text-slate-400">No bio provided yet.</p>
        )}

        {/* Skills Taught */}
        <div className="mt-4">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-1 mb-1.5">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Can Teach ({user.teachingSkills?.length || 0})</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {user.teachingSkills && user.teachingSkills.length > 0 ? (
              user.teachingSkills.slice(0, 3).map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {s.skillName}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">None listed</span>
            )}
            {user.teachingSkills && user.teachingSkills.length > 3 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{user.teachingSkills.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mt-3">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center space-x-1 mb-1.5">
            <BookOpen className="w-3 h-3 text-emerald-500" />
            <span>Wants to Learn ({user.learningSkills?.length || 0})</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {user.learningSkills && user.learningSkills.length > 0 ? (
              user.learningSkills.slice(0, 3).map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100"
                >
                  {s.skillName}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">None listed</span>
            )}
            {user.learningSkills && user.learningSkills.length > 3 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{user.learningSkills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center space-x-2">
        <button
          onClick={() => onViewProfile(user)}
          className="px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          title="View Full Profile"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
        {getConnectButton()}
      </div>
    </div>
  );
}
