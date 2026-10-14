import { X, MapPin, Sparkles, BookOpen, Clock, UserPlus, ArrowLeftRight } from 'lucide-react';

export default function UserProfileModal({
  user,
  onClose,
  onConnect,
  onProposeExchange,
}) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Banner & Close */}
        <div className="h-24 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 relative p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Details Header */}
        <div className="px-6 pb-4 -mt-12 relative flex items-end justify-between border-b border-slate-100">
          <div className="flex items-end space-x-4">
            <img
              src={
                user.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.fullName || 'User'
                )}&background=4f46e5&color=fff`
              }
              alt={user.fullName}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white shrink-0"
            />
            <div className="mb-1">
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                {user.fullName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">@{user.username}</p>
              {user.location && (
                <p className="flex items-center text-xs text-slate-400 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span>{user.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              About
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {user.bio || 'No bio provided yet.'}
            </p>
          </div>

          {/* Interests */}
          {user.interests && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Interests & Topics
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.split(',').map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg"
                  >
                    {interest.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Teaching Skills */}
          <div>
            <div className="flex items-center space-x-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Skills {user.fullName} Can Teach
              </h4>
            </div>
            {user.teachingSkills && user.teachingSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {user.teachingSkills.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-indigo-600 uppercase">
                          {s.category}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-sm bg-white font-semibold text-slate-700 border border-slate-200">
                          {s.proficiencyLevel}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{s.skillName}</p>
                      {s.description && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {s.description}
                        </p>
                      )}
                    </div>
                    {s.yearsOfExperience !== null && s.yearsOfExperience !== undefined && (
                      <p className="flex items-center text-[11px] text-slate-500 mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {s.yearsOfExperience} yrs experience
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-slate-400">None listed yet.</p>
            )}
          </div>

          {/* Learning Skills */}
          <div>
            <div className="flex items-center space-x-1.5 mb-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Skills {user.fullName} Wants to Learn
              </h4>
            </div>
            {user.learningSkills && user.learningSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {user.learningSkills.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-emerald-600 uppercase">
                          {s.category}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-sm bg-white font-semibold text-slate-700 border border-slate-200">
                          {s.proficiencyLevel}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{s.skillName}</p>
                      {s.description && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {s.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-slate-400">None listed yet.</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            Close
          </button>

          {user.connectionStatus === 'CONNECTED' ? (
            <button
              onClick={() => {
                onClose();
                onProposeExchange(user);
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4 mr-1.5" />
              Propose Exchange
            </button>
          ) : user.connectionStatus === 'NONE' ? (
            <button
              onClick={() => {
                onClose();
                onConnect(user);
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Connect
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
