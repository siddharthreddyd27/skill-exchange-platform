import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { skillService } from '../services/skillService';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';
import UserProfileModal from '../components/UserProfileModal';
import ConnectModal from '../components/ConnectModal';
import ProposeExchangeModal from '../components/ProposeExchangeModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { Search, Filter, Sparkles, Users, RefreshCw } from 'lucide-react';

export default function Discover() {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [alert, setAlert] = useState(null);

  // Modals
  const [viewUser, setViewUser] = useState(null);
  const [connectUser, setConnectUser] = useState(null);
  const [proposePartner, setProposePartner] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, categoriesData] = await Promise.all([
        selectedCategory || searchQuery
          ? userService.filterBySkill(searchQuery, selectedCategory)
          : userService.searchUsers(''),
        skillService.getCategories(),
      ]);
      setUsers(usersData);
      setCategories(categoriesData);
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to load skill exchange peers',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Search className="w-7 h-7 text-indigo-600" />
            <span>Discover Skills & Peers</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse through teachers and peers willing to exchange skills across various fields
          </p>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Search & Category Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill name, programming language, instrument, or topic..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Reset Filters */}
          {(searchQuery || selectedCategory) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              className="inline-flex items-center px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] shrink-0 mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1" />
            Categories:
          </span>
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
              selectedCategory === ''
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Skills
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-slate-500">
            Showing <span className="text-slate-800 font-bold">{users.length}</span> potential skill-exchange {users.length === 1 ? 'partner' : 'partners'}
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Searching matching peers..." />
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((peer) => (
              <UserCard
                key={peer.id}
                user={peer}
                onViewProfile={(u) => setViewUser(u)}
                onConnect={(u) => {
                  if (!isAuthenticated) {
                    window.location.href = '/login';
                  } else {
                    setConnectUser(u);
                  }
                }}
                onProposeExchange={(u) => {
                  if (!isAuthenticated) {
                    window.location.href = '/login';
                  } else {
                    setProposePartner(u);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">No Matching Peers Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any users teaching that skill right now. Try clearing your search query or exploring a different category!
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewUser && (
        <UserProfileModal
          user={viewUser}
          onClose={() => setViewUser(null)}
          onConnect={(u) => setConnectUser(u)}
          onProposeExchange={(u) => setProposePartner(u)}
        />
      )}

      {connectUser && (
        <ConnectModal
          user={connectUser}
          onClose={() => setConnectUser(null)}
          onSuccess={(msg) => {
            setAlert({ type: 'success', message: msg });
            loadData();
          }}
        />
      )}

      {proposePartner && (
        <ProposeExchangeModal
          partner={proposePartner}
          onClose={() => setProposePartner(null)}
          onSuccess={(msg) => {
            setAlert({ type: 'success', message: msg });
            loadData();
          }}
        />
      )}
    </div>
  );
}
