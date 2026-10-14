import { BookOpen, Sparkles, Award, Edit2, Trash2, Clock } from 'lucide-react';

export default function SkillCard({
  skill,
  onEdit,
  onDelete,
  readOnly = false,
  isTeaching = true,
}) {
  const proficiencyColors = {
    BEGINNER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    INTERMEDIATE: 'bg-sky-50 text-sky-700 border-sky-200',
    ADVANCED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    EXPERT: 'bg-amber-50 text-amber-700 border-amber-200',
  }[skill.proficiencyLevel] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Header: Category & Proficiency */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {skill.category || 'General'}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${proficiencyColors}`}
          >
            {skill.proficiencyLevel}
          </span>
        </div>

        {/* Skill Name */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
          {isTeaching ? (
            <Award className="w-5 h-5 text-indigo-500 shrink-0" />
          ) : (
            <BookOpen className="w-5 h-5 text-emerald-500 shrink-0" />
          )}
          <span>{skill.skillName || skill.name}</span>
        </h3>

        {/* Description / Notes */}
        {skill.description ? (
          <p className="mt-2 text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {skill.description}
          </p>
        ) : (
          <p className="mt-2 text-xs italic text-slate-400">No additional description provided.</p>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-1">
          {skill.yearsOfExperience !== null && skill.yearsOfExperience !== undefined && (
            <span className="inline-flex items-center text-slate-600 font-medium">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'yr' : 'yrs'} exp
            </span>
          )}
        </div>

        {!readOnly && (
          <div className="flex items-center space-x-1">
            {onEdit && (
              <button
                onClick={() => onEdit(skill)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit Skill Details"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(skill)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Remove Skill"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
