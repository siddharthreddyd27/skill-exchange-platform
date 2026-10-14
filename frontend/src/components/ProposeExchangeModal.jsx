import { useState, useEffect } from 'react';
import { X, ArrowLeftRight, Calendar, BookOpen, Sparkles } from 'lucide-react';
import { skillService } from '../services/skillService';
import { exchangeService } from '../services/exchangeService';

export default function ProposeExchangeModal({ partner, onClose, onSuccess }) {
  const [myTeachSkills, setMyTeachSkills] = useState([]);
  const [partnerTeachSkills, setPartnerTeachSkills] = useState([]);
  const [initiatorSkillId, setInitiatorSkillId] = useState('');
  const [partnerSkillId, setPartnerSkillId] = useState('');
  const [title, setTitle] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [scheduleInfo, setScheduleInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSkills() {
      setLoading(true);
      try {
        const [mySkills, partnerSkills] = await Promise.all([
          skillService.getMySkills('TEACH'),
          skillService.getUserSkills(partner.id, 'TEACH'),
        ]);

        setMyTeachSkills(mySkills);
        setPartnerTeachSkills(partnerSkills);

        if (mySkills.length > 0) {
          setInitiatorSkillId(mySkills[0].skillId);
        }
        if (partnerSkills.length > 0) {
          setPartnerSkillId(partnerSkills[0].skillId);
        }

        // Set default title
        if (mySkills.length > 0 && partnerSkills.length > 0) {
          setTitle(`${mySkills[0].skillName} ⇄ ${partnerSkills[0].skillName} Skill Swap`);
        } else {
          setTitle(`Peer Learning Swap with ${partner.fullName}`);
        }
      } catch (err) {
        setError('Failed to load skills for exchange coordination');
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, [partner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!initiatorSkillId || !partnerSkillId) {
      setError('Please select both skills for the exchange');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await exchangeService.proposeExchange({
        partnerId: partner.id,
        initiatorSkillId: Number(initiatorSkillId),
        partnerSkillId: Number(partnerSkillId),
        title: title.trim(),
        learningGoals: learningGoals.trim(),
        scheduleInfo: scheduleInfo.trim(),
      });
      onSuccess?.(`Exchange proposal sent to ${partner.fullName}!`);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to propose skill exchange');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Propose Skill Exchange</h3>
              <p className="text-xs text-slate-500">Coordinate a peer-to-peer knowledge swap</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Skill Swap Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            {/* What you teach */}
            <div>
              <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>You Will Teach</span>
              </label>
              {myTeachSkills.length > 0 ? (
                <select
                  value={initiatorSkillId}
                  onChange={(e) => setInitiatorSkillId(e.target.value)}
                  className="w-full text-xs font-medium bg-white rounded-lg border border-slate-200 p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                >
                  {myTeachSkills.map((s) => (
                    <option key={s.skillId} value={s.skillId}>
                      {s.skillName} ({s.proficiencyLevel})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-rose-600 italic">
                  You haven't listed any skills you can teach yet.
                </p>
              )}
            </div>

            {/* What partner teaches */}
            <div>
              <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{partner.fullName.split(' ')[0]} Will Teach</span>
              </label>
              {partnerTeachSkills.length > 0 ? (
                <select
                  value={partnerSkillId}
                  onChange={(e) => setPartnerSkillId(e.target.value)}
                  className="w-full text-xs font-medium bg-white rounded-lg border border-slate-200 p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                >
                  {partnerTeachSkills.map((s) => (
                    <option key={s.skillId} value={s.skillId}>
                      {s.skillName} ({s.proficiencyLevel})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Partner hasn't listed teaching skills.
                </p>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Exchange Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly React and Spanish Exchange"
              className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Proposed Cadence / Schedule</span>
            </label>
            <input
              type="text"
              value={scheduleInfo}
              onChange={(e) => setScheduleInfo(e.target.value)}
              placeholder="e.g. Every Saturday at 10 AM, 1 hour session"
              className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Learning Goals */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Mutual Learning Goals & Focus Topics
            </label>
            <textarea
              rows={3}
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
              placeholder="What specific projects or topics will you tackle together?"
              className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || myTeachSkills.length === 0 || partnerTeachSkills.length === 0}
              className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-200 disabled:opacity-50 transition-all"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              {submitting ? 'Proposing...' : 'Propose Exchange'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
