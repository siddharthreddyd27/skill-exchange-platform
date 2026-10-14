import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { skillService } from '../services/skillService';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import SkillCard from '../components/SkillCard';
import { 
  User, 
  Mail, 
  MapPin, 
  Tag, 
  Edit3, 
  Sparkles, 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  Check, 
  X,
  Camera
} from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [alert, setAlert] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    avatarUrl: '',
    interests: '',
    location: '',
  });
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await userService.getMyProfile();
      setProfile(data);
      setFormData({
        fullName: data.fullName || '',
        bio: data.bio || '',
        avatarUrl: data.avatarUrl || '',
        interests: data.interests || '',
        location: data.location || '',
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to load user profile',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      const updated = await userService.updateMyProfile(formData);
      setProfile(updated);
      updateUser(updated);
      setEditing(false);
      setAlert({
        type: 'success',
        message: 'Your profile has been successfully updated!',
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner message="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Main Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Color Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 relative" />

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
            <div className="flex items-end space-x-4">
              <img
                src={
                  profile?.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile?.fullName || 'User'
                  )}&background=4f46e5&color=fff`
                }
                alt={profile?.fullName}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white shrink-0"
              />
              <div className="mb-1">
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  {profile?.fullName}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  @{profile?.username} • Member since {new Date(profile?.createdAt).getFullYear()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditing(!editing)}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                {editing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Edit Form */}
          {editing ? (
            <form onSubmit={handleSaveProfile} className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Update Profile Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Toronto, Canada"
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Profile Picture URL or Choose Avatar
                </label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mb-2"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400">Quick avatars:</span>
                  {sampleAvatars.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="avatar option"
                      onClick={() => setFormData({ ...formData, avatarUrl: url })}
                      className={`w-7 h-7 rounded-full cursor-pointer hover:scale-110 transition-transform ${
                        formData.avatarUrl === url ? 'ring-2 ring-indigo-600' : 'opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Interests / Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="e.g. Web Development, Photography, Spanish, Acoustic Guitar"
                  className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Bio / About Me
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell peers what you love to build, teach, and explore..."
                  className="w-full text-sm rounded-xl border border-slate-200 p-2.5 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-4 space-y-4">
              {/* Bio */}
              <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
                {profile?.bio || (
                  <span className="italic text-slate-400">
                    No bio added yet. Click 'Edit Profile' to share a bit about yourself!
                  </span>
                )}
              </p>

              {/* Meta row: Email, Location, Interests */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile?.email}</span>
                </div>

                {profile?.location && (
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.location}</span>
                  </div>
                )}

                <div className="flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile?.totalConnections || 0} Connected Peers</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile?.totalExchanges || 0} Total Exchanges</span>
                </div>
              </div>

              {/* Interests Tags */}
              {profile?.interests && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {profile.interests.split(',').map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700"
                    >
                      {item.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Teaching Skills Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Skills I Can Teach ({profile?.teachingSkills?.length || 0})</span>
          </h2>
        </div>

        {profile?.teachingSkills && profile.teachingSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profile.teachingSkills.map((s) => (
              <SkillCard key={s.id} skill={s} isTeaching={true} readOnly={true} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No teaching skills listed yet. Add skills on the 'My Skills' page!
          </div>
        )}
      </div>

      {/* Learning Wishlist Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Skills I Want to Learn ({profile?.learningSkills?.length || 0})</span>
          </h2>
        </div>

        {profile?.learningSkills && profile.learningSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profile.learningSkills.map((s) => (
              <SkillCard key={s.id} skill={s} isTeaching={false} readOnly={true} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No learning wishlist skills listed yet.
          </div>
        )}
      </div>
    </div>
  );
}
