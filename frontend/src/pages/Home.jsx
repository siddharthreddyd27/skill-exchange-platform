import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeftRight, 
  Sparkles, 
  BookOpen, 
  Users, 
  Search, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/60 via-slate-50 to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Informal Peer-to-Peer Knowledge Swap</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight md:leading-tight">
            Teach what you know.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
              Learn what you love.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect directly with peers to exchange real-world skills. No courses, no invoices, no subscriptions—just mutual knowledge sharing.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all text-base"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all text-base"
                >
                  Join the Platform
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all text-base"
                >
                  Explore Demo Accounts
                </Link>
              </>
            )}

            <Link
              to="/discover"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-indigo-600 hover:text-indigo-800 transition-colors text-base"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Skills Catalog
            </Link>
          </div>

          {/* Interactive Feature Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">List Your Skills</h4>
              <p className="text-xs text-slate-500 mt-1">
                Add skills you can teach and skills you want to learn.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Discover Peers</h4>
              <p className="text-xs text-slate-500 mt-1">
                Search teachers by skill, proficiency, or category.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Smart Matching</h4>
              <p className="text-xs text-slate-500 mt-1">
                Find mutual swaps where they teach what you need!
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-2 font-bold text-sm">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Coordinate Swaps</h4>
              <p className="text-xs text-slate-500 mt-1">
                Propose sessions and track learning progress together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Value Prop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Informal Peer Exchange
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Why pay hundreds for pre-recorded courses when you can practice live with a peer?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Everyone has a valuable skill—whether it's web development, guitar fingerstyle, conversational Spanish, UI design, or chess strategy. SkillExchange matches you with peers who want what you know and know what you want.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-sm text-indigo-200">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>Zero financial cost</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-indigo-200">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>Hands-on practice & feedback</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-indigo-200">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>Flexible schedules</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
