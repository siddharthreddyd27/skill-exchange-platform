import { ArrowLeftRight, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-lg">SkillExchange</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              A peer-to-peer informal skill-sharing community. Teach what you already know, learn what you love, and grow together without fees or paywalls.
            </p>
            <div className="flex items-center text-xs text-slate-400 space-x-1 pt-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>for informal knowledge exchange</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/discover" className="hover:text-indigo-600 transition-colors">
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/connections" className="hover:text-indigo-600 transition-colors">
                  Peer Connections
                </Link>
              </li>
              <li>
                <Link to="/exchanges" className="hover:text-indigo-600 transition-colors">
                  Skill Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Philosophy / Features */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Why SkillExchange?
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>100% Free peer-to-peer learning</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Mutual skill swap matching</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Direct 1-on-1 coordination</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span>No courses, certificates, or fees</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Skill Exchange Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built with Spring Boot & React</p>
        </div>
      </div>
    </footer>
  );
}
