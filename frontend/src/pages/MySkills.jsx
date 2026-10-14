import { useState, useEffect } from 'react';
import { skillService } from '../services/skillService';
import SkillCard from '../components/SkillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { 
  Sparkles, 
  BookOpen, 
  Plus, 
  X, 
  Award, 
  Check, 
  Layers 
} from 'lucide-react';

export default function MySkills() {
  const [activeTab, setActiveTab] = useState('TEACH'); // 'TEACH' or 'LEARN'
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isCustomSkill, setIsCustomSkill] = useState(false);
  const [formData, setFormData] = useState({
    skillId: '',
    skillName: '',
    category: '',
    proficiencyLevel: 'INTERMEDIATE',
    description: '',
    yearsOfExperience: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const [teach, learn, catalog, cats] = await Promise.all([
        skillService.getMySkills('TEACH'),
        skillService.getMySkills('LEARN'),
        skillService.getAllSkills(),
        skillService.getCategories(),
      ]);
      setTeachSkills(teach);
      setLearnSkills(learn);
      setCatalogSkills(catalog);
      setCategories(cats);
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to load skills list',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setIsCustomSkill(false);
    setFormData({
      skillId: catalogSkills.length > 0 ? catalogSkills[0].id : '',
      skillName: '',
      category: categories.length > 0 ? categories[0] : 'Programming',
      proficiencyLevel: activeTab === 'TEACH' ? 'ADVANCED' : 'BEGINNER',
      description: '',
      yearsOfExperience: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (userSkill) => {
    setEditingSkill(userSkill);
    setIsCustomSkill(false);
    setFormData({
      skillId: userSkill.skillId,
      skillName: userSkill.skillName,
      category: userSkill.category,
      proficiencyLevel: userSkill.proficiencyLevel,
      description: userSkill.description || '',
      yearsOfExperience:
        userSkill.yearsOfExperience !== null && userSkill.yearsOfExperience !== undefined
          ? String(userSkill.yearsOfExperience)
          : '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);

    try {
      if (editingSkill) {
        // Update existing skill
        await skillService.updateMySkill(editingSkill.id, {
          proficiencyLevel: formData.proficiencyLevel,
          description: formData.description.trim(),
          yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : null,
        });
        setAlert({
          type: 'success',
          message: `Updated details for ${editingSkill.skillName}!`,
        });
      } else {
        // Add new skill
        await skillService.addMySkill({
          skillId: isCustomSkill ? null : Number(formData.skillId),
          skillName: isCustomSkill ? formData.skillName.trim() : null,
          category: isCustomSkill ? formData.category.trim() : null,
          skillType: activeTab,
          proficiencyLevel: formData.proficiencyLevel,
          description: formData.description.trim(),
          yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : null,
        });
        setAlert({
          type: 'success',
          message: `Added new skill to your ${activeTab === 'TEACH' ? 'Teaching' : 'Learning'} list!`,
        });
      }
      setModalOpen(false);
      loadSkills();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save skill',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userSkill) => {
    if (window.confirm(`Are you sure you want to remove "${userSkill.skillName}" from your profile?`)) {
      try {
        await skillService.deleteMySkill(userSkill.id);
        setAlert({
          type: 'success',
          message: `Removed ${userSkill.skillName} from your profile.`,
        });
        loadSkills();
      } catch (err) {
        setAlert({
          type: 'error',
          message: err.response?.data?.message || 'Failed to remove skill',
        });
      }
    }
  };

  const currentSkills = activeTab === 'TEACH' ? teachSkills : learnSkills;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-600" />
            <span>My Skills Portfolio</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage the skills you can teach to peers and the skills you want to learn in exchange
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          {activeTab === 'TEACH' ? 'Add Skill I Can Teach' : 'Add Skill to Learn'}
        </button>
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
            onClick={() => setActiveTab('TEACH')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'TEACH'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Skills I Can Teach ({teachSkills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('LEARN')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'LEARN'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Skills I Want to Learn ({learnSkills.length})</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading your skills..." />
      ) : currentSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSkills.map((s) => (
            <SkillCard
              key={s.id}
              skill={s}
              isTeaching={activeTab === 'TEACH'}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            {activeTab === 'TEACH' ? (
              <Sparkles className="w-8 h-8" />
            ) : (
              <BookOpen className="w-8 h-8" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {activeTab === 'TEACH'
                ? 'You haven’t listed any teaching skills yet'
                : 'Your learning wishlist is empty'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {activeTab === 'TEACH'
                ? 'Share your expertise! Whether it’s software development, photography, or languages, listing what you know helps other members discover you.'
                : 'What would you like to master? Add skills you want to learn so other members can offer knowledge exchanges.'}
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {activeTab === 'TEACH' ? 'Add Teaching Skill' : 'Add Desired Skill'}
          </button>
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingSkill
                      ? `Edit ${editingSkill.skillName}`
                      : activeTab === 'TEACH'
                      ? 'Add Skill I Can Teach'
                      : 'Add Skill to Learn'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeTab === 'TEACH' ? 'Teaching skill' : 'Learning wishlist item'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {!editingSkill && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Select Skill
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomSkill(!isCustomSkill)}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      {isCustomSkill ? '← Pick from Catalog' : '+ Create Custom Skill'}
                    </button>
                  </div>

                  {!isCustomSkill ? (
                    <select
                      value={formData.skillId}
                      onChange={(e) => setFormData({ ...formData, skillId: e.target.value })}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                      required
                    >
                      {catalogSkills.map((sk) => (
                        <option key={sk.id} value={sk.id}>
                          {sk.name} ({sk.category})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.skillName}
                        onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                        placeholder="Enter skill name (e.g. Kotlin, Origami, Piano)"
                        className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        required
                      />
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Category (e.g. Programming, Music, Language, Cooking)"
                        className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Proficiency Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Proficiency Level
                </label>
                <select
                  value={formData.proficiencyLevel}
                  onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value })}
                  className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
                >
                  <option value="BEGINNER">Beginner (Foundations & Basics)</option>
                  <option value="INTERMEDIATE">Intermediate (Practical Working Knowledge)</option>
                  <option value="ADVANCED">Advanced (In-depth Mastery)</option>
                  <option value="EXPERT">Expert (Senior Professional / Native)</option>
                </select>
              </div>

              {/* Years of Experience (if teaching) */}
              {activeTab === 'TEACH' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Years of Experience (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      setFormData({ ...formData, yearsOfExperience: e.target.value })
                    }
                    placeholder="e.g. 3"
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {activeTab === 'TEACH'
                    ? 'What specific areas or projects can you teach?'
                    : 'What specific topics or goals do you want to learn?'}
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={
                    activeTab === 'TEACH'
                      ? 'e.g. Building full-stack APIs, debugging, setting up databases...'
                      : 'e.g. Want to learn conversational speaking, grammar basics, or code review...'
                  }
                  className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-200 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  {submitting ? 'Saving...' : editingSkill ? 'Save Changes' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
